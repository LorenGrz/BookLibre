import { apiClient } from "./apiClient"

export interface CrearReservaDTO {
  libroId: number
  usuarioId: number
  fechaDesde: string
  fechaHasta: string
}

const toIsoDatetime = (value: string): string =>
  value.includes("T") ? (value.length === 16 ? value + ":00" : value) : value + "T00:00:00"

export const reservaService = {
  async crearReserva(dto: CrearReservaDTO) {
    const res = await apiClient.post(`/reservas/crear`, {
      ...dto,
      fechaDesde: toIsoDatetime(dto.fechaDesde),
      fechaHasta: toIsoDatetime(dto.fechaHasta),
    })
    return res.data
  },
}
