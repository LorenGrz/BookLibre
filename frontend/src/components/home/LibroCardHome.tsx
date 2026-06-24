import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GENERO_LABEL, IDIOMA_LABEL, ESTADO_LABEL, TIPO_LABEL } from '../../models/libroModel'
import type { EstadoLibro } from '../../models/libroModel'
import { Star, BookOpen } from 'lucide-react'

type LibroCardProps = {
  id: number
  imagenUrl: string
  genero: string
  titulo: string
  autor: string
  calificacion: number
  isbn: string
  idioma: string
  tipo: string
  bibliokarma: number
  estado: EstadoLibro
  duenio: string
  destacado?: boolean
}

const estadoColor: Record<EstadoLibro, string> = {
  EXCELENTE: "bg-success-bg text-success border-success/20",
  MUY_BUENO: "bg-success-bg text-success border-success/20",
  BUENO: "bg-surface-highest text-on-surface-variant border-accent/20",
  REGULAR: "bg-warning-bg text-warning border-warning/20",
  MALO: "bg-danger-bg text-danger border-danger/20",
}

export const LibroCardHome = ({
  id, imagenUrl, genero, titulo, autor, calificacion,
  isbn, idioma, tipo, bibliokarma, estado, duenio, destacado = false,
}: LibroCardProps) => {
  const [imgFailed, setImgFailed] = useState(false)
  const estadoCls = estadoColor[estado] ?? "bg-surface-highest text-on-surface-variant border-accent/20"
  const destaqueCls = destacado
    ? "border-2 border-primary/80 shadow-[0_0_22px_rgba(247,189,72,0.24)] hover:border-primary"
    : "border border-accent/10 hover:border-accent/30 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"

  return (
    <Link
      to={`/libros/${id}`}
      className={`group flex flex-col bg-surface rounded-xl overflow-hidden hover:-translate-y-1.5 transition-all duration-300 ${destaqueCls}`}
    >
      {/* Portada */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-surface-highest">
        {imagenUrl && !imgFailed ? (
          <img
            src={imagenUrl}
            alt={`Portada de ${titulo}`}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-on-surface-variant/15">
            <BookOpen size={36} strokeWidth={1} />
            <span className="text-[9px] uppercase tracking-widest font-bold">Sin portada</span>
          </div>
        )}

        {/* Badge estado (sobre la imagen) */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-sm ${estadoCls}`}>
            {ESTADO_LABEL[estado] ?? estado}
          </span>
        </div>

        {/* Rating overlay */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
          <Star size={9} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-bold text-white">{calificacion}</span>
        </div>

        {/* Gradient overlay al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info principal */}
      <div className="flex flex-col gap-0.5 px-3.5 pt-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80">
          {GENERO_LABEL[genero] ?? genero}
        </span>
        <h3 className="text-sm font-bold text-on-surface leading-snug line-clamp-2 mt-0.5">
          {titulo}
        </h3>
        <span className="text-[11px] text-on-surface-variant/70">{autor}</span>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-2 px-3.5 pt-3 pb-3 mt-auto">
        <div>
          <p className="text-[9px] text-on-surface-variant/40 uppercase tracking-wider mb-0.5">Idioma</p>
          <p className="text-[11px] font-semibold text-on-surface truncate">{IDIOMA_LABEL[idioma] ?? idioma}</p>
        </div>
        <div>
          <p className="text-[9px] text-on-surface-variant/40 uppercase tracking-wider mb-0.5">Tipo</p>
          <p className="text-[11px] font-semibold text-on-surface truncate">{TIPO_LABEL[tipo] ?? tipo}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[9px] text-on-surface-variant/40 uppercase tracking-wider mb-0.5">ISBN</p>
          <p className="text-[11px] font-semibold text-on-surface truncate">{isbn}</p>
        </div>
      </div>

      {/* Footer: dueño + bibliokarma */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-accent/10 bg-surface-high/40">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[9px] font-bold flex items-center justify-center">
            {duenio.charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] text-on-surface-variant/60 truncate max-w-[80px]">@{duenio}</span>
        </div>
        <span className="text-[10px] font-bold text-primary-light">+{bibliokarma} BK</span>
      </div>
    </Link>
  )
}

export default LibroCardHome
