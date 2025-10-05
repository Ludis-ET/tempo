import { env } from "@/lib/env";
import { ApiError, normalizeErrorPayload } from "@/lib/api-error";
import { tokenStorage } from "../storage";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function buildUrl(path: string, query?: Record<string, any>): string {
  if (!env.VITE_API_BASE_URL) throw new Error("VITE_API_BASE_URL is not set");
  const base = env.VITE_API_BASE_URL.replace(/\/$/, "");
  const url = new URL(base + path);
  if (query)
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      url.searchParams.set(k, String(v));
    });
  return url.toString();
}

// Get CSRF token from cookies (Django sets this)
function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const name = "csrftoken";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

// Ensure CSRF token is available by making a request to get it
async function ensureCsrfToken(): Promise<void> {
  if (getCsrfToken()) return; // Already have it

  try {
    // Make a GET request to a safe endpoint that will set the CSRF cookie
    // Using the current user endpoint which should be safe and set CSRF cookie
    await fetch(buildUrl("/api/v1/auth/current/"), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Even if it fails (401), the CSRF cookie should be set
  } catch (error) {
    // Silently fail - CSRF token might not be required
  }
}

async function request<T>(
  method: HttpMethod,
  path: string,
  opts?: { body?: any; query?: Record<string, any>; auth?: boolean }
): Promise<T> {
  const { body, query, auth = true } = opts || {};

  // For login requests, ensure CSRF token is available first
  if (path.includes("/auth/login/") && method === "POST") {
    await ensureCsrfToken();
  }

  const doFetch = async (): Promise<Response> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (auth) {
      const { access } = tokenStorage.get();
      if (access) headers["Authorization"] = `Bearer ${access}`;
    }

    // Add CSRF token for state-changing requests (Django requirement)
    // Note: Only refresh endpoint is exempt from CSRF in DRF JWT
    const isExemptFromCsrf = path.includes("/auth/refresh/");
    const csrfToken = getCsrfToken();
    if (
      csrfToken &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
      !isExemptFromCsrf
    ) {
      headers["X-CSRFToken"] = csrfToken;
    }

    return fetch(buildUrl(path, query), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
  };

  try {
    let res = await doFetch();
    if (res.status === 401 && auth) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        res = await doFetch();
      }
    }

    const raw = await res.text();

    if (!res.ok) {
      let payload: unknown = undefined;
      if (raw) {
        try {
          payload = JSON.parse(raw);
        } catch {
          payload = raw;
        }
      }
      const normalized = normalizeErrorPayload(payload, res.status);
      throw new ApiError({
        message: normalized.message,
        status: res.status,
        details: normalized.details,
        body: payload,
      });
    }

    if (!raw) {
      return undefined as unknown as T;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const baseMessage =
      error instanceof Error ? error.message : "Unknown network error";
    throw new ApiError({
      message:
        "We couldn’t reach the server. Check your connection and try again.",
      status: 0,
      details: baseMessage ? [baseMessage] : [],
      body: undefined,
    });
  }
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const { refresh } = tokenStorage.get();
    if (!refresh) return false;
    const url = "/api/v1/auth/refresh/";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add CSRF token for POST request
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }

    const res = await fetch(buildUrl(url), {
      method: "POST",
      headers,
      body: JSON.stringify({ refresh }),
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { access?: string; refresh?: string };
    tokenStorage.set({
      access: data.access ?? null,
      refresh: data.refresh ?? refresh,
    });
    return !!data.access;
  } catch {
    return false;
  }
}

export const apiClient = {
  get: <T>(path: string, query?: Record<string, any>, auth: boolean = true) =>
    request<T>("GET", path, { query, auth }),
  post: <T>(path: string, body?: any, auth: boolean = true) =>
    request<T>("POST", path, { body, auth }),
  put: <T>(path: string, body?: any, auth: boolean = true) =>
    request<T>("PUT", path, { body, auth }),
  patch: <T>(path: string, body?: any, auth: boolean = true) =>
    request<T>("PATCH", path, { body, auth }),
  delete: <T>(path: string, body?: any, auth: boolean = true) =>
    request<T>("DELETE", path, { body, auth }),
};
