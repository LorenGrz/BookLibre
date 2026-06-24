import type { ButtonHTMLAttributes, ReactNode } from "react"

export type VarianteBoton =
  | "primario"
  | "secundario"
  | "gris"
  | "outline"
  | "ghost"

export type PropsBoton = {
  tipo?: VarianteBoton
  children?: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  deshabilitado?: boolean
  className?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
  "data-testid"?: string
}

const estilosPorVariante: Record<VarianteBoton, string> = {
  primario: "bg-primary text-white hover:bg-primary-dark border-transparent",
  secundario: "bg-surface border border-secondary text-secondary hover:bg-secondary/10",
  gris: "bg-secondary/20 text-secondary hover:bg-secondary/30",
  outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/10",
  ghost: "text-secondary hover:bg-secondary/10",
}

export function Boton({
  tipo = "primario",
  children,
  onClick,
  deshabilitado = false,
  className = "",
  type = "button",
  "data-testid": idPrueba = "boton",
}: PropsBoton) {
  
  const clasesBase = "inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold transition-colors transition-transform active:scale-[0.98]"
  const clasesEstado = deshabilitado 
    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70" 
    : `${estilosPorVariante[tipo]} cursor-pointer`

  return (
    <button
      type={type}
      className={`${clasesBase} ${clasesEstado} ${className}`}
      onClick={onClick}
      disabled={deshabilitado} // Esto bloquea el evento nativo del navegador
      data-testid={idPrueba}
    >
      {children}
    </button>
  )
}