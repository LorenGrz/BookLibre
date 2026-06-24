import type { CalificacionDTO } from "../../models/libroModel"

interface ReseniaCardProps {
  calificacion: CalificacionDTO
  truncate?: boolean
}

export const ReseniaCard = ({ calificacion, truncate = false }: ReseniaCardProps) => {
  return (
    <section className="bg-surface border border-accent/20 rounded-2xl p-5 flex flex-col gap-3 hover:border-accent/40 transition-colors h-full">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary-light text-sm font-bold shrink-0">
          {calificacion.nombreUsuario.charAt(0).toUpperCase()}
        </div>
        
        <div>
          <p className="text-sm font-bold text-secondary-dark">
            {calificacion.nombreUsuario}
          </p>
          <div className="flex gap-0.5 text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < calificacion.valor ? "text-yellow-400" : "text-accent/30"}>
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      {calificacion.comentario && (
        <p className={`text-xs text-secondary/70 leading-relaxed ${truncate ? 'line-clamp-3' : ''}`}>
          {calificacion.comentario}
        </p>
      )}
    </section>
  )
}