import type { UsuarioResponse } from "../models/usuarioModel"

export type RegisterData = {
    nombre: string,
    email: string,
    password: string
}

export type LoginData = {
    email: string,
    password: string
}

export type AuthResponseUsuario = {
    success: boolean,
    message: string,
    usuario: UsuarioResponse
}