import type { LibroAgregadoResponse, ReservaConfirmadaResponse } from "../../models/libroModel"

export const LibroAgregadoItem = ({ item }: { item: LibroAgregadoResponse }) => (
    <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-center w-full">
            <span className="font-semibold">📚 {item.titulo}</span>
            <span className="text-xs text-on-surface-variant">
                {new Date(item.fecha).toLocaleString("es-AR")}
            </span>
        </div>
        <div className="flex gap-2 text-xs text-on-surface-variant">
            <span>{item.autor}</span>
            <span>·</span>
            <span>Dueño: {item.duenioNombre}</span>
        </div>
    </div>
)

export const ReservaConfirmadaItem = ({ item }: { item: ReservaConfirmadaResponse }) => (
    <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-center w-full">
            <span className="font-semibold">📅 {item.libroTitulo}</span>
            <span className="text-xs text-on-surface-variant">
                {new Date(item.fecha).toLocaleString("es-AR")}
            </span>
        </div>
        <div className="text-xs text-on-surface-variant">
            Reservado por: {item.usuarioNombre}
        </div>
    </div>
)
