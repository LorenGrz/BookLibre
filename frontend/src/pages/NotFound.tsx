import { NavLink } from 'react-router-dom'

export const NotFound = () => {
  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold text-secondary">Página no encontrada</h1>
      <p className="text-secondary/70 mt-2">
        La ruta a la que intentaste entrar no existe.
      </p>
      <NavLink className="inline-block mt-6 text-primary font-semibold" to="/home">
        Volver al inicio
      </NavLink>
    </div>
  )
}

