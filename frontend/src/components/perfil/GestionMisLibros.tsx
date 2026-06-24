import { useState } from "react"
import type { LibroUsuarioItemDTO } from "../../models/libroModel"
import { Plus } from "lucide-react"
import { Tabs } from "../ui"
import { TablaLibros } from "./TablaLibros"
import { Paginacion } from "../ui/Paginacion"
import { useGestionMisLibros } from "../../utils/misLibros/useGestionMisLibros"
import {
  pestañasMisLibros,
  OPCIONES_POR_PAGINA,
  type OpcionPorPagina,
} from "../../utils/misLibros/gestionMisLibros"

export type PropsGestionMisLibros = {
  libros?: LibroUsuarioItemDTO[]
  gestion?: ReturnType<typeof useGestionMisLibros>
  onAgregar: () => void
  onEliminar?: (libroId: number) => void | Promise<void>
  clicksPorLibro?: Map<number, number>
}

export const GestionMisLibros = ({
  libros,
  gestion,
  onAgregar,
  onEliminar,
  clicksPorLibro,
}: PropsGestionMisLibros) => {
  const hookResult = useGestionMisLibros({ libros })
  const activeGestion = gestion ?? hookResult

  const {
    alCambiarFiltro,
    cambiarOrden,
    campoOrden,
    filtro,
    librosPagina,
    paginaAjustada,
    porPagina,
    setPorPagina,
    rangoEtiqueta,
    sentidoOrden,
    setPagina,
    totalPaginas,
    cargando,
    error,
    recargar,
    totalElements,
  } = activeGestion
  const [animating, setAnimating] = useState(false)

  const solicitarEliminar = async (id: number) => {
    if (!onEliminar) return
    const ok = window.confirm(
      "¿Eliminar este libro? Esta acción no se puede deshacer.",
    )
    if (ok) {
      await onEliminar(id)
      recargar()
    }
  }

  const handleCambiarFiltro = (id: string) => {
    setAnimating(true)
    setTimeout(() => {
      alCambiarFiltro(id)
      setAnimating(false)
    }, 150)
  }

  const handleCambiarPagina = (nueva: number) => {
    setAnimating(true)
    setTimeout(() => {
      setPagina(nueva)
      setAnimating(false)
    }, 150)
  }

  const handleCambiarOrden = (campo: typeof campoOrden) => {
    setAnimating(true)
    setTimeout(() => {
      cambiarOrden(campo)
      setAnimating(false)
    }, 150)
  }

  const mostrarPaginacion =
    !cargando && !error && totalElements > 0

  return (
    <div className="bg-surface rounded-xl border border-accent/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 flex flex-col">
      <div className="px-6 pt-6 pb-4 border-b border-accent/10 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-serif font-bold text-on-surface">
          Gestión de Mis Libros
        </h2>
        <button
          onClick={onAgregar}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant border border-accent/20 rounded hover:bg-surface-high hover:text-on-surface transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar Libro
        </button>
      </div>
      <div className="px-6 pt-5">
        <Tabs
          pestañas={pestañasMisLibros}
          idActivo={filtro}
          alCambiar={handleCambiarFiltro}
        />
      </div>

      <div className="px-6 pb-6 pt-2 flex-1">
        {cargando ? (
          <div className="py-10 px-2 space-y-5" aria-label="Cargando libros">
            <div className="flex items-center justify-between gap-4">
              <div className="h-6 w-44 bg-surface-high rounded animate-pulse" />
              <div className="h-10 w-44 bg-surface-high rounded animate-pulse" />
            </div>
            <div className="h-11 bg-surface-high rounded animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="h-14 w-10 rounded bg-surface-high animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-surface-high animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-surface-high animate-pulse" />
                  </div>
                  <div className="h-7 w-20 rounded bg-surface-high animate-pulse" />
                  <div className="ml-auto flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-surface-high animate-pulse" />
                    <div className="h-9 w-9 rounded-full bg-surface-high animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-on-surface font-bold text-lg">
              No se pudieron cargar tus libros
            </div>
            <p className="text-on-surface-variant/50 text-sm mt-1 max-w-md">
              {error}
            </p>
            <button
              onClick={recargar}
              className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-accent/20 text-on-surface-variant hover:text-on-surface rounded transition-all"
            >
              Reintentar
            </button>
          </div>
        ) : totalElements === 0 ? (
          filtro === "todos" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-surface-high rounded flex items-center justify-center mb-4 text-2xl">
                📚
              </div>
              <div className="text-on-surface font-bold text-lg">
                Aún no tenés libros
              </div>
              <p className="text-on-surface-variant/50 text-sm mt-1">
                ¡Agregá tu primer libro a la colección!
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-on-surface font-bold text-lg">
                No se encontraron resultados
              </div>
              <p className="text-on-surface-variant/50 text-sm mt-1">
                Probá cambiando el filtro.
              </p>
              <button
                onClick={() => handleCambiarFiltro("todos")}
                className="mt-4 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-accent/20 text-on-surface-variant hover:text-on-surface rounded transition-all"
              >
                Ver todos
              </button>
            </div>
          )
        ) : (
          <div
            className={`transition-all duration-150 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
          >
            <div className="min-h-84">
              <TablaLibros
                libros={librosPagina}
                campoOrden={campoOrden}
                sentidoOrden={sentidoOrden}
                alCambiarOrden={handleCambiarOrden}
                alEliminar={solicitarEliminar}
                clicksPorLibro={clicksPorLibro}
              />
            </div>
          </div>
        )}
      </div>

      {mostrarPaginacion && (
        <div className="px-6 py-4 border-t border-accent/10">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-on-surface-variant/40 font-medium">
              Mostrando {rangoEtiqueta.desde}–{rangoEtiqueta.hasta} de{" "}
              {rangoEtiqueta.total} libros
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant/40">
                Por página
              </span>
              <select
                value={porPagina}
                onChange={(e) =>
                  setPorPagina(Number(e.target.value) as OpcionPorPagina)
                }
                className="cursor-pointer text-xs font-semibold bg-surface border border-accent/20 text-on-surface-variant rounded px-2 py-1 hover:border-accent/40 transition-colors focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                {OPCIONES_POR_PAGINA.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Paginacion
            pagina={paginaAjustada}
            totalPaginas={totalPaginas}
            alCambiar={handleCambiarPagina}
          />
        </div>
      )}
    </div>
  )
}
