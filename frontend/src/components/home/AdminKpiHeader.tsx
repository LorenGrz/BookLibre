import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { Activity, BookOpen, Star, TrendingUp } from "lucide-react"
import type { AdminKpiResumenResponse } from "../../models/libroModel"
import { TIPO_LABEL } from "../../models/libroModel"

type AdminKpiHeaderProps = {
  resumen: AdminKpiResumenResponse | null
  loading: boolean
  error: string
}

type KpiCardProps = {
  icon: ReactNode
  label: string
  value: string
  helper: string
}

const formatClicks = (clicks: number | undefined) => `${clicks ?? 0} clicks`

const KpiCard = ({ icon, label, value, helper }: KpiCardProps) => (
  <article className="min-h-28 rounded-lg border border-accent/10 bg-surface px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.18)]">
    <div className="flex h-full items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-on-surface-variant/50">
          {label}
        </p>
        <p className="mt-2 truncate text-2xl font-bold text-on-surface">{value}</p>
        <p className="mt-1 truncate text-xs font-medium text-on-surface-variant/60">
          {helper}
        </p>
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary">
        {icon}
      </div>
    </div>
  </article>
)

export function AdminKpiHeader({ resumen, loading, error }: AdminKpiHeaderProps) {
  const topClickeado = resumen?.libroMasClickeado
  const mejorTipo = resumen?.mejorTipoCalificado
  const mejorTipoLabel = mejorTipo?.tipoLibro
    ? TIPO_LABEL[mejorTipo.tipoLibro] ?? mejorTipo.tipoLibro
    : "Sin reseñas"

  const cards: KpiCardProps[] = [
    {
      icon: <TrendingUp size={17} />,
      label: "Conversión promedio",
      value: loading
        ? "..."
        : `${(((resumen?.conversionPromedio ?? 0) * 100)).toFixed(1)}%`,
      helper: "Top 5 por clicks",
    },
    {
      icon: <BookOpen size={17} />,
      label: "Top clickeado",
      value: loading ? "..." : topClickeado?.titulo || "Sin clicks",
      helper: loading ? "Calculando" : formatClicks(topClickeado?.clicks),
    },
    {
      icon: <Star size={17} />,
      label: "Mejor tipo",
      value: loading ? "..." : mejorTipoLabel,
      helper:
        !loading && mejorTipo?.promedioCalificacion !== undefined
          ? mejorTipo.promedioCalificacion.toFixed(2)
          : "Promedio por tipo",
    },
    {
      icon: <Activity size={17} />,
      label: "Tipos evaluados",
      value: loading ? "..." : String(resumen?.tiposEvaluados ?? 0),
      helper: "Con libros calificados",
    },
  ]

  return (
    <section
      data-testid="admin-kpi-header"
      className="rounded-xl border border-accent/10 bg-surface-high/40 px-4 py-4 md:px-5"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-serif font-bold leading-tight text-on-surface">
            KPIs administrador
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant/70">
            Resumen GraphQL del catálogo y actividad reciente.
          </p>
          {error && (
            <p
              data-testid="admin-kpi-error"
              className="mt-2 text-xs font-semibold text-danger"
            >
              {error}
            </p>
          )}
        </div>
        <Link
          to="/consultas"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 px-3 text-xs font-bold text-primary transition-colors hover:border-primary/60 hover:bg-primary/10"
        >
          Ver detalle
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>
    </section>
  )
}
