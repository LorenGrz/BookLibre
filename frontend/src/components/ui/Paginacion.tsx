import { ChevronLeft, ChevronRight } from "lucide-react"

export type PropsPaginacion = {
  pagina: number
  totalPaginas: number
  alCambiar: (pagina: number) => void
  className?: string
}

/** Construye la secuencia de páginas con ellipsis inteligente.
 *  Siempre muestra primera, última y ventana de ±2 alrededor de la actual. */
const buildPages = (pagina: number, total: number): (number | "...")[] => {
  if (total <= 9) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const visible = new Set(
    [1, total, pagina - 2, pagina - 1, pagina, pagina + 1, pagina + 2].filter(
      (p) => p >= 1 && p <= total,
    ),
  )
  const sorted = Array.from(visible).sort((a, b) => a - b)

  const result: (number | "...")[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...")
    }
    result.push(sorted[i])
  }
  return result
}

export const Paginacion = ({
  pagina,
  totalPaginas,
  alCambiar,
  className = "",
}: PropsPaginacion) => {
  if (totalPaginas <= 1) return null

  const pages = buildPages(pagina, totalPaginas)

  return (
    <div className={`flex justify-center items-center gap-1.5 py-6 ${className}`}>
      <button
        type="button"
        disabled={pagina === 1}
        onClick={() => alCambiar(pagina - 1)}
        className="cursor-pointer w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary-light disabled:opacity-30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 h-8 flex items-center justify-center text-xs text-on-surface-variant/40 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => alCambiar(page)}
            className={`cursor-pointer w-8 h-8 flex items-center justify-center text-xs font-bold rounded transition-all ${
              pagina === page
                ? "bg-primary text-background shadow-[0_0_8px_rgba(247,189,72,0.3)]"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={pagina === totalPaginas}
        onClick={() => alCambiar(pagina + 1)}
        className="cursor-pointer w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary-light disabled:opacity-30 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
