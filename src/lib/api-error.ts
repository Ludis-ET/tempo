const STATUS_FALLBACKS: Record<number, string> = {
  0: "We couldn’t reach the server. Check your connection and try again.",
  400: "Some details need attention. Please review the highlighted fields.",
  401: "We couldn’t verify your credentials. Please sign in again.",
  403: "You don’t have permission to perform this action.",
  404: "We couldn’t find what you were looking for.",
  409: "This action conflicts with an existing record.",
  422: "Some details need attention. Please review the highlighted fields.",
  500: "Something went wrong on our side. Please try again later.",
};

const PRIORITY_KEYS = ["detail", "error", "message", "non_field_errors", "errors"];

function startCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function flattenMessages(payload: unknown, parentKey?: string): string[] {
  if (payload === null || payload === undefined) return [];
  if (typeof payload === "string") return [payload];
  if (Array.isArray(payload)) return payload.flatMap((item) => flattenMessages(item, parentKey));
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const collected: string[] = [];

    for (const key of PRIORITY_KEYS) {
      if (key in record) {
        collected.push(...flattenMessages(record[key], key));
      }
    }

    for (const [key, value] of Object.entries(record)) {
      if (PRIORITY_KEYS.includes(key)) continue;
      const prefix = key === parentKey ? undefined : startCase(key);
      const messages = flattenMessages(value, key);
      collected.push(
        ...messages.map((msg) => {
          if (!prefix) return msg;
          return `${prefix}: ${msg}`;
        }),
      );
    }

    return collected;
  }

  return [];
}

export class ApiError extends Error {
  status: number;
  details: string[];
  body: unknown;

  constructor({ message, status, details = [], body }: { message: string; status: number; details?: string[]; body?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.body = body;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function normalizeErrorPayload(payload: unknown, status: number): { message: string; details: string[] } {
  const messages = flattenMessages(payload);
  const fallback = STATUS_FALLBACKS[status] ?? STATUS_FALLBACKS[0];
  const [primary, ...rest] = messages.filter((msg) => typeof msg === "string" && msg.trim()).map((msg) => msg.trim());
  return { message: primary ?? fallback, details: rest };
}

export function getErrorMessages(error: unknown): string[] {
  if (isApiError(error)) {
    return [error.message, ...error.details].filter((msg) => msg && msg.trim());
  }
  if (error instanceof Error) {
    return [error.message].filter((msg) => msg && msg.trim());
  }
  if (typeof error === "string") {
    return [error].filter((msg) => msg && msg.trim());
  }
  return [];
}

export function getPrimaryErrorMessage(error: unknown, fallback = STATUS_FALLBACKS[0]): string {
  const [primary] = getErrorMessages(error);
  return primary ?? fallback;
}
