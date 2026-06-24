import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { LibroAgregadoItem, ReservaConfirmadaItem } from "../../components/ui/FeedActividadItem"
import type { LibroAgregadoResponse, ReservaConfirmadaResponse } from "../../models/libroModel"

describe("FeedActividadItem", () => {
    it("renderiza correctamente un LibroAgregadoItem", () => {
        const item: LibroAgregadoResponse = {
            __typename: "LibroAgregado",
            tipoEvento: "LIBRO_AGREGADO",
            fecha: "2026-06-15T10:30:00",
            libroId: 1,
            titulo: "El Aleph",
            autor: "Jorge Luis Borges",
            duenioNombre: "Juan",
        }

        render(<LibroAgregadoItem item={item} />)

        // Verifica titulo y autor
        expect(screen.getByText("📚 El Aleph")).toBeInTheDocument()
        expect(screen.getByText("Jorge Luis Borges")).toBeInTheDocument()
        // Verifica dueño
        expect(screen.getByText("Dueño: Juan")).toBeInTheDocument()
        // Verifica fecha parseada
        const dateString = new Date(item.fecha).toLocaleString("es-AR")
        expect(screen.getByText(dateString)).toBeInTheDocument()
    })

    it("renderiza correctamente un ReservaConfirmadaItem", () => {
        const item: ReservaConfirmadaResponse = {
            __typename: "ReservaConfirmada",
            tipoEvento: "RESERVA_CONFIRMADA",
            fecha: "2026-06-14T09:15:00",
            reservaId: 10,
            libroId: 2,
            libroTitulo: "Ficciones",
            usuarioId: 3,
            usuarioNombre: "Maria",
        }

        render(<ReservaConfirmadaItem item={item} />)

        // Verifica titulo
        expect(screen.getByText("📅 Ficciones")).toBeInTheDocument()
        // Verifica usuario que reservo
        expect(screen.getByText("Reservado por: Maria")).toBeInTheDocument()
        // Verifica fecha parseada
        const dateString = new Date(item.fecha).toLocaleString("es-AR")
        expect(screen.getByText(dateString)).toBeInTheDocument()
    })
})
