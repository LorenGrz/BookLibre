import type { ReactNode } from 'react'

export type DetalleFilaProps = {
  children: ReactNode
}

export const DetalleFila = ({ children }: DetalleFilaProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 w-full">
      {children}
    </div>
  )
}

export type DetalleItemProps = {
  label: string
  children: ReactNode
  colSpan?: string
}

export const DetalleItem = ({ label, children, colSpan = "" }: DetalleItemProps) => {
  return (
    <div className={`flex flex-col gap-1.5 ${colSpan}`}>
      <p className="text-xs font-bold text-secondary-light uppercase tracking-wider opacity-70">
        {label}
      </p>
      <div className="font-semibold text-secondary-dark text-sm md:text-base">
        {children}
      </div>
    </div>
  )
}