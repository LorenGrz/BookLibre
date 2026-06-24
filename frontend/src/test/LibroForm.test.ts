import { describe, it, expect } from "vitest"
import { LibroForm } from "../classes/LibroForm"
import { Libro } from "../classes/Libro"
import type {
  EstadoLibro,
  Genero,
  Idioma,
  TipoLibro,
} from "../models/libroModel"

function libroFormValido(): LibroForm {
  const form = new LibroForm()
  form.titulo = "Clean Code"
  form.autor = "Robert C. Martin"
  form.descripcion = "Buenas prácticas de programación"
  form.tipo = "Comun"
  form.genero = "DISENO"
  form.paginas = 464
  form.isbn = "9780132350884"
  form.idioma = "INGLES"
  form.estado = "EXCELENTE"
  form.fechaPublicacion = new Date("2008-08-01")
  form.propietarioId = 1
  form.editorial = "Prentice Hall"
  return form
}

function libroBase(): Libro {
  return new Libro({
    id: 10,
    titulo: "Refactoring",
    autor: "Martin Fowler",
    descripcion: "Improving the Design of Existing Code",
    tipo: "Comun" as TipoLibro,
    genero: "DISENO" as Genero,
    paginas: 448,
    isbn: "9780201485677",
    idioma: "INGLES" as Idioma,
    estado: "MUY_BUENO" as EstadoLibro,
    fechaPublicacion: "2018-11-20",
    propietarioId: 5,
    imagenUrl: "https://example.com/cover.jpg",
    rating: 4,
    editorial: "Addison-Wesley",
  })
}

describe("LibroForm — validate()", () => {
  describe("formulario completamente válido", () => {
    it("no retorna errores cuando todos los campos son correctos", () => {
      const form = libroFormValido()
      const errors = form.validate()
      expect(Object.values(errors).every((v) => v === undefined)).toBe(true)
    })

    it("isValid() retorna true con datos completos", () => {
      expect(libroFormValido().isValid()).toBe(true)
    })
  })

  describe("validación de título", () => {
    it("retorna error si el título está vacío", () => {
      const form = libroFormValido()
      form.titulo = ""
      expect(form.validate().titulo).toBe("El título es obligatorio")
    })

    it("retorna error si el título contiene solo espacios", () => {
      const form = libroFormValido()
      form.titulo = "   "
      expect(form.validate().titulo).toBe("El título es obligatorio")
    })

    it("no retorna error con un título válido", () => {
      const form = libroFormValido()
      expect(form.validate().titulo).toBeUndefined()
    })
  })

  describe("validación de autor", () => {
    it("retorna error si el autor está vacío", () => {
      const form = libroFormValido()
      form.autor = ""
      expect(form.validate().autor).toBe("El autor es obligatorio")
    })

    it("retorna error si el autor contiene solo espacios", () => {
      const form = libroFormValido()
      form.autor = "   "
      expect(form.validate().autor).toBe("El autor es obligatorio")
    })

    it("no retorna error con un autor válido", () => {
      const form = libroFormValido()
      expect(form.validate().autor).toBeUndefined()
    })
  })

  describe("validación de descripción", () => {
    it("retorna error si la descripción está vacía", () => {
      const form = libroFormValido()
      form.descripcion = ""
      expect(form.validate().descripcion).toBe("La descripción es obligatoria")
    })

    it("no retorna error con una descripción válida", () => {
      const form = libroFormValido()
      expect(form.validate().descripcion).toBeUndefined()
    })
  })

  describe("validación de tipo", () => {
    it("retorna error si el tipo está vacío", () => {
      const form = libroFormValido()
      form.tipo = ""
      expect(form.validate().tipo).toBe("El tipo es obligatorio")
    })

    it("no retorna error con tipo Comun", () => {
      const form = libroFormValido()
      form.tipo = "Comun"
      expect(form.validate().tipo).toBeUndefined()
    })

    it("no retorna error con tipo ConDedicatoria", () => {
      const form = libroFormValido()
      form.tipo = "ConDedicatoria"
      expect(form.validate().tipo).toBeUndefined()
    })

    it("no retorna error con tipo Coleccionable", () => {
      const form = libroFormValido()
      form.tipo = "Coleccionable"
      expect(form.validate().tipo).toBeUndefined()
    })
  })

  describe("validación de género", () => {
    it("retorna error si el género está vacío", () => {
      const form = libroFormValido()
      form.genero = ""
      expect(form.validate().genero).toBe("El género es obligatorio")
    })

    it("no retorna error con un género válido", () => {
      const form = libroFormValido()
      form.genero = "DRAMA"
      expect(form.validate().genero).toBeUndefined()
    })
  })

  describe("validación de páginas", () => {
    it("retorna error si las páginas están vacías", () => {
      const form = libroFormValido()
      form.paginas = ""
      expect(form.validate().paginas).toBe(
        "Ingresá una cantidad de páginas válida",
      )
    })

    it("retorna error si las páginas son 0", () => {
      const form = libroFormValido()
      form.paginas = 0
      expect(form.validate().paginas).toBe(
        "Ingresá una cantidad de páginas válida",
      )
    })

    it("retorna error si las páginas son negativas", () => {
      const form = libroFormValido()
      form.paginas = -10
      expect(form.validate().paginas).toBe(
        "Ingresá una cantidad de páginas válida",
      )
    })

    it("no retorna error con 1 página", () => {
      const form = libroFormValido()
      form.paginas = 1
      expect(form.validate().paginas).toBeUndefined()
    })

    it("no retorna error con un número grande de páginas", () => {
      const form = libroFormValido()
      form.paginas = 9999
      expect(form.validate().paginas).toBeUndefined()
    })
  })

  describe("validación de ISBN", () => {
    it("retorna error si el ISBN está vacío", () => {
      const form = libroFormValido()
      form.isbn = ""
      expect(form.validate().isbn).toBe(
        "El ISBN debe tener exactamente 13 dígitos",
      )
    })

    it("retorna error si el ISBN contiene solo espacios", () => {
      const form = libroFormValido()
      form.isbn = "   "
      expect(form.validate().isbn).toBe(
        "El ISBN debe tener exactamente 13 dígitos",
      )
    })

    it("no retorna error con un ISBN válido", () => {
      const form = libroFormValido()
      expect(form.validate().isbn).toBeUndefined()
    })
  })

  describe("validación de idioma", () => {
    it("retorna error si el idioma está vacío", () => {
      const form = libroFormValido()
      form.idioma = ""
      expect(form.validate().idioma).toBe("El idioma es obligatorio")
    })

    it("no retorna error con un idioma válido", () => {
      const form = libroFormValido()
      form.idioma = "INGLES"
      expect(form.validate().idioma).toBeUndefined()
    })
  })

  describe("validación de estado", () => {
    it("retorna error si el estado está vacío", () => {
      const form = libroFormValido()
      form.estado = ""
      expect(form.validate().estado).toBe("El estado es obligatorio")
    })

    it("no retorna error con estado EXCELENTE", () => {
      const form = libroFormValido()
      form.estado = "EXCELENTE"
      expect(form.validate().estado).toBeUndefined()
    })

    it("no retorna error con estado MALO", () => {
      const form = libroFormValido()
      form.estado = "MALO"
      expect(form.validate().estado).toBeUndefined()
    })
  })

  describe("validación de fecha de publicación", () => {
    it("retorna error si la fecha de publicación está vacía", () => {
      const form = libroFormValido()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.fechaPublicacion = "" as any
      expect(form.validate().fechaPublicacion).toBe(
        "La fecha de publicación es obligatoria",
      )
    })

    it("no retorna error con una fecha válida", () => {
      const form = libroFormValido()
      expect(form.validate().fechaPublicacion).toBeUndefined()
    })
  })

  describe("múltiples errores simultáneos", () => {
    it("retorna todos los errores cuando el formulario está completamente vacío", () => {
      const form = new LibroForm()
      const errors = form.validate()
      expect(errors.titulo).toBeDefined()
      expect(errors.autor).toBeDefined()
      expect(errors.descripcion).toBeDefined()
      expect(errors.tipo).toBeDefined()
      expect(errors.genero).toBeDefined()
      expect(errors.paginas).toBeDefined()
      expect(errors.isbn).toBeDefined()
      expect(errors.idioma).toBeDefined()
      expect(errors.estado).toBeDefined()
      expect(errors.fechaPublicacion).toBeDefined()
    })

    it("isValid() retorna false cuando hay al menos un error", () => {
      const form = libroFormValido()
      form.titulo = ""
      expect(form.isValid()).toBe(false)
    })
  })
})

describe("LibroForm — fromLibro()", () => {
  it("mapea el título correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.titulo).toBe("Refactoring")
  })

  it("mapea el autor correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.autor).toBe("Martin Fowler")
  })

  it("mapea la descripción correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.descripcion).toBe("Improving the Design of Existing Code")
  })

  it("mapea el tipo correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.tipo).toBe("Comun")
  })

  it("mapea el género correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.genero).toBe("DISENO")
  })

  it("mapea las páginas correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.paginas).toBe(448)
  })

  it("mapea el ISBN correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.isbn).toBe("9780201485677")
  })

  it("mapea el idioma correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.idioma).toBe("INGLES")
  })

  it("mapea el estado correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.estado).toBe("MUY_BUENO")
  })

  it("mapea la fecha de publicación correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.fechaPublicacion).toBeInstanceOf(Date)
    expect(form.fechaPublicacion?.toISOString().split("T")[0]).toBe(
      "2018-11-20",
    )
  })

  it("mapea el propietarioId correctamente", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.propietarioId).toBe(5)
  })

  it("el formulario mapeado desde un libro válido pasa la validación", () => {
    const form = LibroForm.fromLibro(libroBase())
    expect(form.isValid()).toBe(true)
  })

  it("usa string vacío como fallback para campos opcionales ausentes", () => {
    const libro = new Libro({
      id: 1,
      titulo: "Test",
      autor: "Autor",
      estado: "BUENO" as EstadoLibro,
      propietarioId: 1,
      imagenUrl: "",
      rating: 0,
    })
    const form = LibroForm.fromLibro(libro)
    expect(form.descripcion).toBe("")
    expect(form.tipo).toBe("")
    expect(form.genero).toBe("")
    expect(form.isbn).toBe("")
    expect(form.idioma).toBe("")
    expect(form.fechaPublicacion).toBe(undefined)
  })
})

describe("LibroForm — toDTO()", () => {
  it("incluye el id pasado como parámetro", () => {
    const dto = libroFormValido().toDTO(42)
    expect(dto.id).toBe(42)
  })

  it("incluye el título", () => {
    const dto = libroFormValido().toDTO(1)
    expect(dto.titulo).toBe("Clean Code")
  })

  it("incluye el autor", () => {
    const dto = libroFormValido().toDTO(1)
    expect(dto.autor).toBe("Robert C. Martin")
  })

  it("convierte paginas a número", () => {
    const form = libroFormValido()
    form.paginas = 200
    const dto = form.toDTO(1)
    expect(typeof dto.paginas).toBe("number")
    expect(dto.paginas).toBe(200)
  })

  it("incluye el género", () => {
    const dto = libroFormValido().toDTO(1)
    expect(dto.genero).toBe("DISENO")
  })

  it("incluye el idioma", () => {
    const dto = libroFormValido().toDTO(1)
    expect(dto.idioma).toBe("INGLES")
  })

  it("incluye el tipo", () => {
    const dto = libroFormValido().toDTO(1)
    expect(dto.tipo).toBe("Comun")
  })

  it("incluye el estado", () => {
    const dto = libroFormValido().toDTO(1)
    expect(dto.estado).toBe("EXCELENTE")
  })

  it("incluye el propietarioId", () => {
    const form = libroFormValido()
    form.propietarioId = 7
    const dto = form.toDTO(1)
    expect(dto.propietarioId).toBe(7)
  })

  it("toDTO con id 0 produce dto con id 0 (libro nuevo)", () => {
    const dto = libroFormValido().toDTO(0)
    expect(dto.id).toBe(0)
  })
})

describe("LibroForm — opciones estáticas", () => {
  it("estadoOptions incluye los 5 estados", () => {
    const values = LibroForm.estadoOptions.map((o) => o.value)
    expect(values).toContain("EXCELENTE")
    expect(values).toContain("MUY_BUENO")
    expect(values).toContain("BUENO")
    expect(values).toContain("REGULAR")
    expect(values).toContain("MALO")
  })

  it("generoOptions incluye los 6 géneros", () => {
    expect(LibroForm.generoOptions.length).toBe(6)
    const values = LibroForm.generoOptions.map((o) => o.value)
    expect(values).toContain("DRAMA")
    expect(values).toContain("CIENCIA_FICCION")
    expect(values).toContain("ROMANCE")
    expect(values).toContain("AUTOAYUDA")
    expect(values).toContain("DISENO")
    expect(values).toContain("LITERATURA_CLASICA")
  })

  it("idiomaOptions incluye los 4 idiomas", () => {
    const values = LibroForm.idiomaOptions.map((o) => o.value)
    expect(values).toContain("ESPANOL")
    expect(values).toContain("INGLES")
    expect(values).toContain("PORTUGUES")
    expect(values).toContain("FRANCES")
  })

  it("tipoOptions incluye los 3 tipos", () => {
    const values = LibroForm.tipoOptions.map((o) => o.value)
    expect(values).toContain("Comun")
    expect(values).toContain("ConDedicatoria")
    expect(values).toContain("Coleccionable")
  })

  it("cada opción de estado tiene label legible", () => {
    LibroForm.estadoOptions.forEach((opt) => {
      expect(opt.label.length).toBeGreaterThan(0)
    })
  })
})
