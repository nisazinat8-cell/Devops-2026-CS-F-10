// Base URL for API requests.
// In production (Render/Docker/Nginx), defaults to empty string so requests are relative (/api/...).
// Can be overridden via VITE_API_URL if frontend and backend are hosted on different domains.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
