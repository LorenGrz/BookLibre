import { BookOpen } from "lucide-react"
import { SearchBar } from "../ui/SearchBar"
import { AdminKpiHeader } from "./AdminKpiHeader"
import type { AdminKpiResumenResponse } from "../../models/libroModel"

type HomeHeaderProps = {
  esAdmin: boolean
  adminKpis: AdminKpiResumenResponse | null
  loadingAdminKpis: boolean
  errorAdminKpis: string
  onSearch: (query: string) => void
}

export const HomeHeader = ({
  esAdmin,
  adminKpis,
  loadingAdminKpis,
  errorAdminKpis,
  onSearch,
}: HomeHeaderProps) => {
  return (
    <div className="px-6 md:px-10 pt-24 pb-6 border-b border-accent/10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
              Catálogo
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-on-surface leading-tight">
            Encuentra tu próxima<br className="hidden md:block" /> lectura
          </h1>
          <p className="text-sm text-on-surface-variant/70 mt-2">
            Explorá libros disponibles para préstamo en nuestra comunidad.
          </p>
        </div>

        {/* Buscador en header (desktop) */}
        <div className="w-full md:w-96">
          <SearchBar onSearch={onSearch} placeholder="Buscar por título..." />
        </div>
      </div>

      {esAdmin && (
        <div className="mt-6">
          <AdminKpiHeader
            resumen={adminKpis}
            loading={loadingAdminKpis}
            error={errorAdminKpis}
          />
        </div>
      )}
    </div>
  )
}
