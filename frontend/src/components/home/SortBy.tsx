import { ArrowUpDown } from "lucide-react"

type SortByProps = {
  value: string
  onChange: (value: string) => void
}

const SORT_OPTIONS = [
  { value: "titulo",  label: "Título" },
  { value: "autor",   label: "Autor" },
  { value: "duenio",  label: "Usuario" },
]

export const SortBy = ({ value, onChange }: SortByProps) => {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={13} className="text-on-surface-variant/50 shrink-0" />
      <span className="text-[11px] font-semibold text-on-surface-variant/60 hidden sm:block">
        Ordenar:
      </span>
      <div className="relative">
        <select
          data-testid="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-surface border border-accent/20 rounded-lg pl-3 pr-7 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer hover:border-accent/40"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface text-on-surface">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant/50">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}