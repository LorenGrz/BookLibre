import { createContext, useState, type ReactNode } from "react"
import { authService } from "../services/AuthService"
import { usuarioService } from "../services/usuarioService"
import type { UsuarioData } from "../classes/usuario"
import { useOnInit } from "../utils/hooks"

export type AuthContextType = {
  usuario: UsuarioData | null
  cargandoUsuario: boolean
  actualizarUsuario: () => Promise<void>
  setUsuarioContext: (usuario: UsuarioData) => void
}
const defaultAuthContext: AuthContextType = {
  usuario: null,
  cargandoUsuario: true,
  actualizarUsuario: async () => {}, // Función vacía
  setUsuarioContext: () => {},       // Función vacía
}
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioData | null>(null)
  const [cargandoUsuario, setCargandoUsuario] = useState(true)

  const actualizarUsuario = async () => {
    setCargandoUsuario(true)
    const id = authService.obtenerIdUsuarioActual()
    if (id) {
      try {
        const data = await usuarioService.obtenerUsuario(id)
        setUsuario(data)
      } catch (error) {
        console.error("Error obteniendo el usuario en el contexto", error)
        setUsuario(null)
      }
    } else {
      setUsuario(null)
    }
    setCargandoUsuario(false)
  }

  const setUsuarioContext = (nuevoUsuario: UsuarioData) => {
    setUsuario(nuevoUsuario)
  }

  useOnInit(() => {
    actualizarUsuario()
  })

  return (
    <AuthContext.Provider value={{ usuario, cargandoUsuario, actualizarUsuario, setUsuarioContext }}>
      {children}
    </AuthContext.Provider>
  )
}