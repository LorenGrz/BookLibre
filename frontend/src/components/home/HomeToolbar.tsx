import { SlidersHorizontal, Trophy } from "lucide-react"
import { SortBy } from "./SortBy"

type HomeToolbarProps = {
  hasActiveFilters: boolean
  vistaPopulares: boolean
  loading: boolean
  booksLength: number
  currentPage: number
  totalPaginas: number
  sortBy: string
  onOpenFilters: () => void
  onSortChange: (sort: string) => void
  onViewPopular: () => void
}

export const HomeToolbar = ({
  hasActiveFilters,
  vistaPopulares,
  loading,
  booksLength,
  currentPage,
  totalPaginas,
  sortBy,
  onOpenFilters,
  onSortChange,
  onViewPopular,
}: HomeToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-3">
      {/* Botón filtros (móvil) */}
      <button
        type="button"
        onClick={onOpenFilters}
        className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
          hasActiveFilters
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-accent/30 bg-surface text-on-surface-variant hover:text-on-surface hover:border-accent/50"
        }`}
      >
        <SlidersHorizontal size={14} />
        Filtros
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </button>

      {/* Resultados count */}
      {!vistaPopulares && (
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-xs text-on-surface-variant/50">
            {loading ? "Buscando..." : `${booksLength} resultado${booksLength !== 1 ? "s" : ""} · Pág. ${currentPage}/${totalPaginas}`}
          </span>
          <button
            type="button"
            onClick={onViewPopular}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/40 bg-primary/10 text-primary-light text-xs font-bold hover:border-primary/70 hover:bg-primary/15 active:scale-95 transition-all cursor-pointer"
          >
            <Trophy size={14} />
            Ver populares
          </button>
        </div>
      )}

      <SortBy value={sortBy} onChange={onSortChange} />
    </div>
  )
}
