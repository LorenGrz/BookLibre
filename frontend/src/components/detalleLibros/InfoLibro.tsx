import { Libro } from "../../classes/Libro"
import { DetalleFila, DetalleItem } from "../ui/DetalleGrid"
import { Card, CardHeader } from "../ui/Card"
import { GENERO_LABEL, IDIOMA_LABEL, ESTADO_LABEL, TIPO_LABEL } from "../../models/libroModel"
import { formatearFechaVisual } from "../../utils/dateHandlerReserva"

interface InfoLibroProps {
  libro: Libro
  karmaCalculado: number
  mostrarKarma?: boolean
}

const estadoColor: Record<string, string> = {
  EXCELENTE: "text-success",
  MUY_BUENO: "text-green-400",
  BUENO:     "text-blue-400",
  REGULAR:   "text-warning",
  MALO:      "text-danger",
}

export const InfoLibro = ({ libro, karmaCalculado, mostrarKarma = true }: InfoLibroProps) => {
  return (
    <section className="flex flex-col gap-6">
      {/* Título + autor */}
      <div className="border-b border-accent/15 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-primary/15 text-primary-light text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-primary/20">
            {GENERO_LABEL[libro.genero ?? ""] ?? libro.genero}
          </span>
          <div className="flex items-center gap-0.5 text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < Math.round(libro.rating) ? "text-yellow-400" : "text-outline/40"}>
                ★
              </span>
            ))}
            <span className="text-on-surface-variant/40 ml-1 text-xs">({libro.rating})</span>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-3 leading-tight">
          {libro.titulo}
        </h1>
        <div>
          <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-wider mb-0.5">Autor</p>
          <p className="font-semibold text-on-surface-variant">{libro.autor}</p>
        </div>
      </div>

      {/* Sinopsis */}
      <div>
        <h3 className="font-bold text-lg mb-2 text-on-surface">Sinopsis</h3>
        <p className="text-on-surface-variant/80 leading-relaxed text-sm break-words overflow-wrap-anywhere">
          {libro.descripcion}
        </p>
      </div>

      {/* Detalles */}
      <Card className="overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-accent/10">
          <CardHeader titulo="Detalles del libro" className="text-base" />
        </div>
        <div className="p-5 flex flex-col gap-5">
          <DetalleFila>
            <DetalleItem label="Tipo" colSpan={mostrarKarma ? "col-span-2 md:col-span-3" : "col-span-2 md:col-span-4"}>
              <span className="bg-primary/10 text-primary-light text-xs font-bold px-3 py-1.5 rounded-lg flex w-fit items-center gap-1.5 border border-primary/20">
                {TIPO_LABEL[libro.tipo ?? ""] ?? libro.tipo}
              </span>
            </DetalleItem>

            {mostrarKarma && (
              <DetalleItem label="Bibliokarmas" colSpan="col-span-2 md:col-span-1">
                <span className="bg-success-bg text-success font-bold px-4 py-1.5 rounded-lg flex w-fit border border-success/20">
                  +{karmaCalculado}
                </span>
              </DetalleItem>
            )}
          </DetalleFila>

          <DetalleFila>
            <DetalleItem label="Género">{GENERO_LABEL[libro.genero ?? ""] ?? libro.genero}</DetalleItem>
            <DetalleItem label="Páginas">{libro.paginas}</DetalleItem>
            <DetalleItem label="Idioma">{IDIOMA_LABEL[libro.idioma ?? ""] ?? libro.idioma}</DetalleItem>
            <DetalleItem label="Editorial">{libro.editorial}</DetalleItem>
          </DetalleFila>

          <DetalleFila>
            <DetalleItem label="ISBN-13">{libro.isbn}</DetalleItem>
            <DetalleItem label="Publicado">
              {libro.fechaPublicacion ? formatearFechaVisual(libro.fechaPublicacion) : "—"}
            </DetalleItem>
            <DetalleItem label="Estado">
              <span className={estadoColor[libro.estado ?? ""] ?? "text-on-surface"}>
                {ESTADO_LABEL[libro.estado ?? ""] ?? libro.estado}
              </span>
            </DetalleItem>
            <DetalleItem label="Préstamos totales">{libro.cantidadReservas ?? 0}</DetalleItem>
          </DetalleFila>
        </div>
      </Card>
    </section>
  )
}