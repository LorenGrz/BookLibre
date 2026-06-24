import { useCallback, useEffect, useMemo, useState } from 'react'
import type { LibroUsuarioItemDTO } from '../../models/libroModel'
import { libroService } from '../../services/libroService'
import {
  filtrarMisLibros,
  ordenarMisLibros,
  paginarMisLibros,
  rangoEtiquetaPaginacion,
  siguienteSentidoOrden,
  POR_PAGINA_MIS_LIBROS,
  type CampoOrdenMisLibros,
  type FiltroMisLibros,
  type OpcionPorPagina,
  type SentidoOrden,
} from './gestionMisLibros'

/** Estado de filtro, orden, paginación y listas derivadas para la gestión de libros del perfil. */
export function useGestionMisLibros({
  libros,
  usuarioId,
  enabled = true,
}: {
  libros?: LibroUsuarioItemDTO[]
  usuarioId?: number
  enabled?: boolean
}) {
  const [filtro, setFiltro] = useState<FiltroMisLibros>('todos')
  const [pagina, setPagina] = useState(1)
  const [campoOrden, setCampoOrden] = useState<CampoOrdenMisLibros>('titulo')
  const [sentidoOrden, setSentidoOrden] = useState<SentidoOrden>('ascendente')
  const [porPagina, setPorPaginaInterna] = useState<OpcionPorPagina>(POR_PAGINA_MIS_LIBROS)

  const [librosPaginaBackend, setLibrosPaginaBackend] = useState<LibroUsuarioItemDTO[]>([])
  const [totalElementsBackend, setTotalElementsBackend] = useState(0)
  const [totalPagesBackend, setTotalPagesBackend] = useState(1)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshCount, setRefreshCount] = useState(0)

  const recargar = useCallback(() => {
    setRefreshCount((c) => c + 1)
  }, [])

  const isClientSide = libros !== undefined

  // Backend effect
  useEffect(() => {
    if (isClientSide || !enabled || usuarioId === undefined) {
      return
    }

    let active = true
    const fetchLibros = async () => {
      setCargando(true)
      setError(null)
      try {
        const res = await libroService.obtenerLibrosUsuarioPerfil(
          usuarioId,
          pagina - 1,
          porPagina,
          filtro,
          campoOrden,
          sentidoOrden,
        )
        if (!active) return
        const content = res?.content ?? (Array.isArray(res) ? res : [])
        const total = res?.totalElements ?? content.length
        const totalP = res?.totalPages ?? 1
        setLibrosPaginaBackend(content)
        setTotalElementsBackend(total)
        setTotalPagesBackend(totalP)
      } catch (e: unknown) {
        if (!active) return
        setLibrosPaginaBackend([])
        setTotalElementsBackend(0)
        setTotalPagesBackend(1)
        setError('No se pudieron cargar tus libros.')
      } finally {
        if (active) {
          setCargando(false)
        }
      }
    }

    void fetchLibros()

    return () => {
      active = false
    }
  }, [usuarioId, enabled, pagina, porPagina, filtro, campoOrden, sentidoOrden, refreshCount, isClientSide])

  const cambiarOrden = useCallback((campo: CampoOrdenMisLibros) => {
    const { campo: c, sentido: s } = siguienteSentidoOrden(campoOrden, sentidoOrden, campo)
    setCampoOrden(c)
    setSentidoOrden(s)
    setPagina(1)
  }, [campoOrden, sentidoOrden])

  const alCambiarFiltro = useCallback((id: string) => {
    setFiltro(id as FiltroMisLibros)
    setPagina(1)
  }, [])

  const setPorPagina = useCallback((valor: OpcionPorPagina) => {
    setPorPaginaInterna(valor)
    setPagina(1)
  }, [])

  // Client-side calculations
  const librosFiltradosClient = useMemo(() => {
    if (!isClientSide || !libros) return []
    return filtrarMisLibros(libros, filtro)
  }, [libros, filtro, isClientSide])

  const librosOrdenadosClient = useMemo(() => {
    if (!isClientSide) return []
    return ordenarMisLibros(librosFiltradosClient, campoOrden, sentidoOrden)
  }, [librosFiltradosClient, campoOrden, sentidoOrden, isClientSide])

  const paginacionClient = useMemo(() => {
    if (!isClientSide) {
      return { totalPaginas: 1, paginaAjustada: pagina, inicio: 0, fin: 0, librosPagina: [] }
    }
    return paginarMisLibros(librosOrdenadosClient, pagina, porPagina)
  }, [librosOrdenadosClient, pagina, porPagina, isClientSide])

  // Merge results
  const librosPagina = isClientSide ? paginacionClient.librosPagina : librosPaginaBackend
  const totalElements = isClientSide ? librosFiltradosClient.length : totalElementsBackend
  const totalPaginas = isClientSide ? paginacionClient.totalPaginas : totalPagesBackend
  const paginaAjustada = isClientSide ? paginacionClient.paginaAjustada : pagina
  const inicio = isClientSide ? paginacionClient.inicio : (pagina - 1) * porPagina
  const fin = isClientSide ? paginacionClient.fin : inicio + librosPagina.length

  const rangoEtiqueta = useMemo(() =>
    rangoEtiquetaPaginacion(inicio, fin, totalElements), [inicio, fin, totalElements])

  const librosFiltrados = useMemo(() => {
    if (isClientSide) return librosFiltradosClient
    return Array.from({ length: totalElements }) as unknown as LibroUsuarioItemDTO[]
  }, [isClientSide, librosFiltradosClient, totalElements])

  return {
    filtro,
    pagina,
    setPagina,
    porPagina,
    setPorPagina,
    campoOrden,
    sentidoOrden,
    cambiarOrden,
    alCambiarFiltro,
    librosPagina,
    librosFiltrados,
    totalPaginas,
    paginaAjustada,
    rangoEtiqueta,
    cargando,
    error,
    recargar,
    totalElements,
  }
}
