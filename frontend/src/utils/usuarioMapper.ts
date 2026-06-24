import type { UsuarioData } from "../classes/usuario"
import type { TipoUsuario, UsuarioResponse } from "../models/usuarioModel"

export function mapTipoUsuario(tipoUsuario: string): TipoUsuario {
  switch (tipoUsuario) {
    case "Lector":
    case "Publicador":
    case "LectorPublicador":
    case "ADMIN":
    case "Admin":
      return tipoUsuario as TipoUsuario
    default:
      if (tipoUsuario && tipoUsuario.toUpperCase() === "ADMIN") return "ADMIN"
      return "Lector"
  }
}

export function mapUsuarioResponse(usuario: UsuarioResponse): UsuarioData {
  return {
    ...usuario,
    tipoUsuario: mapTipoUsuario(usuario.tipoUsuario),
  }
}
