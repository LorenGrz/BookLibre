export type PropsEstadisticaCard = {
  valor: number
  etiqueta: string
  icono?: string
  valorClassName?: string
  className?: string
  etiquetaClassName?: string
}

export const EstadisticaCard = ({
  valor,
  etiqueta,
  icono,
  valorClassName,
  className,
  etiquetaClassName,
}: PropsEstadisticaCard) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center bg-surface rounded-xl border border-accent/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)] p-5 gap-1 transition-transform duration-300 hover:-translate-y-1 ${className ?? ""}`}
    >
      {icono && <span className="text-xl mb-1">{icono}</span>}
      <span
        className={`text-4xl font-black text-primary-light leading-none tabular-nums ${valorClassName ?? ""}`}
      >
        {valor}
      </span>
      <span
        className={`text-[9px] font-bold text-on-surface-variant/50 tracking-widest uppercase mt-1 ${etiquetaClassName ?? ""}`}
      >
        {etiqueta}
      </span>
    </div>
  )
}
