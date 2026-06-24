import { describe, it, expect, vi, beforeEach } from "vitest"
vi.mock("../../services/apiClient", () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))
import { apiClient } from "../../services/apiClient"
const mockedApiClient = vi.mocked(apiClient, true)

// Importamos DESPUÉS del mock para que el módulo use la versión mockeada
import { libroService } from "../../services/libroService"
import { Libro } from "../../classes/Libro"
import type {
  LibroDTO,
  PrestamoDTO,
  LibroUsuarioItemDTO,
} from "../../models/libroModel"

const libroDTOMock: LibroDTO = {
  id: 1,
  titulo: "Clean Code",
  autor: "Robert C. Martin",
  tipo: "Comun",
  descripcion: "Buenas prácticas",
  genero: "DISENO",
  paginas: 464,
  isbn: "978-0132350884",
  idioma: "INGLES",
  editorial: "Prentice Hall",
  estado: "EXCELENTE",
  fechaPublicacion: "2008-08-01",
  propietarioId: 3,
  imagenUrl: "https://example.com/cover.jpg",
  alquiladoPorId: undefined,
  bibliokarma: undefined,
  estoyReservado: false,
  reservas: [],
  ultimasCalificaciones: [],
  fechaAgregado: "",
}

const prestamoDTOMock: PrestamoDTO = {
  id: 1,
  titulo: "1984",
  autor: "George Orwell",
  estado: "EXCELENTE",
  propietarioId: 3,
  propietarioNombre: "Ana",
  imagenUrl: "",
  alquiladoPorId: 1,
  alquiladoPorNombre: "Juan",
  fechaDesde: "2026-03-01",
  fechaHasta: "2026-03-20",
  rating: 0,
  bibliokarma: 1550,
  disponibilidad: "RESERVADO",
  disponible: false,
  libroActivo: true,
}

const prestamoDTOMock2: PrestamoDTO = {
  ...prestamoDTOMock,
  id: 2,
  titulo: "Dune",
  autor: "Frank Herbert",
  alquiladoPorId: 2,
  propietarioId: 1, // prestado por el usuario 1
}

const libroUsuarioItemMock: LibroUsuarioItemDTO = {
  id: 1,
  titulo: "Clean Code",
  autor: "Robert C. Martin",
  genero: "DISENO",
  disponible: true,
  fechaAgregado: "2026-01-15",
  imagenUrl: "https://example.com/cover.jpg",
}

describe("libroService - obtenerTodosLosPrestamos", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("llama al endpoint correcto con el usuarioId", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [], page: 0, totalPages: 0, totalElements: 0 },
    } as any)

    await libroService.obtenerTodosLosPrestamos(1, "prestados-a-mi")

    expect(mockedApiClient.get).toHaveBeenCalledWith(
      "/reservas",
      expect.objectContaining({
        params: expect.objectContaining({
          usuarioId: 1,
          tipo: "HECHAS",
        }),
      }),
    )
  })

  it("devuelve un array de instancias de Libro", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [prestamoDTOMock], page: 0, totalPages: 1, totalElements: 1 },
    } as any)

    const result = await libroService.obtenerTodosLosPrestamos(
      1,
      "prestados-a-mi",
    )

    expect(result.content).toHaveLength(1)
    expect(result.content[0]).toBeInstanceOf(Libro)
  })

  it("mapea el título del préstamo correctamente", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [prestamoDTOMock], page: 0, totalPages: 1, totalElements: 1 },
    } as any)

    const result = await libroService.obtenerTodosLosPrestamos(
      1,
      "prestados-a-mi",
    )

    expect(result.content[0].titulo).toBe("1984")
  })

  it("mapea fechaHasta del DTO a fechaDevolucion del Libro", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [prestamoDTOMock], page: 0, totalPages: 1, totalElements: 1 },
    } as any)

    const result = await libroService.obtenerTodosLosPrestamos(
      1,
      "prestados-a-mi",
    )

    expect(result.content[0].fechaHasta).toBe("2026-03-20")
  })

  it("mapea alquiladoPorId correctamente", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [prestamoDTOMock], page: 0, totalPages: 1, totalElements: 1 },
    } as any)

    const result = await libroService.obtenerTodosLosPrestamos(
      1,
      "prestados-a-mi",
    )

    expect(result.content[0].alquiladoPorId).toBe(1)
  })

  it("devuelve array vacío si el backend no devuelve préstamos", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [], page: 0, totalPages: 0, totalElements: 0 },
    } as any)

    const result = await libroService.obtenerTodosLosPrestamos(
      1,
      "prestados-a-mi",
    )

    expect(result.content).toHaveLength(0)
  })

  it("mapea múltiples préstamos correctamente", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [prestamoDTOMock, prestamoDTOMock2], page: 0, totalPages: 1, totalElements: 2 },
    } as any)

    const result = await libroService.obtenerTodosLosPrestamos(
      1,
      "prestados-a-mi",
    )

    expect(result.content).toHaveLength(2)
    expect(result.content[1].titulo).toBe("Dune")
  })

  it("propaga el error si axios falla", async () => {
    mockedApiClient.get.mockRejectedValueOnce(new Error("Network Error"))

    await expect(
      libroService.obtenerTodosLosPrestamos(1, "prestados-a-mi"),
    ).rejects.toThrow("Network Error")
  })
})

describe("libroService - filtrarPrestamos", () => {
  const usuarioId = 1

  // alquiladoPorId === usuarioId → prestado A mí
  const libroRecibido = Libro.fromPrestamoJson({
    ...prestamoDTOMock,
    id: 1,
    titulo: "1984",
    autor: "George Orwell",
    alquiladoPorId: usuarioId,
    propietarioId: 3,
  })

  // propietarioId === usuarioId, alquiladoPorId !== usuarioId → prestado POR mí
  const libroEmitido = Libro.fromPrestamoJson({
    ...prestamoDTOMock,
    id: 2,
    titulo: "Dune",
    autor: "Frank Herbert",
    propietarioId: usuarioId,
    alquiladoPorId: 99,
  })

  const libros = [libroRecibido, libroEmitido]

  it("filtra solo los libros prestados a mí", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      usuarioId,
    )
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe("1984")
  })

  it("filtra solo los libros prestados por mí", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-por-mi",
      usuarioId,
    )
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe("Dune")
  })

  it("devuelve lista vacía si no hay libros que coincidan con el tipo", () => {
    const result = libroService.filtrarPrestamos(
      [libroRecibido],
      "prestados-por-mi",
      usuarioId,
    )
    expect(result).toHaveLength(0)
  })

  it("filtra por búsqueda de título (case-insensitive)", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      usuarioId,
      "1984",
    )
    expect(result).toHaveLength(1)
    expect(result[0].titulo).toBe("1984")
  })

  it("filtra por búsqueda de autor (case-insensitive)", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      usuarioId,
      "orwell",
    )
    expect(result).toHaveLength(1)
    expect(result[0].autor).toBe("George Orwell")
  })

  it("búsqueda en mayúsculas encuentra resultados en minúsculas", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      usuarioId,
      "GEORGE",
    )
    expect(result).toHaveLength(1)
  })

  it("query que no coincide con nada devuelve lista vacía", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      usuarioId,
      "xyz123",
    )
    expect(result).toHaveLength(0)
  })

  it("query vacío no filtra por texto", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      usuarioId,
      "",
    )
    expect(result).toHaveLength(1)
  })

  it("sin query devuelve todos los del tipo correcto", () => {
    const result = libroService.filtrarPrestamos(
      libros,
      "prestados-a-mi",
      usuarioId,
    )
    expect(result).toHaveLength(1)
  })

  it("devuelve lista vacía si libros es vacío", () => {
    const result = libroService.filtrarPrestamos(
      [],
      "prestados-a-mi",
      usuarioId,
    )
    expect(result).toHaveLength(0)
  })
})

describe("libroService - getLibroById", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("llama al endpoint correcto con el libroId", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: libroDTOMock } as any)

    await libroService.getLibroById(1)

    expect(mockedApiClient.get).toHaveBeenCalledWith("/libros/1")
  })

  it("devuelve una instancia de Libro", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: libroDTOMock } as any)

    const result = await libroService.getLibroById(1)

    expect(result).toBeInstanceOf(Libro)
  })

  it("mapea el título correctamente", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: libroDTOMock } as any)

    const result = await libroService.getLibroById(1)

    expect(result.titulo).toBe("Clean Code")
  })

  it("mapea el autor correctamente", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: libroDTOMock } as any)

    const result = await libroService.getLibroById(1)

    expect(result.autor).toBe("Robert C. Martin")
  })

  it("mapea el propietarioId correctamente", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: libroDTOMock } as any)

    const result = await libroService.getLibroById(1)

    expect(result.propietarioId).toBe(3)
  })

  it("propaga el error si axios falla", async () => {
    mockedApiClient.get.mockRejectedValueOnce(new Error("Not Found"))

    await expect(libroService.getLibroById(999)).rejects.toThrow("Not Found")
  })
})

describe("libroService - crearLibro", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("llama al endpoint correcto", async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: libroDTOMock } as any)

    await libroService.crearLibro(libroDTOMock, 3)

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/libros/nuevo",
      libroDTOMock,
      expect.objectContaining({ params: { usuarioId: 3 } }),
    )
  })

  it("pasa el usuarioId como query param", async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: libroDTOMock } as any)

    await libroService.crearLibro(libroDTOMock, 7)

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/libros/nuevo",
      expect.anything(),
      { params: { usuarioId: 7 } },
    )
  })

  it("envía el DTO completo como body", async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: libroDTOMock } as any)

    await libroService.crearLibro(libroDTOMock, 3)

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/libros/nuevo",
      libroDTOMock,
      expect.anything(),
    )
  })

  it("devuelve una instancia de Libro", async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: libroDTOMock } as any)

    const result = await libroService.crearLibro(libroDTOMock, 3)

    expect(result).toBeInstanceOf(Libro)
  })

  it("el libro devuelto tiene el título del DTO", async () => {
    mockedApiClient.post.mockResolvedValueOnce({ data: libroDTOMock } as any)

    const result = await libroService.crearLibro(libroDTOMock, 3)

    expect(result.titulo).toBe("Clean Code")
  })

  it("propaga el error si axios falla", async () => {
    mockedApiClient.post.mockRejectedValueOnce(new Error("Server Error"))

    await expect(libroService.crearLibro(libroDTOMock, 3)).rejects.toThrow(
      "Server Error",
    )
  })
})

describe("libroService - actualizarLibro", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("llama al endpoint correcto con el id del libro", async () => {
    mockedApiClient.put.mockResolvedValueOnce({ data: libroDTOMock } as any)

    await libroService.actualizarLibro(libroDTOMock, 3)

    expect(mockedApiClient.put).toHaveBeenCalledWith(
      "/libros/1",
      libroDTOMock,
      { params: { usuarioId: 3 } },
    )
  })

  it("usa el id del DTO para construir la URL", async () => {
    const dtoConId5 = { ...libroDTOMock, id: 5 }
    mockedApiClient.put.mockResolvedValueOnce({ data: dtoConId5 } as any)

    await libroService.actualizarLibro(dtoConId5, 3)

    expect(mockedApiClient.put).toHaveBeenCalledWith(
      "/libros/5",
      expect.anything(),
      { params: { usuarioId: 3 } },
    )
  })

  it("envía el DTO completo como body", async () => {
    mockedApiClient.put.mockResolvedValueOnce({ data: libroDTOMock } as any)

    await libroService.actualizarLibro(libroDTOMock, 3)

    expect(mockedApiClient.put).toHaveBeenCalledWith(
      "/libros/1",
      libroDTOMock,
      { params: { usuarioId: 3 } },
    )
  })

  it("devuelve una instancia de Libro", async () => {
    mockedApiClient.put.mockResolvedValueOnce({ data: libroDTOMock } as any)

    const result = await libroService.actualizarLibro(libroDTOMock, 3)

    expect(result).toBeInstanceOf(Libro)
  })

  it("el libro devuelto refleja los datos actualizados", async () => {
    const dtoActualizado = { ...libroDTOMock, titulo: "Clean Code 2nd Ed" }
    mockedApiClient.put.mockResolvedValueOnce({ data: dtoActualizado } as any)

    const result = await libroService.actualizarLibro(dtoActualizado, 3)

    expect(result.titulo).toBe("Clean Code 2nd Ed")
  })

  it("propaga el error si axios falla", async () => {
    mockedApiClient.put.mockRejectedValueOnce(new Error("Not Found"))

    await expect(libroService.actualizarLibro(libroDTOMock, 3)).rejects.toThrow(
      "Not Found",
    )
  })
})

describe("libroService - eliminarLibro", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("llama al endpoint correcto con el libroId", async () => {
    mockedApiClient.delete.mockResolvedValueOnce({} as any)

    await libroService.eliminarLibro(1, 3)

    expect(mockedApiClient.put).toHaveBeenCalledWith(
      "/libros/1/baja",
      null,
      expect.objectContaining({ params: { usuarioId: 3 } }),
    )
  })

  it("pasa el usuarioId como query param", async () => {
    mockedApiClient.put.mockResolvedValueOnce({} as any)

    await libroService.eliminarLibro(1, 42)

    expect(mockedApiClient.put).toHaveBeenCalledWith(
      "/libros/1/baja",
      null,
      {
        params: { usuarioId: 42 },
      },
    )
  })

  it("no devuelve nada (void) cuando tiene éxito", async () => {
    mockedApiClient.delete.mockResolvedValueOnce({} as any)

    const result = await libroService.eliminarLibro(1, 3)

    expect(result).toBeUndefined()
  })

  it("llama a delete exactamente una vez", async () => {
    mockedApiClient.delete.mockResolvedValueOnce({} as any)

    await libroService.eliminarLibro(1, 3)

    expect(mockedApiClient.put).toHaveBeenCalledTimes(1)
  })

  it("propaga el error si axios falla", async () => {
    mockedApiClient.put.mockRejectedValueOnce(new Error("Forbidden"))

    await expect(libroService.eliminarLibro(1, 3)).rejects.toThrow("Forbidden")
  })
})

describe("libroService - obtenerLibrosUsuarioPerfil", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("llama al endpoint correcto con el usuarioId y params de paginación", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [libroUsuarioItemMock], totalElements: 1, totalPages: 1 },
    } as any)

    await libroService.obtenerLibrosUsuarioPerfil(1, 0, 3, "todos", "titulo", "ascendente")

    expect(mockedApiClient.get).toHaveBeenCalledWith(
      "/usuarios/1/libros",
      expect.objectContaining({
        params: expect.objectContaining({
          page: 0,
          size: 3,
          filtro: "todos",
          ordenarPor: "titulo",
          direccion: "ascendente",
        }),
      }),
    )
  })

  it("devuelve los LibroUsuarioItemDTO transformados y la info de paginación", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [libroUsuarioItemMock], totalElements: 1, totalPages: 1 },
    } as any)

    const result = await libroService.obtenerLibrosUsuarioPerfil(1, 0, 3, "todos", "titulo", "ascendente")

    expect(result.content).toHaveLength(1)
    expect(result.content[0].titulo).toBe("Clean Code")
    expect(result.content[0].disponible).toBe(true)
    expect(result.totalElements).toBe(1)
    expect(result.totalPages).toBe(1)
  })

  it("devuelve content vacío si el usuario no tiene libros", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [], totalElements: 0, totalPages: 0 },
    } as any)

    const result = await libroService.obtenerLibrosUsuarioPerfil(1, 0, 3, "todos", "titulo", "ascendente")

    expect(result.content).toHaveLength(0)
    expect(result.totalElements).toBe(0)
  })

  it("preserva el campo disponible: false", async () => {
    const noDisponible = { ...libroUsuarioItemMock, disponible: false }
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [noDisponible], totalElements: 1, totalPages: 1 },
    } as any)

    const result = await libroService.obtenerLibrosUsuarioPerfil(1, 0, 3, "todos", "titulo", "ascendente")

    expect(result.content[0].disponible).toBe(false)
  })

  it("preserva fechaAgregado nulo", async () => {
    const sinFecha = { ...libroUsuarioItemMock, fechaAgregado: null }
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [sinFecha], totalElements: 1, totalPages: 1 },
    } as any)

    const result = await libroService.obtenerLibrosUsuarioPerfil(1, 0, 3, "todos", "titulo", "ascendente")

    expect(result.content[0].fechaAgregado).toBeNull()
  })

  it("propaga el error si axios falla", async () => {
    mockedApiClient.get.mockRejectedValueOnce(new Error("Unauthorized"))

    await expect(
      libroService.obtenerLibrosUsuarioPerfil(1, 0, 3, "todos", "titulo", "ascendente"),
    ).rejects.toThrow("Unauthorized")
  })
})

describe("libroService - obtenerPrestamosFiltrados", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("devuelve todos los libros si no hay query", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { content: [prestamoDTOMock, prestamoDTOMock2], page: 0, totalPages: 1, totalElements: 2 },
    } as any)

    const result = await libroService.obtenerPrestamosFiltrados(1, "prestados-a-mi")

    expect(result).toHaveLength(2)
  })

  describe("libroService - obtenerPrestamosFiltrados", () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it("devuelve todos los libros sin query", async () => {
      mockedApiClient.get.mockResolvedValueOnce({
        data: { content: [prestamoDTOMock, prestamoDTOMock2], page: 0, totalPages: 1, totalElements: 2 },
      } as any)

      const result = await libroService.obtenerPrestamosFiltrados(
        1,
        "prestados-a-mi",
      )

      expect(result).toHaveLength(2)
    })

    it("filtra por título con query", async () => {
      mockedApiClient.get.mockResolvedValueOnce({
        data: { content: [prestamoDTOMock, prestamoDTOMock2], page: 0, totalPages: 1, totalElements: 2 },
      } as any)

      const result = await libroService.obtenerPrestamosFiltrados(
        1,
        "prestados-a-mi",
        "dune",
      )

      expect(result).toHaveLength(1)
      expect(result[0].titulo).toBe("Dune")
    })

    it("filtra por autor con query", async () => {
      mockedApiClient.get.mockResolvedValueOnce({
        data: { content: [prestamoDTOMock, prestamoDTOMock2], page: 0, totalPages: 1, totalElements: 2 },
      } as any)

      const result = await libroService.obtenerPrestamosFiltrados(
        1,
        "prestados-a-mi",
        "orwell",
      )

      expect(result).toHaveLength(1)
      expect(result[0].autor).toBe("George Orwell")
    })

    it("la búsqueda es case-insensitive", async () => {
      mockedApiClient.get.mockResolvedValueOnce({
        data: { content: [prestamoDTOMock, prestamoDTOMock2], page: 0, totalPages: 1, totalElements: 2 },
      } as any)

      const result = await libroService.obtenerPrestamosFiltrados(
        1,
        "prestados-a-mi",
        "GEORGE",
      )

      expect(result).toHaveLength(1)
    })

    it("devuelve lista vacía si la query no coincide con nada", async () => {
      mockedApiClient.get.mockResolvedValueOnce({
        data: { content: [prestamoDTOMock, prestamoDTOMock2], page: 0, totalPages: 1, totalElements: 2 },
      } as any)

      const result = await libroService.obtenerPrestamosFiltrados(
        1,
        "prestados-a-mi",
        "zzznomatch",
      )

      expect(result).toHaveLength(0)
    })
  })

  it("propaga el error si axios falla", async () => {
    mockedApiClient.get.mockRejectedValueOnce(new Error("Network Error"))

    await expect(libroService.obtenerPrestamosFiltrados(1, "prestados-a-mi")).rejects.toThrow(
      "Network Error",
    )
  })
})

describe("libroService - calificarLibro", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("llama al endpoint correcto con el libroId", async () => {
    mockedApiClient.post.mockResolvedValueOnce({} as any)

    await libroService.calificarLibro(1, 2, 5, "Excelente libro")

    expect(mockedApiClient.post).toHaveBeenCalledWith("/libros/1/calificar", expect.anything())
  })

  it("envía usuarioId, valor y comentario en el body", async () => {
    mockedApiClient.post.mockResolvedValueOnce({} as any)

    await libroService.calificarLibro(1, 2, 5, "Excelente libro")

    expect(mockedApiClient.post).toHaveBeenCalledWith("/libros/1/calificar", {
      usuarioId: 2,
      valor: 5,
      comentario: "Excelente libro",
    })
  })

  it("funciona con comentario vacío", async () => {
    mockedApiClient.post.mockResolvedValueOnce({} as any)

    await libroService.calificarLibro(1, 2, 3, "")

    expect(mockedApiClient.post).toHaveBeenCalledWith("/libros/1/calificar", {
      usuarioId: 2,
      valor: 3,
      comentario: "",
    })
  })

  it("llama a post exactamente una vez", async () => {
    mockedApiClient.post.mockResolvedValueOnce({} as any)

    await libroService.calificarLibro(1, 2, 4, "Bueno")

    expect(mockedApiClient.post).toHaveBeenCalledTimes(1)
  })

  it("propaga el error si axios falla", async () => {
    mockedApiClient.post.mockRejectedValueOnce(new Error("Bad Request"))

    await expect(libroService.calificarLibro(1, 2, 5, "ok")).rejects.toThrow(
      "Bad Request",
    )
  })
})
