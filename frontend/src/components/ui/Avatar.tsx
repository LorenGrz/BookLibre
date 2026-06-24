export type PropsAvatar = {
  src?: string | null
  alt?: string
  tamaño?: 'chico' | 'mediano' | 'grande'
  className?: string
}

const clasesPorTamaño = {
  chico: 'w-8 h-8',
  mediano: 'w-12 h-12',
  grande: 'w-24 h-24',
}

const clasesTextoInicial = {
  chico: 'text-sm',
  mediano: 'text-lg',
  grande: 'text-4xl',
}

function inicialDesdeEtiqueta(etiqueta: string): string {
  const t = etiqueta.trim()
  if (!t) return '?'
  return t.charAt(0).toUpperCase()
}

export function Avatar({ src, alt = '', tamaño = 'mediano', className = '' }: PropsAvatar) {
  const claseTamaño = clasesPorTamaño[tamaño]
  const claseTexto = clasesTextoInicial[tamaño]

  return (
    <div
      className={`${claseTamaño} rounded-full overflow-hidden flex items-center justify-center shrink-0 ${
        src
          ? 'bg-secondary/20'
          : 'border border-primary/30 bg-surface-high text-primary-light font-bold'
      } ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className={claseTexto} aria-hidden>
          {inicialDesdeEtiqueta(alt)}
        </span>
      )}
    </div>
  )
}

