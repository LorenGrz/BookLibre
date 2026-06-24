export type ErrorPersonalizado = {
  estado?: number
  mensaje: string
}

export type PropsErrorCard = {
  error: ErrorPersonalizado
  alReintentar?: () => void
  alVolver?: () => void
}

export function ErrorCard({ error, alReintentar, alVolver }: PropsErrorCard) {
  return (
    <div data-testid="error-card" className="flex items-center justify-center w-full min-h-[40vh] px-4">
      <div className="p-8 max-w-md text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl">
          !
        </div>
        <h2 className="text-lg font-bold text-secondary">
          {error.mensaje}
          {error.estado != null && error.estado > 0 ? ` (${error.estado})` : ""}
        </h2>
        <div className="flex gap-2">
          {alVolver && (
            <button
              type="button"
              onClick={alVolver}
              className="px-4 py-2 rounded-lg font-medium bg-secondary/20 text-secondary hover:bg-secondary/30"
            >
              {error.estado === 401 ? "Iniciar sesión" : "Volver"}
            </button>
          )}
          {alReintentar && (
            <button
              type="button"
              onClick={alReintentar}
              className="px-4 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary-dark"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
