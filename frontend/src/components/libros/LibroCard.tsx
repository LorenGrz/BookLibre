import { Libro } from "../../classes/Libro"
import { useState } from "react"
import type { TipoPrestamo } from "../../models/libroModel"
import { ModalCalificacion } from "./ModalCalificacion"
import { libroService } from "../../services/libroService"
import { authService } from "../../services/AuthService"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { obtenerMensajeError } from "../../utils/errorHandler"
import { formatearFechaHoraVisual } from "../../utils/dateHandlerReserva"

interface LibroCardProps {
  libro: Libro
  tipoVista: TipoPrestamo
}

export const LibroCard = ({ libro, tipoVista }: LibroCardProps) => {
  const [yaCalificado, setYaCalificado] = useState(libro.estaCalificado())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ratingLocal, setRatingLocal] = useState(libro.rating)
  const navigate = useNavigate()
  const esPrestamoRecibido = tipoVista === "prestados-a-mi"
  const proximoAVencer = libro.estaProximoAVencer()
  const estaDisponible = libro.estoyDisponible()
  const usuarioActualId = authService.obtenerIdUsuarioActual() || 1
  // Reemplazá el alert:
  const handleCalificar = async (valor: number, comentario: string) => {
    try {
      const res = await libroService.calificarLibro(
        libro.id,
        usuarioActualId,
        valor,
        comentario,
      )
      setRatingLocal(res.data.rating)
      setYaCalificado(true)
      setIsModalOpen(false)
      toast.success("¡Gracias por calificar! 📚")
    } catch (e: unknown) {
      const err = obtenerMensajeError(e)
      toast.error(err.mensaje || "No se pudo enviar la calificación.")
    }
  }
  const goToDetail = () => {
    navigate(`/libros/${libro.id}`)
  }
  const getEtiqueta = () => {
    // Si está devuelto, mostrar DEVUELTO
    if (libro.estaDevuelto()) return "DEVUELTO"

    // Si la reserva todavía no comenzó, mostrar RESERVADO
    if (libro.estaReservadoFuturo()) return "RESERVADO"

    // Si está próximo a vencer, mostrar eso
    if (proximoAVencer) return "PRÓXIMO A VENCER"

    // Si está activo pero tiene fecha, mostrar días restantes o próximo a vencer
    if (libro.fechaHasta) {
      const diasRestantes = Math.ceil(
        (new Date(libro.fechaHasta).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
      )
      if (diasRestantes > 0) return `VENCE EN ${diasRestantes}D`
    }

    // Estado por defecto: PRESTADO
    return "PRESTADO"
  }

  const getBadgeStyles = () => {
    // Si está devuelto (verde)
    if (libro.estaDevuelto())
      return "bg-success-bg text-success border border-success/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]"

    // Si la reserva todavía no comenzó (violeta)
    if (libro.estaReservadoFuturo())
      return "bg-purple-900/30 text-purple-400 border border-purple-400/20 shadow-[0_0_8px_rgba(168,85,247,0.2)]"

    // Si está próximo a vencer (amarillo/warning)
    if (proximoAVencer)
      return "bg-warning-bg text-warning border border-warning/20 shadow-[0_0_8px_rgba(245,158,11,0.2)]"

    // Si está activo (azul)
    if (estaDisponible)
      return "bg-[#0c2340] text-blue-400 border border-blue-400/20 shadow-[0_0_8px_rgba(96,165,250,0.2)]"

    // Por defecto prestado (rojo/danger)
    return "bg-danger-bg text-danger border border-danger/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
  }

  return (
    <div className="relative bg-surface rounded-xl border border-accent/10 hover:border-accent/30 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col h-full group hover:-translate-y-1.5 transition-all duration-300">
      <div
        onClick={goToDetail}
        className="relative overflow-hidden cursor-pointer rounded-t"
        style={{ aspectRatio: "2/3" }}
      >
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold z-10 uppercase tracking-tighter ${getBadgeStyles()}`}
        >
          {getEtiqueta()}
        </div>
        <img
          src={libro.imagenUrl}
          alt={libro.titulo}
          className="w-full h-full object-contain bg-black/20 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="grow flex flex-col gap-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-serif text-xl text-on-surface line-clamp-2 leading-tight">
              {libro.titulo}
            </h3>
            <span className="text-primary-light text-sm font-extrabold shrink-0">
              ★{ratingLocal}
            </span>
          </div>
          <p className="text-on-surface-variant text-sm italic">
            {libro.autor}
          </p>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent mb-2 mt-1" />

        <div className="space-y-3 mb-4">
          {/* Prestado por/a */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-medium">
              {esPrestamoRecibido ? "Prestado por" : "Prestado a"}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-surface-highest flex items-center justify-center text-[9px] font-bold text-primary-light shrink-0">
                {esPrestamoRecibido
                  ? (libro.propietarioNombre ?? libro.propietarioId?.toString() ?? "?").charAt(0).toUpperCase()
                  : (libro.alquiladoPorNombre ?? libro.alquiladoPorId?.toString() ?? "?").charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-on-surface font-medium">
                {esPrestamoRecibido
                  ? (libro.propietarioNombre ?? `Usuario ${libro.propietarioId}`)
                  : (libro.alquiladoPorNombre ?? `Usuario ${libro.alquiladoPorId}`)}
              </span>
            </div>
          </div>

          {/* Rango de fechas */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-medium">
              Período
            </span>
            <div className="flex items-center gap-2 text-xs text-on-surface font-medium">
              <span>{formatearFechaHoraVisual(libro.fechaDesde ?? "")}</span>
              <span className="text-primary/40">→</span>
              <span>{libro.fechaHasta ? formatearFechaHoraVisual(libro.fechaHasta) : "Sin fecha"}</span>
            </div>
          </div>

          {/* Bibliokarma */}
          <div className="flex items-center justify-between pt-1 border-t border-accent/10">
            <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/50 font-medium">
              Bibliokarma
            </span>
            <span className="text-sm font-bold text-primary-light">
              +{libro.bibliokarma}
            </span>
          </div>
        </div>

        <button
          onClick={() => !yaCalificado && setIsModalOpen(true)}
          className={`mt-auto w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all border
          ${esPrestamoRecibido && libro.estaDevuelto() ? "visible" : "invisible pointer-events-none"}
          ${yaCalificado
              ? "bg-success-bg text-success border-success/20 cursor-default"
              : "border-primary/40 text-primary-light hover:bg-primary/10 cursor-pointer"
            }`}
        >
          {yaCalificado ? "✓ Calificado" : "★ Calificar"}
        </button>
      </div>
      <ModalCalificacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCalificar}
        tituloLibro={libro.titulo}
      />
      {!libro.libroActivo && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
          <span className="text-white font-semibold text-sm">
            Libro no disponible
          </span>
        </div>
      )}
    </div>
  )
}
