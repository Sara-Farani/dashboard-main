// ------------------------------------------------------------------
// Generic API contract types — usable everywhere services swap to
// a real HTTP client (axios / fetch wrapper) later.
// ------------------------------------------------------------------

/** Standard envelope returned by REST endpoints. */
export interface ApiResponse<TData = unknown> {
  data: TData
  message?: string
}

/** Error shape thrown/rejected by mock services and future HTTP wrappers. */
export interface ApiError {
  message: string
}
