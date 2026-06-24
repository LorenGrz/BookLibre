import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ModalEditarPerfil } from "../../components/perfil/ModalEditarPerfil"
import { Usuario } from "../../classes/usuario"
import { toast } from "react-toastify"

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock("../../utils/errorHandler", () => ({
  obtenerMensajeError: vi.fn(() => ({ estado: 500, mensaje: "Error" })),
}))

import { obtenerMensajeError } from "../../utils/errorHandler"

const usuarioBase = new Usuario({
  id: 1,
  nombre: "Juan",
  desc: "desc",
  email: "juan@mail.com",
  celular: "1234567890",
  ciudad: "Rosario",
  tipoUsuario: "Lector",
  bibliokarmas: 10,
  imagenUrl: null,
})

describe("ModalEditarPerfil", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:mock"),
      revokeObjectURL: vi.fn(),
    })
  })

  it("muestra error en email cuando backend devuelve 409 por email duplicado", async () => {
    vi.mocked(obtenerMensajeError).mockReturnValueOnce({
      estado: 409,
      mensaje: "El email ya existe",
    })
    const onGuardar = vi.fn().mockRejectedValueOnce(new Error("Conflict"))
    render(
      <ModalEditarPerfil
        onClose={vi.fn()}
        usuario={usuarioBase}
        onGuardar={onGuardar}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }))

    await waitFor(() => {
      expect(screen.getByText("El email ya existe")).toBeInTheDocument()
    })
  })

  it("muestra error en celular cuando backend devuelve 409 por celular duplicado", async () => {
    vi.mocked(obtenerMensajeError).mockReturnValueOnce({
      estado: 409,
      mensaje: "El celular ya existe",
    })
    const onGuardar = vi.fn().mockRejectedValueOnce(new Error("Conflict"))
    render(
      <ModalEditarPerfil
        onClose={vi.fn()}
        usuario={usuarioBase}
        onGuardar={onGuardar}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /guardar cambios/i }))

    await waitFor(() => {
      expect(screen.getByText("El celular ya existe")).toBeInTheDocument()
    })
  })

  it("muestra toast si el archivo no es imagen", async () => {
    const onGuardar = vi.fn().mockResolvedValue(undefined)
    render(
      <ModalEditarPerfil
        onClose={vi.fn()}
        usuario={usuarioBase}
        onGuardar={onGuardar}
      />,
    )
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    const archivoTexto = new File(["hola"], "archivo.txt", {
      type: "text/plain",
    })

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [archivoTexto] } })
    }

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Elegí un archivo de imagen.")
    })
    expect(onGuardar).not.toHaveBeenCalled()
  })

  it("muestra toast si la imagen supera el tamaño máximo", async () => {
    const user = userEvent.setup()
    const onGuardar = vi.fn().mockResolvedValue(undefined)
    render(
      <ModalEditarPerfil
        onClose={vi.fn()}
        usuario={usuarioBase}
        onGuardar={onGuardar}
      />,
    )
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    const archivoGrande = new File([new Uint8Array(800_001)], "foto.png", {
      type: "image/png",
    })

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [archivoGrande] } })
    }
    await user.click(screen.getByRole("button", { name: /guardar cambios/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "La imagen es demasiado grande (máx. ~800 KB).",
      )
    })
    expect(onGuardar).not.toHaveBeenCalled()
  })
})
