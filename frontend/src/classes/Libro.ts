import type {
  LibroDTO,
  TipoLibro,
  EstadoLibro,
  Genero,
  Idioma,
  PrestamoDTO,
  RangoReservaDTO,
  CalificacionDTO,
} from "../models/libroModel"
import { calcularDiferenciaDias } from "../utils/dateHandlerReserva"
import { parseISO, startOfDay } from "date-fns"

export class Libro {
  id: number
  prestamoId?: number
  titulo: string
  autor: string
  estado: EstadoLibro
  propietarioId: number
  propietarioNombre?: string
  imagenUrl: string
  alquiladoPorId?: number
  alquiladoPorNombre?: string
  bibliokarma?: number
  rating: number
  estoyReservado: boolean
  fechaDesde?: string
  fechaHasta?: string
  tipo?: TipoLibro
  descripcion?: string
  genero?: Genero
  paginas?: number
  isbn?: string
  idioma?: Idioma
  editorial?: string
  fechaPublicacion?: string
  cantidadReservas?: number
  cantidadCalificaciones?: number
  reservas: RangoReservaDTO[]
  ultimasCalificaciones: CalificacionDTO[]
  disponibilidad?: "DISPONIBLE" | "RESERVADO"
  disponible?: boolean
  libroActivo?: boolean
  yaCalificadoPorUsuario?: boolean
  miReservaFechaHasta?: string

  constructor(data: Partial<Libro>) {
    Object.assign(this, data)
    this.id = data.id || 0
    this.titulo = data.titulo || ""
    this.autor = data.autor || ""
    this.estado = data.estado || ("EXCELENTE" as EstadoLibro)
    this.propietarioId = data.propietarioId || 0
    this.imagenUrl = data.imagenUrl || ""
    this.rating = data.rating || 0
    this.estoyReservado = data.estoyReservado ?? false
    this.reservas = data.reservas ?? []
    this.ultimasCalificaciones = data.ultimasCalificaciones ?? []
    this.disponibilidad = data.disponibilidad ?? (data.estoyReservado ? "RESERVADO" : "DISPONIBLE")
  }

  static fromJson(json: LibroDTO): Libro {
    return new Libro({
      ...json,
    })
  }

  static fromPrestamoJson(json: PrestamoDTO): Libro {
    return new Libro({
      id: json.id,
      titulo: json.titulo,
      autor: json.autor,
      estado: json.estado,
      propietarioId: json.propietarioId,
      propietarioNombre: json.propietarioNombre ?? undefined,
      imagenUrl: json.imagenUrl,
      alquiladoPorId: json.alquiladoPorId ?? undefined,
      alquiladoPorNombre: json.alquiladoPorNombre ?? undefined,
      fechaDesde: json.fechaDesde ?? undefined,
      fechaHasta: json.fechaHasta ?? undefined,
      rating: json.rating,
      bibliokarma: json.bibliokarma ?? undefined,
      reservas: [],
      disponibilidad: json.disponibilidad ?? "DISPONIBLE",
      disponible: json.disponible ?? false,
      libroActivo: json.libroActivo,
      yaCalificadoPorUsuario: json.yaCalificadoPorUsuario ?? false,
    })
  }

  private obtenerFechaInicioDia(fecha?: string): Date | null {
    if (!fecha) return null
    return startOfDay(parseISO(fecha))
  }

  estaReservadoFuturo(): boolean {
    if (!this.fechaDesde) return false
    return startOfDay(parseISO(this.fechaDesde)) > startOfDay(new Date())
  }

  estaDevuelto(): boolean {
    const fechaFin = this.obtenerFechaInicioDia(this.fechaHasta)
    if (!fechaFin) return false
    return fechaFin <= startOfDay(new Date())
  }

  estoyDisponible(): boolean {
    return !this.fechaHasta || this.estaDevuelto()
  }

  estaProximoAVencer(): boolean {
    if (!this.fechaHasta || this.estaDevuelto()) return false
    const ahora = startOfDay(new Date())
    const fechaFin = this.obtenerFechaInicioDia(this.fechaHasta)
    if (!fechaFin) return false
    const diffMs = fechaFin.getTime() - ahora.getTime()
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    return diffDias >= 1 && diffDias <= 3
  }

  estaCalificado(): boolean {
    return this.yaCalificadoPorUsuario === true
  }

  calcularBibliokarma(
    fechaDesde: string,
    fechaHasta: string,
    bibliokarmasUsuario: number,
  ): number {
    if (!fechaDesde || !fechaHasta) return 0
    const diasReserva = calcularDiferenciaDias(fechaDesde, fechaHasta)
    if (diasReserva <= 0) return 0
    const base = 5 * diasReserva
    const plus = this.calcularPlusBibliokarma(bibliokarmasUsuario)
    return base + plus
  }

  private calcularPlusBibliokarma(bibliokarmasUsuario: number): number {
    const paginas = this.paginas ?? 0
    const reservas = this.cantidadReservas ?? 0

    const estrategias: Record<NonNullable<TipoLibro>, () => number> = {
      Comun: () => paginas * (bibliokarmasUsuario < 1000 ? 5 : 2),
      ConDedicatoria: () => 200 + 10 * reservas,
      Coleccionable: () => Math.ceil(bibliokarmasUsuario / 5) + paginas,
    }

    return this.tipo ? (estrategias[this.tipo]?.() ?? 0) : 0
  }
}
