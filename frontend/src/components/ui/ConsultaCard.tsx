import { ChevronDown, ChevronUp } from "lucide-react"
import { useState, type ReactNode } from "react"

interface ConsultaCardProps<T> {
    titulo: string
    descripcion?: string
    loading: boolean
    error?: string
    onConsultar: () => void
    resultados: T[]
    renderResultado: (item: T) => ReactNode
    children?: ReactNode
    mensajeVacio?: string
}

export const ConsultaCard = <T,>({
    titulo,
    descripcion,
    loading,
    error,
    onConsultar,
    resultados,
    renderResultado,
    children,
    mensajeVacio,
}: ConsultaCardProps<T>) => {
    const [expandida, setExpandida] = useState(false)

    return (
        <section className={"bg-surface rounded border border-accent/15 shadow-[0_8px_24px_rgba(0, 0, 0, 0.3)] p-5"}>
        < div className = "flex items-start justify-between gap-4" >
                <div>
                    <h2 className="text-lg font-bold text-on-surface">
                        {titulo}
                    </h2>
                    {descripcion && (
                        <p className="text-sm text-on-surface-variant mt-1">
                            {descripcion}
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setExpandida((prev) => !prev)}
                    className="p-2 rounded-lg border border-accent/20 hover:bg-background transition-colors">
                    {expandida ? (
                        <ChevronUp size={18} />
                    ) : (
                        <ChevronDown size={18} />
                    )}
                </button>
            </div >

    <div
        className={`transition-all duration-300 overflow-hidden flex flex-col gap-4 ${expandida
            ? "max-h-[1000px] opacity-100 mt-5"
            : "max-h-0 opacity-0"}`}>
        {children}
        <div>
            <button
                onClick={onConsultar}
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-primary-light text-background font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
                {loading ? "Consultando..." : "Consultar"}
            </button>
        </div>
        {error && (
            <div className="text-sm text-red-400">
                {error}
            </div>
        )}
        <div className="border border-accent/15 rounded-xl overflow-hidden flex-1 bg-background/30">

            <div className="h-64 overflow-y-auto">

                {resultados.length === 0 && !loading ? (
                    <div className="h-full flex items-center justify-center text-sm text-on-surface-variant">
                        {mensajeVacio || "No hay resultados para mostrar."}
                    </div>
                ) : (
                    resultados.map((resultado, index) => (
                        <div
                            key={index}
                            className="p-4 border-b border-accent/10 last:border-b-0"
                        >
                            {renderResultado(resultado)}
                        </div>
                    ))
                )}

            </div>
        </div>
    </div>

        </section >
    )
}