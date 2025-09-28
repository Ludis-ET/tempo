# Authentication Module

This module provides a modular authentication system for the dashboard using React, TailwindCSS, React Hook Form, Zod, and React Query.

## Endpoints Implemented
- POST /api/v1/auth/login/
- POST /api/v1/auth/register/
- GET/PUT/PATCH /api/v1/auth/profile/
- POST /api/v1/auth/change-password/
- GET /api/v1/auth/current/
- POST /api/v1/auth/logout/
- POST /api/v1/auth/refresh/
- GET /api/v1/auth/users/

A placeholder is included for password reset; wire it when the endpoint is available.

## Environment Variables
Set the API base URL in your Vite env file (.env, .env.local, etc):

VITE_API_BASE_URL="https://your-api.example.com"

All requests are made relative to this base URL.

## Tokens
If your API returns JWT tokens, they are stored in localStorage under:
- auth:accessToken
- auth:refreshToken

## Theme Toggling
The app includes a ThemeSwitcher in the header and smooth color transitions. Dark/light mode is persisted and can be toggled anywhere the ThemeSwitcher is used.

## File Structure (key files)
- src/lib/env.ts – environment parsing
- src/modules/auth/storage.ts – token storage helpers
- src/modules/auth/api/client.ts – fetch wrapper with auto-refresh
- src/modules/auth/api/endpoints.ts – endpoint functions
- src/modules/auth/types.ts – zod schemas and types
- src/modules/auth/hooks/useAuth.ts – React Query hooks
- src/modules/auth/components/* – small UI helpers (SubmitButton, ErrorText)
- src/pages/auth/* – login/register/forgot pages using the module

## Validation & States
- Forms use Zod + React Hook Form for client validation
- Loading and error states are shown on submit buttons and below forms

## Notes
- Only the provided endpoints are implemented. The password reset form is UI-only until the API is provided.
