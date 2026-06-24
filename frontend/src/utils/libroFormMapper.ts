import { LibroForm } from "../classes/LibroForm"
import { formatLibroInputDate, parseLibroInputDate } from "./libroDate"

export type LibroFormValues = Record<string, string>

export const emptyLibroFormValues = (): LibroFormValues => ({
  titulo: "",
  autor: "",
  descripcion: "",
  tipo: "",
  genero: "",
  paginas: "",
  isbn: "",
  idioma: "",
  estado: "",
  fechaPublicacion: "",
  propietarioId: "",
  imagenUrl: "",
  editorial: "",
})

export const libroFormFromValues = (values: LibroFormValues): LibroForm => {
  const instance = new LibroForm()
  Object.assign(instance, {
    ...values,
    paginas: values.paginas === "" ? "" : Number(values.paginas),
    fechaPublicacion: parseLibroInputDate(values.fechaPublicacion),
  })
  return instance
}

export const libroFormToValues = (form: LibroForm): LibroFormValues => ({
  titulo: form.titulo,
  autor: form.autor,
  descripcion: form.descripcion,
  tipo: form.tipo,
  genero: form.genero,
  paginas: String(form.paginas),
  isbn: form.isbn,
  idioma: form.idioma,
  estado: form.estado,
  fechaPublicacion: form.fechaPublicacion ? formatLibroInputDate(form.fechaPublicacion) : "",
  propietarioId: String(form.propietarioId),
  imagenUrl: form.imagenUrl,
  editorial: form.editorial,
})
