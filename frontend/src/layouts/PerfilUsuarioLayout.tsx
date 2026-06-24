import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Spinner, ErrorCard, type ErrorPersonalizado } from "../components/ui"
import { Usuario } from "../classes/usuario"
import { useAlIniciar } from "../utils/hooks"
import { obtenerMensajeError } from "../utils/errorHandler"
import { usuarioService } from "../services/usuarioService"
import { authService } from "../services/AuthService"

export type ContextoPerfilUsuario = {
  usuario: Usuario
  setUsuario: (usuario: Usuario) => void
}

export const PerfilUsuarioLayout = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<ErrorPersonalizado | null>(null)
  const navigate = useNavigate()

  const cargarUsuario = async () => {
    const id = authService.obtenerIdUsuarioActual()
    if (id == null) {
      setError({ mensaje: "Debés iniciar sesión para ver tu perfil." })
      setCargando(false)
      return
    }

    try {
      const data = await usuarioService.obtenerUsuario(id)
      setUsuario(new Usuario(data))
    } catch (e: unknown) {
      setError(obtenerMensajeError(e))
    } finally {
      setCargando(false)
    }
  }

  useAlIniciar(cargarUsuario) //Custom hook que hace el efecto únicamente al montar el componente

  if (cargando) return <Spinner />
  if (error) {
    const noAutenticado =
      error.estado === 401 || authService.obtenerIdUsuarioActual() == null
    return (
      <ErrorCard
        error={error}
        alReintentar={noAutenticado ? () => navigate("/login") : cargarUsuario}
      />
    )
  }
  if (usuario == null) return null

  const setUsuarioActualizado = (u: Usuario) => setUsuario(u)

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] px-6 md:px-10 py-6 pt-20">
      <Outlet
        context={
          {
            usuario,
            setUsuario: setUsuarioActualizado,
          } satisfies ContextoPerfilUsuario
        }
      />
    </div>
  )
}
