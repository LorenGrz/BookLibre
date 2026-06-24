export type Pestaña = {
  id: string
  etiqueta: string
}

export type PropsTabs = {
  pestañas: Pestaña[]
  idActivo: string
  alCambiar: (id: string) => void
  className?: string
}

export function Tabs({
  pestañas,
  idActivo,
  alCambiar,
  className = "",
}: PropsTabs) {
  return (
    <div className={`flex gap-8 border-b border-accent/20 ${className}`}>
      {pestañas.map((pestaña) => (
        <button
          key={pestaña.id}
          type="button"
          onClick={() => alCambiar(pestaña.id)}
          className={`pb-4 px-2 text-sm font-bold tracking-wide transition-colors cursor-pointer ${
            idActivo === pestaña.id
              ? "text-primary-light border-b-2 border-primary-light"
              : "text-on-surface-variant hover:text-on-surface border-transparent"
          }`}
        >
          {pestaña.etiqueta}
        </button>
      ))}
    </div>
  )
}
