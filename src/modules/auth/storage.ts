const ACCESS_KEY = "auth:accessToken";
const REFRESH_KEY = "auth:refreshToken";

export type Tokens = { access?: string | null; refresh?: string | null };

export const tokenStorage = {
  get(): Tokens {
    return {
      access: localStorage.getItem(ACCESS_KEY),
      refresh: localStorage.getItem(REFRESH_KEY),
    };
  },
  set(tokens: Tokens) {
    if (typeof tokens.access !== "undefined") {
      if (tokens.access) localStorage.setItem(ACCESS_KEY, tokens.access);
      else localStorage.removeItem(ACCESS_KEY);
    }
    if (typeof tokens.refresh !== "undefined") {
      if (tokens.refresh) localStorage.setItem(REFRESH_KEY, tokens.refresh);
      else localStorage.removeItem(REFRESH_KEY);
    }
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
