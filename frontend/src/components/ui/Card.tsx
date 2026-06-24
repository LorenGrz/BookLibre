import type { ReactNode } from 'react'

export type PropsCard = {
  children: ReactNode
  className?: string
}

/** Contenedor premium consistente en toda la app */
export function Card({ children, className = '' }: PropsCard) {
  return (
    <div
      className={`rounded-xl border border-accent/15 bg-surface shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${className}`}
    >
      {children}
    </div>
  )
}

export type PropsCardHeader = {
  titulo: string
  icono?: ReactNode
  className?: string
}

export function CardHeader({ titulo, icono, className = '' }: PropsCardHeader) {
  return (
    <div className={`flex items-center gap-2 font-bold text-on-surface ${className}`}>
      {icono}
      <span>{titulo}</span>
    </div>
  )
}
