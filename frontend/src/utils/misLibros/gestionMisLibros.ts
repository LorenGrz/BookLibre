import type { LibroUsuarioItemDTO } from '../../models/libroModel'
import type { Pestaña } from '../../components/ui/Tabs'

export type FiltroMisLibros = 'todos' | 'disponibles' | 'prestados'
export type CampoOrdenMisLibros = 'titulo' | 'estado' | 'fecha'
export type SentidoOrden = 'ascendente' | 'descendente'

export const POR_PAGINA_MIS_LIBROS = 3

export const OPCIONES_POR_PAGINA = [3, 5, 10] as const
export type OpcionPorPagina = (typeof OPCIONES_POR_PAGINA)[number]

export const pestañasMisLibros: Pestaña[] = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'disponibles', etiqueta: 'Disponibles' },
  { id: 'prestados', etiqueta: 'Prestados' },
]

const estrategiasFiltro: Record<FiltroMisLibros, (l: LibroUsuarioItemDTO) => boolean> =
  {
    todos: () => true,
    disponibles: (l) => l.disponible,
    prestados: (l) => !l.disponible,
  }

const comparadoresOrden: Record<CampoOrdenMisLibros,
  (a: LibroUsuarioItemDTO, b: LibroUsuarioItemDTO) => number> = {
  titulo: (a, b) => a.titulo.localeCompare(b.titulo),
  estado: (a, b) => Number(a.disponible) - Number(b.disponible),
  fecha: (a, b) => {
    const fa = a.fechaAgregado ? new Date(a.fechaAgregado).getTime() : 0
    const fb = b.fechaAgregado ? new Date(b.fechaAgregado).getTime() : 0
    return fa - fb
  },
}

/** Filtra la lista según pestaña (todos / disponibles / prestados). */
export function filtrarMisLibros(libros: LibroUsuarioItemDTO[], filtro: FiltroMisLibros): LibroUsuarioItemDTO[] {
  return libros.filter(estrategiasFiltro[filtro])
}

/** Ordena por título, estado o fecha según el sentido indicado. */
export function ordenarMisLibros(libros: LibroUsuarioItemDTO[], campo: CampoOrdenMisLibros, sentido: SentidoOrden): LibroUsuarioItemDTO[] {
  const comparador = comparadoresOrden[campo]
  return [...libros].sort((a, b) => {
    const resultado = comparador(a, b)
    return sentido === 'ascendente' ? resultado : -resultado
  })
}

export type ResultadoPaginacionMisLibros = {
  totalPaginas: number
  paginaAjustada: number
  inicio: number
  fin: number
  librosPagina: LibroUsuarioItemDTO[]
}

/** Calcula página actual y slice de libros para esa página. */
export function paginarMisLibros(
  librosOrdenados: LibroUsuarioItemDTO[],
  pagina: number,
  porPagina: number = POR_PAGINA_MIS_LIBROS,
): ResultadoPaginacionMisLibros {
  const totalPaginas = Math.max(1, Math.ceil(librosOrdenados.length / porPagina))
  const paginaAjustada = Math.min(pagina, totalPaginas)
  const inicio = (paginaAjustada - 1) * porPagina
  const fin = inicio + porPagina
  const librosPagina = librosOrdenados.slice(inicio, fin)
  return { totalPaginas, paginaAjustada, inicio, fin, librosPagina }
}

/** Texto "desde–hasta de total" para el pie de la tabla. */
export function rangoEtiquetaPaginacion(inicio: number, fin: number, totalLibros: number): { desde: number; hasta: number; total: number } {
  return {
    desde: inicio + 1,
    hasta: Math.min(fin, totalLibros),
    total: totalLibros,
  }
}

/** Alterna asc/desc si es el mismo campo; si no, orden ascendente en el nuevo campo. */
export function siguienteSentidoOrden(
  campoActual: CampoOrdenMisLibros,
  sentidoActual: SentidoOrden,
  campoClic: CampoOrdenMisLibros,
): { campo: CampoOrdenMisLibros; sentido: SentidoOrden } {
  if (campoActual === campoClic) {
    return {
      campo: campoClic,
      sentido: sentidoActual === 'ascendente' ? 'descendente' : 'ascendente',
    }
  }
  return { campo: campoClic, sentido: 'ascendente' }
}
