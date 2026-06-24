import "@testing-library/jest-dom"
import { describe, it, expect} from 'vitest'
import { Libro } from "../classes/Libro"
import type { PrestamoDTO, LibroDTO } from "../models/libroModel"

const hoy = new Date()
hoy.setHours(0, 0, 0, 0)

const formatDate = (date: Date) => date.toISOString().split("T")[0]

const ayer = new Date(hoy)
ayer.setDate(hoy.getDate() - 1)

const manana = new Date(hoy)
manana.setDate(hoy.getDate() + 1)

const en5Dias = new Date(hoy)
en5Dias.setDate(hoy.getDate() + 5)

const hace5Dias = new Date(hoy)
hace5Dias.setDate(hoy.getDate() - 5)

const prestamoBase: PrestamoDTO = {
  id: 1,
  titulo: "1984",
  autor: "George Orwell",
  estado: "EXCELENTE",
  propietarioId: 3,
  propietarioNombre: "Ana",
  imagenUrl: "",
  alquiladoPorId: 1,
  alquiladoPorNombre: "Juan",
  fechaDesde: formatDate(hace5Dias),
  fechaHasta: formatDate(en5Dias),
  rating: 0,
  bibliokarma: 1550,
  disponibilidad: "RESERVADO",
  disponible: false,
  libroActivo: true,
}

describe("Libro - fromPrestamoJson", () => {
  it("mapea correctamente los campos del PrestamoDTO", () => {
    const libro = Libro.fromPrestamoJson(prestamoBase)
    expect(libro.id).toBe(1)
    expect(libro.titulo).toBe("1984")
    expect(libro.autor).toBe("George Orwell")
    expect(libro.propietarioId).toBe(3)
    expect(libro.alquiladoPorId).toBe(1)
    expect(libro.rating).toBe(0)
    expect(libro.bibliokarma).toBe(1550)
    expect(libro.fechaHasta).toBe(formatDate(en5Dias))
  })
})

describe("Libro - fromJson", () => {
  it("mapea correctamente los campos del LibroDTO", () => {
    const dto: LibroDTO = {
      id: 2,
      titulo: "Clean Code",
      autor: "Robert C. Martin",
      estado: "MUY_BUENO",
      propietarioId: 1,
      imagenUrl: "",
      tipo: "Comun",
      descripcion: "Buenas prácticas",
      genero: "DISENO",
      paginas: 464,
      isbn: "ISBN-001",
      idioma: "INGLES",
      editorial: "Prentice Hall",
      fechaPublicacion: "2008-08-01",
      bibliokarma: 1000,
      estoyReservado: false,
      reservas: [],
      fechaAgregado: "",
      ultimasCalificaciones: []
    }
    const libro = Libro.fromJson(dto)
    expect(libro.id).toBe(2)
    expect(libro.titulo).toBe("Clean Code")
    expect(libro.paginas).toBe(464)
  })
})
describe("Libro - estaDevuelto()", () => {
  it("retorna false si fechaHasta es undefined", () => {
    const libro = Libro.fromPrestamoJson({ ...prestamoBase, fechaHasta: null })
    expect(libro.estaDevuelto()).toBe(false)
  })

  it("retorna true si fechaHasta es ayer", () => {
    const libro = Libro.fromPrestamoJson({ ...prestamoBase, fechaHasta: formatDate(ayer) })
    expect(libro.estaDevuelto()).toBe(true)
  })

  it("retorna false si fechaHasta es mañana", () => {
    const libro = Libro.fromPrestamoJson({ ...prestamoBase, fechaHasta: formatDate(manana) })
    expect(libro.estaDevuelto()).toBe(false)
  })

  it("retorna true si fechaHasta es hoy", () => {
    const libro = Libro.fromPrestamoJson({ ...prestamoBase, fechaHasta: formatDate(hoy) })
    expect(libro.estaDevuelto()).toBe(true)
  })
})

describe("Libro - estaProximoAVencer()", () => {
  it("retorna true si faltan exactamente 3 días", () => {
    const en3Dias = new Date(hoy); en3Dias.setDate(hoy.getDate() + 3)
    const libro = Libro.fromPrestamoJson({ ...prestamoBase, fechaHasta: formatDate(en3Dias) })
    expect(libro.estaProximoAVencer()).toBe(true)
  })

  it("retorna false si vence hoy", () => {
    const libro = Libro.fromPrestamoJson({ ...prestamoBase, fechaHasta: formatDate(hoy) })
    expect(libro.estaProximoAVencer()).toBe(false)
  })

  it("retorna false si ya fue devuelto", () => {
    const libro = Libro.fromPrestamoJson({ ...prestamoBase, fechaHasta: formatDate(ayer) })
    expect(libro.estaProximoAVencer()).toBe(false)
  })

  it("retorna false si faltan más de 3 días", () => {
    const libro = Libro.fromPrestamoJson({ ...prestamoBase, fechaHasta: formatDate(en5Dias) })
    expect(libro.estaProximoAVencer()).toBe(false)
  })

  it("retorna false si no tiene fechaHasta", () => {
    const libro = Libro.fromPrestamoJson({ ...prestamoBase, fechaHasta: null })
    expect(libro.estaProximoAVencer()).toBe(false)
  })
})

describe("Libro - calcularBibliokarma()", () => {
  it("retorna 0 si faltan fechas", () => {
    const libro = new Libro({ id: 1, tipo: "Comun", paginas: 300, reservas: [], ultimasCalificaciones: [] })
    expect(libro.calcularBibliokarma("", "", 500)).toBe(0)
  })

  it("calcula correctamente para LibroComun con karma < 1000", () => {
    // base = 5 * 10 días = 50; plus = 300 * 5 = 1500; total = 1550
    const libro = new Libro({ tipo: "Comun", paginas: 300, reservas: [], ultimasCalificaciones: [] })
    expect(libro.calcularBibliokarma("2026-03-01", "2026-03-10", 500)).toBe(1550)
  })

  it("calcula correctamente para LibroComun con karma >= 1000", () => {
    // base = 5 * 10 = 50; plus = 300 * 2 = 600; total = 650
    const libro = new Libro({ tipo: "Comun", paginas: 300, reservas: [], ultimasCalificaciones: [] })
    expect(libro.calcularBibliokarma("2026-03-01", "2026-03-10", 1000)).toBe(650)
  })

  it("calcula correctamente para LibroConDedicatoria sin reservas previas", () => {
    // base = 5 * 10 = 50; plus = 200 + (10 * 0) = 200; total = 250
    const libro = new Libro({ tipo: "ConDedicatoria", cantidadReservas: 0, reservas: [], ultimasCalificaciones: [] })
    expect(libro.calcularBibliokarma("2026-03-01", "2026-03-10", 0)).toBe(250)
  })

  it("calcula correctamente para LibroColeccionable", () => {
    // base = 5 * 10 = 50; plus = ceil(2000/5) + 500 = 400 + 500 = 900; total = 950
    const libro = new Libro({ tipo: "Coleccionable", paginas: 500, reservas: [], ultimasCalificaciones: [] })
    expect(libro.calcularBibliokarma("2026-03-01", "2026-03-10", 2000)).toBe(950)
  })

  it("retorna 0 si fechaHasta es anterior a fechaDesde", () => {
    const libro = new Libro({ tipo: "Comun", paginas: 300, reservas: [], ultimasCalificaciones: [] })
    expect(libro.calcularBibliokarma("2026-03-10", "2026-03-01", 500)).toBe(0)
  })
})
