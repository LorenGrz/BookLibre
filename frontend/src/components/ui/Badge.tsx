export type VarianteBadge = 'exito' | 'advertencia' | 'neutral'

export type PropsBadge = {
  children: string
  variante?: VarianteBadge
  className?: string
}

const estilosPorVariante: Record<VarianteBadge, string> = {
  exito: 'bg-green-100 text-green-800',
  advertencia: 'bg-amber-100 text-amber-800',
  neutral: 'bg-secondary/20 text-secondary',
}

export function Badge({ children, variante = 'neutral', className = '' }: PropsBadge) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estilosPorVariante[variante]} ${className}`}
    >
      {children}
    </span>
  )
}

