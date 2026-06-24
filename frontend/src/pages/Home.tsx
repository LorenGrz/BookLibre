import { useState } from "react"
import { authService } from "../services/AuthService.ts"
import { Paginacion } from "../components/ui/Paginacion"
import { Spinner } from "../components/ui/Spinner.tsx"
import { Filters } from "../components/home/Filters"
import type { HomeFiltersState } from "../models/homeFilters"
import { LibroCardHome } from "../components/home/LibroCardHome"
import { useOnInit } from "../utils/hooks.ts"
import { ErrorCard } from "../components/ui/ErrorCard"
import { BookOpen } from "lucide-react"
import { useHomeCatalog } from "../hooks/useHomeCatalog.ts"
import { useAdminHomeKpis } from "../hooks/useAdminHomeKpis.ts"
import { HomeHeader } from "../components/home/HomeHeader"
import { HomeToolbar } from "../components/home/HomeToolbar"
import { MobileFiltersDrawer } from "../components/home/MobileFiltersDrawer"

export const Home = () => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const userId = authService.obtenerIdUsuarioActual()
  const esAdmin = authService.obtenerTipoUsuarioActual()?.toUpperCase() === "ADMIN"
  const {
    books,
    currentPage,
    totalPaginas,
    sortBy,
    loading,
    error,
    animating,
    vistaPopulares,
    filters,
    hasActiveFilters,
    handleSearch,
    handleChangeFilters,
    handleApplyFilters: applyCatalogFilters,
    handlePageChange,
    handleSortChange,
    handleClearFilters,
    handleVerMas,
    handleVerPopulares,
    loadInitialCatalog,
    retrySearch,
  } = useHomeCatalog({ userId })
  const { adminKpis, loadingAdminKpis, errorAdminKpis, loadAdminKpis } = useAdminHomeKpis({ esAdmin })

  // Carga inicial de datos
  useOnInit(() => {
    loadInitialCatalog()
    loadAdminKpis()
  })

  const handleApplyFilters = (f: HomeFiltersState) => {
    applyCatalogFilters(f)
  }

  if (error) {
    return (
      <div className="px-6 md:px-10 pt-24 pb-16">
        <ErrorCard
          error={error}
          alReintentar={retrySearch}
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* ── Home header ─────────────────────────────────────── */}
      <HomeHeader
        esAdmin={esAdmin}
        adminKpis={adminKpis}
        loadingAdminKpis={loadingAdminKpis}
        errorAdminKpis={errorAdminKpis}
        onSearch={handleSearch}
      />

      {/* ── Cuerpo principal ────────────────────────────────── */}
      <div className="flex px-6 md:px-10 py-6 gap-6">

        {/* ── Sidebar filtros ─── */}
        <aside className="hidden lg:flex flex-col gap-0 w-64 shrink-0">
          <Filters
            filters={filters}
            onChangeFilters={handleChangeFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        {/* ── Contenido principal ─── */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Toolbar: filtros móvil + sort */}
          <HomeToolbar
            hasActiveFilters={hasActiveFilters}
            vistaPopulares={vistaPopulares}
            loading={loading}
            booksLength={books.length}
            currentPage={currentPage}
            totalPaginas={totalPaginas}
            sortBy={sortBy}
            onOpenFilters={() => setIsFiltersOpen(true)}
            onSortChange={handleSortChange}
            onViewPopular={handleVerPopulares}
          />

          {vistaPopulares && !loading && !error && (
            <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-primary/20 bg-surface/70 px-4 py-3">
              <div>
                <h2 className="text-sm font-bold text-on-surface">
                  Libros más populares
                </h2>
              </div>
              <button
                type="button"
                onClick={handleVerMas}
                className="self-start sm:self-auto px-4 py-2 rounded-lg bg-primary text-background text-xs font-bold hover:bg-primary-dark active:scale-95 transition-all cursor-pointer"
              >
                Ver más
              </button>
            </section>
          )}

          {/* Grid de libros */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-32">
              <Spinner />
            </div>
          ) : books.length === 0 ? (
            <div
              data-testid="empty-state"
              className="flex flex-col items-center justify-center py-32 rounded-xl border border-accent/20 bg-surface/50"
            >
              <BookOpen size={40} className="text-on-surface-variant/20 mb-3" />
              <p className="text-on-surface-variant/50 text-sm font-medium">
                No se encontraron libros.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                data-testid="libros-grid"
                className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 transition-all duration-200 ${
                  animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
              >
                {books.map((book) => (
                  <LibroCardHome key={book.id} {...book} destacado={vistaPopulares} />
                ))}
              </div>
              {!vistaPopulares && (
                <Paginacion
                  pagina={currentPage}
                  totalPaginas={totalPaginas}
                  alCambiar={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Drawer de filtros en móvil ─────────────────────── */}
      <MobileFiltersDrawer
        open={isFiltersOpen}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onClose={() => setIsFiltersOpen(false)}
        onChangeFilters={handleChangeFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </main>
  )
}
