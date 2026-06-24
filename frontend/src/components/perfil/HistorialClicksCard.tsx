import type { ClickLogDTO } from "../../models/libroModel"

export type PropsHistorialClicksCard = {
  clicks: ClickLogDTO[]
  cargando?: boolean
  error?: string | null
  onReintentar?: () => void
}

const formatearFechaHora = (fechaHora: string): string => {
  const fecha = new Date(fechaHora)
  if (Number.isNaN(fecha.getTime())) return fechaHora
  return fecha.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const HistorialClicksCard = ({
  clicks,
  cargando = false,
  error = null,
  onReintentar,
}: PropsHistorialClicksCard) => {
  return (
    <div className="bg-surface rounded-xl border border-accent/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden transition-transform duration-300 hover:-translate-y-0.5">
      <div className="px-6 pt-6 pb-4 border-b border-accent/10">
        <h2 className="text-2xl font-serif font-bold text-on-surface">
          Historial de clicks
        </h2>
        <p className="text-xs text-on-surface-variant/50 mt-1">
          Visitas registradas en tus libros publicados.
        </p>
      </div>

      <div className="px-6 py-6">
        {cargando ? (
          <div className="space-y-3" aria-label="Cargando historial de clicks">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-surface-high animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-surface-high animate-pulse" />
                </div>
                <div className="h-3 w-32 rounded bg-surface-high animate-pulse" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-on-surface font-bold text-lg">
              No se pudo cargar el historial
            </div>
            <p className="text-on-surface-variant/50 text-sm mt-1 max-w-md">
              {error}
            </p>
            {onReintentar && (
              <button
                onClick={onReintentar}
                className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-accent/20 text-on-surface-variant hover:text-on-surface rounded transition-all"
              >
                Reintentar
              </button>
            )}
          </div>
        ) : clicks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 bg-surface-high rounded flex items-center justify-center mb-4 text-2xl">
              👀
            </div>
            <div className="text-on-surface font-bold text-lg">
              Aún no hay clicks en tus libros
            </div>
            <p className="text-on-surface-variant/50 text-sm mt-1">
              Cuando alguien visite tus publicaciones, vas a verlo acá.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 border-b border-accent/10">
                  <th className="py-3 pr-4">Libro</th>
                  <th className="py-3 pr-4">Usuario</th>
                  <th className="py-3">Fecha y hora</th>
                </tr>
              </thead>
              <tbody>
                {clicks.map((click, idx) => (
                  <tr
                    key={`${click.libroId}-${click.fechaHora}-${idx}`}
                    className="border-b border-accent/5 last:border-b-0 hover:bg-surface-high/40 transition-colors"
                  >
                    <td className="py-3 pr-4 text-on-surface font-medium">
                      {click.libroTitulo}
                    </td>
                    <td className="py-3 pr-4 text-on-surface-variant">
                      {click.nombreUsuario}
                    </td>
                    <td className="py-3 text-on-surface-variant/70 tabular-nums">
                      {formatearFechaHora(click.fechaHora)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
