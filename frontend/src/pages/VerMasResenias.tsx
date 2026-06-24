import { useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useOnInit } from "../utils/hooks"
import { libroService } from "../services/libroService"
import type { CalificacionDTO } from "../models/libroModel"
import { ReseniaCard } from "../components/detalleLibros/ReseniaCard"
import { Spinner } from "../components/ui/Spinner"
import { Paginacion } from "../components/ui/Paginacion"
import { ChevronLeft, ChevronUp, ChevronDown } from "lucide-react"
import { ErrorCard } from "../components/ui/ErrorCard"
import {
  obtenerMensajeError,
  type ErrorPersonalizado,
} from "../utils/errorHandler"

const ITEMS_POR_PAGINA = 12

export const VerMasResenias = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [calificaciones, setCalificaciones] = useState<CalificacionDTO[]>([])
  const [tituloLibro, setTituloLibro] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ErrorPersonalizado | null>(null)
  const [ordenAscendente, setOrdenAscendente] = useState(false)
  const [pagina, setPagina] = useState(1)

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)
    try {
      const [data, libro] = await Promise.all([
        libroService.getCalificaciones(Number(id)),
        libroService.getLibroById(Number(id)),
      ])
      setCalificaciones(data)
      setTituloLibro(libro.titulo)
    } catch (err) {
      setError(obtenerMensajeError(err))
    } finally {
      setLoading(false)
    }
  }

  useOnInit(() => {
    cargarDatos()
  })

  const calificacionesOrdenadas = useMemo(() => {
    return [...calificaciones].sort((a, b) =>
      ordenAscendente ? a.valor - b.valor : b.valor - a.valor,
    )
  }, [calificaciones, ordenAscendente])

  const totalPaginas = Math.max(
    1,
    Math.ceil(calificacionesOrdenadas.length / ITEMS_POR_PAGINA),
  )
  const calificacionesPagina = calificacionesOrdenadas.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA,
  )

  if (loading) return <Spinner />

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-6 pt-24">
        <ErrorCard
          error={error}
          alReintentar={cargarDatos}
          alVolver={() => navigate(`/libros/${id}`)}
        />
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 pt-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/libros/${id}`)}
            className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-secondary/50 hover:text-secondary transition-colors mb-3"
          >
            <ChevronLeft size={14} />
            Volver a {tituloLibro}
          </button>
          <h1 className="text-3xl font-bold text-secondary-dark">
            Reseñas de la Comunidad
          </h1>
          <p className="text-sm text-secondary-light mt-1">
            {calificaciones.length} reseña
            {calificaciones.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setOrdenAscendente((v) => !v)
            setPagina(1)
          }}
          className="flex items-center gap-2 text-xs font-semibold text-secondary/60 hover:text-secondary border border-accent/30 rounded-xl px-4 py-2.5 transition-colors"
        >
          {ordenAscendente ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
          {ordenAscendente ? "Menor puntuadas" : "Mejor puntuadas"}
        </button>
      </div>

      {calificaciones.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-xl border border-accent/20">
          <p className="text-on-surface-variant opacity-60">
            Este libro aún no tiene reseñas.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {calificacionesPagina.map((calificacion) => (
              <ReseniaCard
                key={calificacion.usuarioId}
                calificacion={calificacion}
              />
            ))}
          </div>

          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            alCambiar={(nueva) => setPagina(nueva)}
          />
        </>
      )}
    </main>
  )
}
