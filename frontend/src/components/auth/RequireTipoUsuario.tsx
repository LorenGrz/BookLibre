import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import type { TipoUsuario } from "../../models/usuarioModel"
import { useAuthContext } from "../../utils/hooks"

type RequireTipoUsuarioProps = {
  permitidos: TipoUsuario[]
  children: ReactNode
  redirectTo?: string
}

export function RequireTipoUsuario({permitidos,children,redirectTo = "/home"}: RequireTipoUsuarioProps) {
  const { usuario, cargandoUsuario } = useAuthContext()
  const location = useLocation()

  if (cargandoUsuario) {
    return (
      <div className="flex justify-center py-20 italic text-primary font-medium">
        Cargando...
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!permitidos.includes(usuario.tipoUsuario)) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

