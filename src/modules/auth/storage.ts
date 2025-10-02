const ACCESS_KEY = "auth:accessToken";
const REFRESH_KEY = "auth:refreshToken";

export type Tokens = { access?: string | null; refresh?: string | null };

export const tokenStorage = {
  get(): Tokens {
    if (typeof window === "undefined") {
      return { access: null, refresh: null };
    }
    return {
      access: window.localStorage.getItem(ACCESS_KEY),
      refresh: window.localStorage.getItem(REFRESH_KEY),
    };
  },
  set(tokens: Tokens) {
    if (typeof window === "undefined") return;
    if (typeof tokens.access !== "undefined") {
      if (tokens.access) window.localStorage.setItem(ACCESS_KEY, tokens.access);
      else window.localStorage.removeItem(ACCESS_KEY);
    }
    if (typeof tokens.refresh !== "undefined") {
      if (tokens.refresh) window.localStorage.setItem(REFRESH_KEY, tokens.refresh);
      else window.localStorage.removeItem(REFRESH_KEY);
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};
