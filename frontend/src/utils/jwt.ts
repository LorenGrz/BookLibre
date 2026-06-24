export function obtenerRolesDesdeToken(token: string): string[] {
  try {
    const payload = token.split(".")[1]
    const decoded = JSON.parse(atob(payload))

    return decoded.roles || []
  } catch {
    return []
  }
}