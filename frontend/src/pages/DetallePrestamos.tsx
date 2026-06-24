import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { LibroCard } from "../components/libros/LibroCard"
import { Paginacion } from "../components/ui/Paginacion"
import { libroService } from "../services/libroService"
import { authService } from "../services/AuthService"
import { useAuthContext, useOnInit } from "../utils/hooks"
import { Libro } from "../classes/Libro"
import type { TipoPrestamo } from "../models/libroModel"
import { SearchBar } from "../components/ui/SearchBar"
import { Tabs } from "../components/ui/Tabs"
import { ErrorCard } from "../components/ui/ErrorCard"
import {
  obtenerMensajeError,
  type ErrorPersonalizado,
} from "../utils/errorHandler"
import { BookOpen } from "lucide-react"

export const DetallePrestamos = () => {
  const navigate = useNavigate()
  const [animating, setAnimating] = useState(false)
  const [todosLosLibros, setTodosLosLibros] = useState<Libro[]>([])
  const [totalPaginasServidor, setTotalPaginasServidor] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ErrorPersonalizado | null>(null)
  const [activeTab, setActiveTab] = useState<TipoPrestamo>("prestados-a-mi")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [tipoAnterior, setTipoAnterior] = useState<string | null>(null)

  const usuarioId = authService.obtenerIdUsuarioActual()
  const { usuario } = useAuthContext()
  const tipoUsuario = usuario?.tipoUsuario
  const tipo = (tipoUsuario ?? "").toUpperCase().replace(/\s+/g, "_")
  const puedeReservar = tipo === "LECTOR" || tipo === "LECTORPUBLICADOR"
  const puedePublicar = tipo === "PUBLICADOR" || tipo === "LECTORPUBLICADOR"
  const PAGE_SIZE = 5
  const pestañas = [
    ...(puedeReservar ? [{ id: "prestados-a-mi", etiqueta: "Prestados a mí" }] : []),
    ...(puedePublicar ? [{ id: "prestados-por-mi", etiqueta: "Prestados por mí" }] : []),
  ]

  // When a search query is active we fetch the entire dataset so client-side
  // filtering works across all results. Without a query, we paginate server-side.
  const fetchTodosLosPrestamos = async (
    tipo: TipoPrestamo = activeTab,
    page: number = 0,
    query: string = searchQuery,
  ) => {
    if (!usuarioId) {
      setError({ estado: 401, mensaje: "No estás logueado. Por favor iniciá sesión para ver tus préstamos." })
      return
    }
    setLoading(true)
    setError(null)
    try {
      const fetchPage = query ? 0 : page
      const fetchSize = query ? 9999 : PAGE_SIZE
      const respuestaPaginada = await libroService.obtenerTodosLosPrestamos(usuarioId, tipo, fetchPage, fetchSize)
      setTodosLosLibros(respuestaPaginada.content)
      if (!query) setTotalPaginasServidor(respuestaPaginada.totalPages)
    } catch (e: unknown) {
      setError(obtenerMensajeError(e))
    } finally {
      setLoading(false)
    }
  }

  if (tipoUsuario && tipoUsuario !== tipoAnterior) {
    setTipoAnterior(tipoUsuario)
    const nuevaTab = pestañas[0]?.id as TipoPrestamo
    setTodosLosLibros([])
    setActiveTab(nuevaTab)
    fetchTodosLosPrestamos(nuevaTab)
  }

  useOnInit(() => {
    const initialTab = pestañas[0]?.id as TipoPrestamo
    setActiveTab(initialTab)
    fetchTodosLosPrestamos()
  })

  const librosFiltrados = useMemo(() => {
    if (!usuarioId) return []
    const query = searchQuery.toLowerCase().trim()
    if (!query) return todosLosLibros
    return todosLosLibros.filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(query) ||
        libro.autor.toLowerCase().includes(query),
    )
  }, [todosLosLibros, searchQuery, usuarioId])

  const handleSearch = (query: string) => {
    setAnimating(true)
    setTimeout(() => {
      setSearchQuery(query)
      setCurrentPage(1)
      setAnimating(false)
    }, 150)
    fetchTodosLosPrestamos(activeTab, 0, query)
  }

  const handlePageChange = (page: number) => {
    setAnimating(true)
    setTimeout(() => {
      setCurrentPage(page)
      setAnimating(false)
    }, 150)
    // When no search is active, fetch the new page from the server
    if (!searchQuery) fetchTodosLosPrestamos(activeTab, page - 1, "")
  }

  const handleTabChange = (id: string) => {
    const nuevoTipo = id as TipoPrestamo
    setAnimating(true)
    setTimeout(() => {
      setActiveTab(nuevoTipo)
      setCurrentPage(1)
      setAnimating(false)
    }, 150)
    fetchTodosLosPrestamos(nuevoTipo)
  }

  // When searching: paginate the filtered results client-side.
  // When browsing: the server already sent us exactly one page.
  const totalPages = searchQuery
    ? Math.max(1, Math.ceil(librosFiltrados.length / PAGE_SIZE))
    : totalPaginasServidor
  const librosAMostrar = searchQuery
    ? librosFiltrados.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : librosFiltrados

  if (error) {
    const es401 = error.estado === 401
    return (
      <div className="px-6 md:px-10 pt-24 pb-16">
        <ErrorCard
          error={error}
          alReintentar={!es401 ? fetchTodosLosPrestamos : undefined}
          alVolver={es401 ? () => navigate("/login") : undefined}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero header ─── */}
      <div className="px-6 md:px-10 pt-24 pb-6 border-b border-accent/10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                Biblioteca
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-on-surface leading-tight">
              Mis Préstamos
            </h1>
            <p className="text-sm text-on-surface-variant/70 mt-2">
              Gestioná los intercambios y devoluciones de tu colección.
            </p>
          </div>
          <div className="w-full md:w-96">
            <SearchBar placeholder="Buscar por título o autor..." onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* ── Tabs + contenido ─── */}
      <div className="px-6 md:px-10 py-6">
        <Tabs
          pestañas={pestañas}
          idActivo={activeTab}
          alCambiar={handleTabChange}
          className="mb-8"
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-light" />
            <span className="text-on-surface-variant font-medium">Cargando tus libros...</span>
          </div>
        ) : librosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-xl border border-accent/20 bg-surface/50">
            <BookOpen size={40} className="text-on-surface-variant/20 mb-3" />
            <p className="text-on-surface-variant/50 text-sm font-medium">
              No se encontraron libros en esta categoría.
            </p>
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-stretch transition-all duration-150 ${
                animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              {librosAMostrar.map((libro) => (
                <LibroCard key={libro.id} libro={libro} tipoVista={activeTab} />
              ))}
            </div>
            <Paginacion
              pagina={currentPage}
              totalPaginas={totalPages}
              alCambiar={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}
