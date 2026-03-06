## Packages
(none needed)

## Notes
- The application is entirely in Arabic, so the UI is heavily utilizing RTL (Right-to-Left) layout via `dir="rtl"` and logical Tailwind properties (e.g., `ms-`, `me-`, `ps-`, `pe-`).
- Evidences are uploaded as Base64 strings. The frontend handles the file reading and conversion before sending to the backend.
- The AI chat uses the `/api/ai/chat` endpoint and expects a simple `message` input and `reply` output.
- Authentication relies on the `/api/auth/me` endpoint to determine the user's role (admin, principal, teacher) and route them to the appropriate dashboard views.
