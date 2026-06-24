import { Pencil, Trash2 } from "lucide-react"
import type { LibroUsuarioItemDTO } from "../../models/libroModel"
import { useNavigate } from "react-router-dom"
import { TablaLibrosIconoOrden } from "./TablaLibrosIconoOrden"
import {
  formatearFechaAgregadoLibro,
  rutaEditarLibro,
} from "../../utils/misLibros/tablaLibros"
import type {
  CampoOrdenMisLibros,
  SentidoOrden,
} from "../../utils/misLibros/gestionMisLibros"

export type PropsTablaLibros = {
  libros: LibroUsuarioItemDTO[]
  campoOrden: CampoOrdenMisLibros
  sentidoOrden: SentidoOrden
  alCambiarOrden: (campo: CampoOrdenMisLibros) => void
  alEliminar: (libroId: number) => void
  clicksPorLibro?: Map<number, number>
}

export const TablaLibros = ({
  libros,
  campoOrden,
  sentidoOrden,
  alCambiarOrden,
  alEliminar,
  clicksPorLibro,
}: PropsTablaLibros) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-accent/15">
            {[
              {
                campo: "titulo" as CampoOrdenMisLibros,
                label: "Título y Autor",
              },
              { campo: "estado" as CampoOrdenMisLibros, label: "Disponible" },
              { campo: "fecha" as CampoOrdenMisLibros, label: "Agregado" },
            ].map(({ campo, label }) => (
              <th key={campo} className="py-4">
                <button
                  type="button"
                  className="cursor-pointer inline-flex items-center text-[9px] font-bold tracking-widest text-on-surface-variant/50 uppercase hover:text-on-surface-variant transition-colors"
                  onClick={() => alCambiarOrden(campo)}
                >
                  {label}
                  <TablaLibrosIconoOrden
                    activo={campoOrden === campo}
                    sentido={sentidoOrden}
                  />
                </button>
              </th>
            ))}
            <th className="py-4 text-center text-[9px] font-bold tracking-widest text-on-surface-variant/50 uppercase">
              Clicks
            </th>
            <th className="py-4 text-right pr-4 text-[9px] font-bold tracking-widest text-on-surface-variant/50 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-accent/10">
          {libros.map((libro) => {
            const badgeEstilo = libro.disponible
              ? "bg-success-bg text-success border border-success/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
              : "bg-danger-bg text-danger border border-danger/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]"

            const badgeTexto = libro.disponible ? "Disponible" : "Prestado"
            return (
              <tr
                key={libro.id}
                className="group hover:bg-surface-high transition-all duration-150"
              >
                <td
                  className="py-4 cursor-pointer"
                  onClick={() => navigate(`../libros/${libro.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {libro.imagenUrl ? (
                      <img
                        src={libro.imagenUrl}
                        alt={`Portada de ${libro.titulo}`}
                        className="w-10 h-14 rounded object-cover border border-accent/20 shrink-0 transition-transform duration-150 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-14 rounded bg-surface-highest flex items-center justify-center text-[10px] text-on-surface-variant/30 border border-accent/15 shrink-0">
                        📖
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-on-surface text-sm">
                        {libro.titulo}
                      </div>
                      <div className="text-xs text-on-surface-variant/60 font-medium">
                        {libro.autor}
                      </div>
                      <div className="text-[10px] text-on-surface-variant/40 uppercase tracking-wider">
                        {libro.genero}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${badgeEstilo}`}
                  >
                    {badgeTexto}
                  </span>{" "}
                </td>
                <td className="py-4 text-xs text-on-surface-variant/50 font-medium">
                  {formatearFechaAgregadoLibro(libro.fechaAgregado)}
                </td>
                <td className="py-4 text-center text-sm font-semibold text-on-surface tabular-nums">
                  {clicksPorLibro?.get(libro.id) ?? 0}
                </td>
                <td className="py-4">
                  <div className="flex justify-end gap-2 pr-4">
                    <button
                      onClick={() => navigate(rutaEditarLibro(libro.id))}
                      type="button"
                      className="cursor-pointer p-2 rounded hover:bg-surface-highest hover:text-primary-light text-on-surface-variant/40 transition-all"
                      aria-label="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={!libro.disponible}
                      title={
                        libro.disponible
                          ? "Eliminar libro"
                          : "No se puede eliminar un libro prestado"
                      }
                      className="cursor-pointer p-2 rounded transition-all hover:bg-surface-highest disabled:opacity-30 disabled:cursor-not-allowed text-on-surface-variant/40 hover:text-danger"
                      aria-label="Eliminar"
                      onClick={() => alEliminar(libro.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
