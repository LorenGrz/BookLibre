import { SlidersHorizontal, X } from "lucide-react"
import { Filters } from "./Filters"
import type { HomeFiltersState } from "../../models/homeFilters"

type MobileFiltersDrawerProps = {
  open: boolean
  filters: HomeFiltersState
  hasActiveFilters: boolean
  onClose: () => void
  onChangeFilters: (filters: HomeFiltersState) => void
  onApplyFilters: (filters: HomeFiltersState) => void
  onClearFilters: () => void
}

export const MobileFiltersDrawer = ({
  open,
  filters,
  hasActiveFilters,
  onClose,
  onChangeFilters,
  onApplyFilters,
  onClearFilters,
}: MobileFiltersDrawerProps) => {
  if (!open) return null

  const handleApplyFilters = (nextFilters: HomeFiltersState) => {
    onApplyFilters(nextFilters)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* panel */}
      <div className="relative ml-auto h-full w-80 bg-surface shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-accent/15">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-primary" />
            <span className="font-bold text-sm text-on-surface">Filtros</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <Filters
            filters={filters}
            onChangeFilters={onChangeFilters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>
    </div>
  )
}
