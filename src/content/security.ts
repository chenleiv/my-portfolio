// Security measures per project, for the security() console command. Every
// item is stated in that project's README (insight-desk and signal-forge on
// GitHub). Keyed by the project's label in projectData.ts.
export const SECURITY_MEASURES: Readonly<Record<number, readonly string[]>> = {
  1: [
    "CSP with no inline scripts, and HSTS (helmet)",
    "HttpOnly, SameSite=Lax session cookie",
    "Uploads: size limits, and the first bytes must match the file type",
    "Each file parsed in a separate process with memory and time limits",
    "Logging out or changing the password ends existing sessions",
    "bcrypt passwords and rate-limited login",
    "CodeQL and a dependency audit in CI",
  ],
  2: [
    "Role-based access (admin, manager, analyst) enforced by the server",
    "JWT session in an HttpOnly cookie, revoked on the server at logout",
    "bcrypt passwords and rate-limited login",
    "Short-lived tickets for the live WebSocket stream",
    "A security regression test suite",
  ],
};
