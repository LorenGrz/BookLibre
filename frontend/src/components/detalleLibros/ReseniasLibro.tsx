import { useNavigate } from "react-router-dom"
import type { CalificacionDTO } from "../../models/libroModel"
import { ReseniaCard } from "./ReseniaCard"

interface ReseniasLibroProps {
  libroId: number
  calificaciones: CalificacionDTO[]
  totalCalificaciones?: number
}

export const ReseniasLibro = ({
  libroId,
  calificaciones,
  totalCalificaciones,
}: ReseniasLibroProps) => {
  const navigate = useNavigate()
  if (calificaciones.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl text-secondary-dark">
          Reseñas de la Comunidad
        </h3>

        {totalCalificaciones !== undefined && totalCalificaciones > 2 && (
          <button
            type="button"
            className="cursor-pointer flex items-center gap-1.5 text-sm font-semibold text-secondary/50 hover:text-secondary transition-colors mb-3"
            onClick={() => navigate(`/libros/${libroId}/resenias`)}
          >
            Ver las {totalCalificaciones} reseñas →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calificaciones.map((calificacion) => (
          <ReseniaCard
            key={calificacion.usuarioId}
            calificacion={calificacion}
            truncate={true}
          />
        ))}
      </div>
    </section>
  )
}
