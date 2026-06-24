import { Libro } from "../classes/Libro"
import type {
  CalificacionDTO,
  LibroDTO,
  LibroMasClickeadoResponse,
  LibroUsuarioItemDTO,
  PagedResponse,
  PrestamoDTO,
  TipoPrestamo,
} from "../models/libroModel"
import { apiClient } from "./apiClient"

export const libroService = {
  async obtenerTodosLosPrestamos(
    usuarioId: number,
    tipo: TipoPrestamo,
    page: number = 0,
    size: number = 10,
  ): Promise<PagedResponse<Libro>> {
    const tipoReserva = tipo === "prestados-a-mi" ? "HECHAS" : "RECIBIDAS"
    const res = await apiClient.get<PagedResponse<PrestamoDTO>>(`/reservas`, {
      params: { usuarioId, tipo: tipoReserva, page, size },
    })
    return {
      ...res.data,
      content: res.data.content.map(Libro.fromPrestamoJson),
    }
  },

  filtrarPrestamos(
    libros: Libro[],
    tipo: TipoPrestamo,
    usuarioId: number,
    searchQuery: string = "",
  ): Libro[] {
    const query = searchQuery.toLowerCase().trim()

    return libros.filter((libro) => {
      const esPrestamoRecibido = libro.alquiladoPorId === usuarioId

      const coincideTipo =
        tipo === "prestados-a-mi" ? esPrestamoRecibido : !esPrestamoRecibido
      const coincideBusqueda =
        !query ||
        libro.titulo.toLowerCase().includes(query) ||
        libro.autor.toLowerCase().includes(query)

      return coincideTipo && coincideBusqueda
    })
  },

  async obtenerLibrosDeUsuario(usuarioId: number): Promise<Libro[]> {
    const res = await apiClient.get<LibroDTO[]>(`/usuarios/${usuarioId}/libros`)
    return res.data.map(Libro.fromJson)
  },

  async obtenerLibrosUsuarioPerfil(
    usuarioId: number,
    page: number,
    size: number,
    filtro: string,
    ordenarPor: string,
    direccion: string,
  ): Promise<{ content: LibroUsuarioItemDTO[]; totalElements: number; totalPages: number }> {
    const res = await apiClient.get<{
      content: LibroUsuarioItemDTO[]
      totalElements: number
      totalPages: number
    }>(`/usuarios/${usuarioId}/libros`, {
      params: { page, size, filtro, ordenarPor, direccion },
    })
    return {
      content: res.data.content.map((libro) => ({
        ...libro,
        disponible:
          libro.disponible === true ||
          String(libro.disponible).toLowerCase() === "true",
      })),
      totalElements: res.data.totalElements,
      totalPages: res.data.totalPages,
    }
  },

  async getLibroById(id: number, usuarioId?: number): Promise<Libro> {
    const res = usuarioId
      ? await apiClient.get<LibroDTO>(`/libros/${id}`, { params: { usuarioId } })
      : await apiClient.get<LibroDTO>(`/libros/${id}`)
    return Libro.fromJson(res.data)
  },

  async getCalificaciones(libroId: number): Promise<CalificacionDTO[]> {
    const res = await apiClient.get<CalificacionDTO[]>(
      `/libros/${libroId}/calificaciones`,
    )
    return res.data
  },

  async crearLibro(dto: LibroDTO, usuarioId: number): Promise<Libro> {
    const res = await apiClient.post<LibroDTO>(`/libros/nuevo`, dto, {
      params: { usuarioId },
    })
    return Libro.fromJson(res.data)
  },

  async actualizarLibro(dto: LibroDTO, usuarioId: number): Promise<Libro> {
    const res = await apiClient.put<LibroDTO>(`/libros/${dto.id}`, dto, {
      params: { usuarioId },
    })
    return Libro.fromJson(res.data)
  },

  async eliminarLibro(libroId: number, usuarioId: number): Promise<void> {
    await apiClient.put(`/libros/${libroId}/baja`, null, {
      params: { usuarioId },
    })
  },

  async reactivarLibro(libroId: number, usuarioId: number): Promise<void> {
    await apiClient.put(`/libros/${libroId}/reactivar`, null, {
      params: { usuarioId },
    })
  },

  async obtenerPrestamosFiltrados(
    usuarioId: number,
    tipo: TipoPrestamo,
    query: string = "",
  ): Promise<Libro[]> {
    const respuestaPaginada = await this.obtenerTodosLosPrestamos(usuarioId, tipo)
    const todos = respuestaPaginada.content
    if (!query) return todos
    const q = query.toLowerCase()
    return todos.filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(q) ||
        libro.autor.toLowerCase().includes(q),
    )
  },

  async calificarLibro(
    libroId: number,
    usuarioId: number,
    valor: number,
    comentario: string,
  ) {
    return await apiClient.post(`/libros/${libroId}/calificar`, {
      usuarioId,
      valor,
      comentario,
    })
  },

  async getLibroMasClickeado(): Promise<
    LibroMasClickeadoResponse | { mensaje: string }
  > {
    const res = await apiClient.get<LibroMasClickeadoResponse | { mensaje: string }>(
      `/libros/mas-clickeado`,
    )
    return res.data
  },
}
