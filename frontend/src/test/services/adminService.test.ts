import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../../services/apiClient", () => ({
  apiClient: { get: vi.fn(), post: vi.fn() },
}))

import { apiClient } from "../../services/apiClient"

const mockedApiClient = vi.mocked(apiClient, true)

import { adminService } from "../../services/adminService"

describe("adminService - obtenerAnalisisCalificaciones", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("envia la consulta GraphQL correcta y devuelve el analisis de calificaciones", async () => {
    const analisisCalificaciones = [
      { tipoLibro: "Comun", promedioCalificacion: 4.25 },
      { tipoLibro: "Coleccionable", promedioCalificacion: 3.8 },
    ]

    mockedApiClient.post.mockResolvedValueOnce({
      data: { data: { analisisCalificaciones } },
    } as any)

    const result = await adminService.obtenerAnalisisCalificaciones()

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/graphql",
      expect.objectContaining({
        query: expect.stringContaining("analisisCalificaciones"),
      }),
    )
    const body = mockedApiClient.post.mock.calls[0][1] as { query: string }
    expect(body.query).toContain("tipoLibro")
    expect(body.query).toContain(
      "promedioCalificacion",
    )
    expect(result).toEqual(analisisCalificaciones)
  })
})

describe("adminService - obtenerSaludCatalogo", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("envia la consulta GraphQL correcta y devuelve la salud del catalogo", async () => {
    const saludCatalogo = {
      total: 100,
      prestados: 12,
      disponiblesNuncaReservados: 60,
      disponiblesReservadosAFuturo: 8,
      disponiblesDevueltos: 20,
    }

    mockedApiClient.post.mockResolvedValueOnce({
      data: { data: { saludCatalogo } },
    } as any)

    const result = await adminService.obtenerSaludCatalogo()

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/graphql",
      expect.objectContaining({
        query: expect.stringContaining("saludCatalogo"),
      }),
    )
    const body = mockedApiClient.post.mock.calls[0][1] as { query: string }
    expect(body.query).toContain("total")
    expect(body.query).toContain("prestados")
    expect(body.query).toContain("disponiblesNuncaReservados")
    expect(body.query).toContain("disponiblesReservadosAFuturo")
    expect(body.query).toContain("disponiblesDevueltos")
    expect(result).toEqual(saludCatalogo)
  })
})

describe("adminService - obtenerResumenKpisHome", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("envia una consulta GraphQL combinada y resume las metricas del home admin", async () => {
    const tasaConversion = [
      {
        libroId: 1,
        titulo: "Rayuela",
        clicks: 20,
        reservas: 5,
        tasaConversion: 0.25,
      },
      {
        libroId: 2,
        titulo: "Ficciones",
        clicks: 10,
        reservas: 5,
        tasaConversion: 0.5,
      },
    ]
    const analisisCalificaciones = [
      { tipoLibro: "Comun", promedioCalificacion: 4.2 },
      { tipoLibro: "Coleccionable", promedioCalificacion: 4.8 },
    ]

    mockedApiClient.post.mockResolvedValueOnce({
      data: { data: { tasaConversion, analisisCalificaciones } },
    } as any)

    const result = await adminService.obtenerResumenKpisHome()

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/graphql",
      expect.objectContaining({
        query: expect.stringContaining("tasaConversion"),
      }),
    )
    const body = mockedApiClient.post.mock.calls[0][1] as { query: string }
    expect(body.query).toContain("libroId")
    expect(body.query).toContain("titulo")
    expect(body.query).toContain("clicks")
    expect(body.query).toContain("reservas")
    expect(body.query).toContain("tasaConversion")
    expect(body.query).toContain("analisisCalificaciones")
    expect(body.query).toContain("tipoLibro")
    expect(body.query).toContain("promedioCalificacion")
    expect(result).toEqual({
      conversionPromedio: 0.375,
      libroMasClickeado: { titulo: "Rayuela", clicks: 20 },
      mejorTipoCalificado: {
        tipoLibro: "Coleccionable",
        promedioCalificacion: 4.8,
      },
      tiposEvaluados: 2,
    })
  })

  it("devuelve un resumen vacio cuando no hay datos de conversion ni calificaciones", async () => {
    mockedApiClient.post.mockResolvedValueOnce({
      data: {
        data: {
          tasaConversion: [],
          analisisCalificaciones: [],
        },
      },
    } as any)

    const result = await adminService.obtenerResumenKpisHome()

    expect(result).toEqual({
      conversionPromedio: 0,
      libroMasClickeado: null,
      mejorTipoCalificado: null,
      tiposEvaluados: 0,
    })
  })
})

describe("adminService - obtenerFeedActividad", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("envia la consulta GraphQL correcta y devuelve el feed de actividad", async () => {
    const feedActividad = [
      {
        __typename: "LibroAgregado",
        tipoEvento: "LIBRO_AGREGADO",
        fecha: "2026-06-15T10:30:00",
        libroId: 1,
        titulo: "El Aleph",
        autor: "Jorge Luis Borges",
        duenioNombre: "Juan",
      },
      {
        __typename: "ReservaConfirmada",
        tipoEvento: "RESERVA_CONFIRMADA",
        fecha: "2026-06-14T09:15:00",
        reservaId: 10,
        libroId: 2,
        libroTitulo: "Ficciones",
        usuarioId: 3,
        usuarioNombre: "Maria",
      },
    ]

    mockedApiClient.post.mockResolvedValueOnce({
      data: { data: { feedActividad } },
    } as any)

    const result = await adminService.obtenerFeedActividad()

    expect(mockedApiClient.post).toHaveBeenCalledWith(
      "/graphql",
      expect.objectContaining({
        query: expect.stringContaining("feedActividad"),
      }),
    )
    const body = mockedApiClient.post.mock.calls[0][1] as { query: string }
    
    // Verificamos que se pidan los campos polimórficos correctos
    expect(body.query).toContain("... on LibroAgregado")
    expect(body.query).toContain("... on ReservaConfirmada")
    expect(body.query).toContain("__typename")
    expect(body.query).toContain("fecha")
    expect(body.query).toContain("tipoEvento")
    expect(body.query).toContain("duenioNombre")
    expect(body.query).toContain("usuarioNombre")
    
    expect(result).toEqual(feedActividad)
  })
})
