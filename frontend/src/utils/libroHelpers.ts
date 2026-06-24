import { Libro } from "../classes/Libro"

export const calcularElegibilidad = (
  usuarioId: number,
  tipoUsuario?: string,
  propietarioId?: number
): boolean => {
  return !!usuarioId && tipoUsuario !== "Publicador" && propietarioId !== usuarioId
}

export const calcularPuedeReservar = (
  esElegible: boolean,
  estoyReservado?: boolean
): boolean => {
  return esElegible && !estoyReservado
}

export const calcularKarmaReserva = (
  libro: Libro | undefined,
  fechaDesde: string,
  fechaHasta: string,
  bibliokarmasUsuario: number
): number => {
  if (!libro) return 0
  const karmaEstimado = libro.bibliokarma ?? 0
  if (fechaDesde && fechaHasta && fechaHasta >= fechaDesde) {
    return libro.calcularBibliokarma(fechaDesde, fechaHasta, bibliokarmasUsuario)
  }
  return karmaEstimado
}
