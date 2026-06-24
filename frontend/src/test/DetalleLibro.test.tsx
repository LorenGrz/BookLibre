import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { DetalleLibro } from "../pages/DetalleLibro"
import { libroService } from "../services/libroService"
import { Libro } from "../classes/Libro"
import { AuthContext } from "../context/AuthContext"
import type { UsuarioData } from "../classes/usuario"

vi.mock("../services/libroService", () => ({
  libroService: {
    getLibroById: vi.fn(),
    getCalificaciones: vi.fn(),
  },
}))

describe("DetalleLibro", () => {
  const mockUsuario: UsuarioData = {
    id: 1,
    nombre: "Lector Test",
    desc: "Lector de pruebas",
    email: "test@mail.com",
    celular: "1122334455",
    ciudad: "San Martin",
    tipoUsuario: "Lector",
    bibliokarmas: 500,
    reservados: 0,
    leidos: 0,
    esAdmin: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderConContexto = (ruta: string) => {
    return render(
      <AuthContext.Provider
        value={{
          usuario: mockUsuario,
          cargandoUsuario: false,
          actualizarUsuario: vi.fn(),
          setUsuarioContext: vi.fn(),
        }}
      >
        <MemoryRouter initialEntries={[ruta]}>
          <Routes>
            <Route path="/libros/:id" element={<DetalleLibro />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    )
  }

  it("muestra spinner al cargar y luego renderiza el libro", async () => {
    vi.mocked(libroService.getLibroById).mockResolvedValueOnce(
      new Libro({
        id: 1,
        titulo: "El Aleph",
        autor: "Borges",
        descripcion: "Cuentos",
        reservas: [],
        ultimasCalificaciones: [],
      }),
    )

    renderConContexto("/libros/1")
    expect(screen.getByText("Cargando...")).toBeInTheDocument()

    expect(
      await screen.findByRole("heading", { name: "El Aleph" }),
    ).toBeInTheDocument()
    expect(await screen.findByText("Borges")).toBeInTheDocument()
  })

  it("muestra mensaje de error si el libro no existe en la base de datos", async () => {
    vi.mocked(libroService.getLibroById).mockRejectedValueOnce(
      new Error("Not found"),
    )

    renderConContexto("/libros/999")

    await waitFor(() => {
      expect(screen.getByText("Not found")).toBeInTheDocument()
    })
  })
})
