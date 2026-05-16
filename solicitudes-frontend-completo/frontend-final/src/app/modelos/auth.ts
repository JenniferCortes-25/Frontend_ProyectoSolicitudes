// Espejo de: record LoginRequest(String username, String password)
export interface LoginRequest {
  username: string;
  password: string;
}

// Espejo de: record TokenResponse(String token, String type, Instant expireAt, Collection<String> roles)
export interface TokenResponse {
  token: string;
  type: string;
  expireAt: string;   // Instant llega como cadena ISO-8601
  roles: string[];
}