import { AxiosError } from 'axios'
import { HttpStatusCodes } from '../constants/http'

export type ErrorPersonalizado = {
  estado?: number
  mensaje: string
}

export const obtenerMensajeError = (error: unknown): ErrorPersonalizado => {
  if (!(error instanceof AxiosError)) {
    const mensaje =
      error instanceof Error
        ? error.message
        : 'Ocurrió un error. Consulte al administrador del sistema'
    return { estado: 0, mensaje }
  }

  const estado = error.response?.status ?? error.status ?? 0
  const data = error.response?.data as { message?: string; error?: string } | undefined
  const mensajeBackend = data?.message || data?.error

  if (!estado) {
    return { estado, mensaje: 'Falló la conexión con el servidor.' }
  }

  if (estado === HttpStatusCodes.BAD_REQUEST) {
    if (!mensajeBackend) return { estado, mensaje: 'Solicitud inválida' }
    return { estado, mensaje: mensajeBackend }
  }

  if (estado === HttpStatusCodes.CONFLICT) {
    return { estado, mensaje: mensajeBackend ?? 'No se pudo completar la operación.' }
  }

  if (estado === HttpStatusCodes.FORBIDDEN) {
    return { estado, mensaje: 'Tu cuenta no tiene permisos para realizar esta acción.' }
  }

  if (estado === HttpStatusCodes.UNAUTHORIZED) {
    return {
      estado,
      mensaje: mensajeBackend ?? 'Tu sesión expiró. Iniciá sesión nuevamente.',
    }
  }

  if (estado === HttpStatusCodes.NOT_FOUND) {
    return { estado, mensaje: mensajeBackend ?? 'El recurso solicitado no existe.' }
  }

  if (estado >= HttpStatusCodes.INTERNAL_SERVER_ERROR) {
    return {
      estado,
      mensaje:
        'Ocurrió un error al conectarse al backend. Intente nuevamente más tarde',
    }
  }

  return { estado, mensaje: mensajeBackend ?? 'Ocurrió un error inesperado.' }
}
