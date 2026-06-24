import { useState } from "react"
import { ChevronDown, Hash, BookMarked, Calendar, FileText, SlidersHorizontal } from "lucide-react"
import {
  HOME_GENRES,
  normalizeNumberFilter,
  type HomeFiltersState,
} from "../../models/homeFilters"

type Props = {
  filters: HomeFiltersState
  onChangeFilters: (filters: HomeFiltersState) => void
  onApplyFilters: (filters: HomeFiltersState) => void
  onClearFilters?: () => void
  hasActiveFilters?: boolean
}

type SectionProps = {
  title: string
  icon: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
  badge?: number
}

const Section = ({ title, icon, defaultOpen = true, children, badge }: SectionProps) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-accent/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 text-left group"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-primary/70">{icon}</span>
          <span className="text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant group-hover:text-on-surface transition-colors">
            {title}
          </span>
          {badge !== undefined && badge > 0 && (
            <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] font-bold flex items-center justify-center">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={13}
          className={`text-on-surface-variant/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

const inputCls =
  "w-full bg-background/60 border border-accent/20 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/30"

export const Filters = ({ filters, onChangeFilters, onApplyFilters, onClearFilters, hasActiveFilters }: Props) => {
  const [errors, setErrors] = useState<{ paginas?: string; fechas?: string }>({})

  const updateFilter = <K extends keyof HomeFiltersState>(key: K, value: HomeFiltersState[K]) => {
    onChangeFilters({ ...filters, [key]: value })
    setErrors({})
  }

  const validar = (): boolean => {
    const e: { paginas?: string; fechas?: string } = {}
    if (filters.paginasMin && filters.paginasMax && filters.paginasMin >= filters.paginasMax)
      e.paginas = "El mínimo debe ser menor al máximo"
    if (filters.fechaDesde && filters.fechaHasta && filters.fechaDesde >= filters.fechaHasta)
      e.fechas = "La fecha de inicio debe ser anterior a la fecha final"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleApply = () => {
    if (validar()) onApplyFilters(filters)
  }

  const activeGenreCount = HOME_GENRES.filter((g) => filters[g.key]).length

  return (
    <div className="bg-surface border border-accent/15 rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-accent/10 bg-surface-high/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-primary" />
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface">Filtros</span>
        </div>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className={`text-[10px] font-semibold uppercase tracking-wider transition-all ${
              hasActiveFilters
                ? "text-primary hover:text-primary-light cursor-pointer"
                : "text-on-surface-variant/20 cursor-not-allowed"
            }`}
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="px-4 divide-y divide-accent/0">
        {/* Géneros */}
        <Section title="Género" icon={<BookMarked size={13} />} badge={activeGenreCount}>
          <div className="flex flex-wrap gap-2">
            {HOME_GENRES.map(({ key, label, emoji }) => {
              const checked = filters[key]
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => updateFilter(key, !checked)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border ${
                    checked
                      ? "bg-primary/15 border-primary/40 text-primary shadow-[0_0_12px_rgba(186,136,15,0.15)]"
                      : "bg-background/40 border-accent/20 text-on-surface-variant hover:border-accent/50 hover:text-on-surface"
                  }`}
                >
                  <span className="text-[11px]">{emoji}</span>
                  {label}
                </button>
              )
            })}
          </div>
        </Section>

        {/* Rango páginas */}
        <Section title="Páginas" icon={<FileText size={13} />} defaultOpen={false}>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              min={1}
              value={filters.paginasMin ?? ""}
              onChange={(e) => updateFilter("paginasMin", normalizeNumberFilter(e.target.value))}
              className={inputCls}
            />
            <span className="text-on-surface-variant/30 font-bold shrink-0">—</span>
            <input
              type="number"
              placeholder="Max"
              min={1}
              value={filters.paginasMax ?? ""}
              onChange={(e) => updateFilter("paginasMax", normalizeNumberFilter(e.target.value))}
              className={inputCls}
            />
          </div>
          {errors.paginas && (
            <p className="text-[10px] text-danger mt-2">{errors.paginas}</p>
          )}
        </Section>

        {/* Fechas */}
        <Section title="Disponible entre" icon={<Calendar size={13} />} defaultOpen={false}>
          <div className="flex flex-col gap-2.5">
            <div>
              <label className="block text-[10px] text-on-surface-variant/50 font-semibold mb-1 uppercase tracking-wider ml-0.5">
                Desde
              </label>
              <input
                type="date"
                value={filters.fechaDesde ?? ""}
                onChange={(e) => updateFilter("fechaDesde", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[10px] text-on-surface-variant/50 font-semibold mb-1 uppercase tracking-wider ml-0.5">
                Hasta
              </label>
              <input
                type="date"
                value={filters.fechaHasta ?? ""}
                onChange={(e) => updateFilter("fechaHasta", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          {errors.fechas && (
            <p className="text-[10px] text-danger mt-2">{errors.fechas}</p>
          )}
        </Section>

        {/* Detalles */}
        <Section title="Detalles" icon={<Hash size={13} />} defaultOpen={false}>
          <div className="flex flex-col gap-2.5">
            <input
              type="text"
              placeholder="ISBN"
              value={filters.isbn ?? ""}
              onChange={(e) => updateFilter("isbn", e.target.value)}
              className={inputCls}
            />
            <input
              type="text"
              placeholder="Prestado por usuario..."
              value={filters.prestadoPor ?? ""}
              onChange={(e) => updateFilter("prestadoPor", e.target.value)}
              className={inputCls}
            />
          </div>
        </Section>
      </div>

      {/* Aplicar */}
      <div className="px-4 py-4 bg-surface-high/30 border-t border-accent/10">
        <button
          onClick={handleApply}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-background font-bold text-xs py-3 rounded-lg active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(186,136,15,0.3)] cursor-pointer"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  )
}
