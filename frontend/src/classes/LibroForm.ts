import type {
  LibroDTO,
  TipoLibro,
  EstadoLibro,
  Genero,
  Idioma,
} from "../models/libroModel";
import { Libro } from "./Libro";
import { parseISO, isValid, isFuture, startOfDay } from "date-fns";

export class LibroForm {
  titulo: string = "";
  autor: string = "";
  descripcion: string = "";
  tipo: TipoLibro | "" = "";
  genero: Genero | "" = "";
  paginas: number | "" = "";
  isbn: string | "" = "";
  idioma: Idioma | "" = "";
  estado: EstadoLibro | "" = "";
  estoyReservado: boolean = false;
  fechaPublicacion: Date | undefined = undefined;
  propietarioId: number = 0;
  imagenUrl: string = "";
  editorial: string = "";

  static fields = [
    { name: "titulo", label: "Título", type: "text", placeholder: "Ingresá el título del libro..." },
    { name: "autor", label: "Autor", type: "text", placeholder: "Ingresá el autor..." },
    { name: "editorial", label: "Editorial", type: "text", placeholder: "Ingresá la editorial..." },
    { name: "descripcion", label: "Descripción", type: "text", placeholder: "Breve descripción del libro..." },
    { name: "paginas", label: "Páginas", type: "number", placeholder: "Cantidad de páginas..." },
    { name: "isbn", label: "ISBN", type: "text", placeholder: "Código ISBN..." },
    { name: "fechaPublicacion", label: "Fecha de publicación", type: "date", placeholder: "" },
  ] as const;

  static estadoOptions = [
    { value: "EXCELENTE", label: "Excelente" },
    { value: "MUY_BUENO", label: "Muy bueno" },
    { value: "BUENO", label: "Bueno" },
    { value: "REGULAR", label: "Regular" },
    { value: "MALO", label: "Malo" },
  ];

  static generoOptions = [
    { value: "DRAMA", label: "Drama" },
    { value: "CIENCIA_FICCION", label: "Ciencia Ficción" },
    { value: "ROMANCE", label: "Romance" },
    { value: "AUTOAYUDA", label: "Autoayuda" },
    { value: "DISENO", label: "Diseño" },
    { value: "LITERATURA_CLASICA", label: "Literatura Clásica" },
  ];

  static idiomaOptions = [
    { value: "ESPANOL", label: "Español" },
    { value: "INGLES", label: "Inglés" },
    { value: "PORTUGUES", label: "Portugués" },
    { value: "FRANCES", label: "Francés" },
  ];

  static tipoOptions = [
    { value: "Comun", label: "Común" },
    { value: "ConDedicatoria", label: "Con dedicatoria" },
    { value: "Coleccionable", label: "Coleccionable" },
  ];

  static fromLibro(libro: Libro): LibroForm {
    const form = new LibroForm();
    form.titulo = libro.titulo;
    form.autor = libro.autor;
    form.descripcion = libro.descripcion || "";
    form.tipo = libro.tipo || "";
    form.genero = libro.genero || "";
    form.paginas = libro.paginas || "";
    form.isbn = libro.isbn || "";
    form.idioma = libro.idioma || "";
    form.estado = libro.estado;
    form.propietarioId = libro.propietarioId;
    form.imagenUrl = libro.imagenUrl || "";
    form.editorial = libro.editorial || "";
    if (libro.fechaPublicacion) {
      // parseISO maneja "YYYY-MM-DD" sin problemas de zona horaria
      const parsed = parseISO(libro.fechaPublicacion);
      form.fechaPublicacion = isValid(parsed) ? parsed : undefined;
    }
    return form;
  }

  validate(): Record<string, string | undefined> {
    const errors: Record<string, string | undefined> = {
      titulo: !this.titulo.trim()
        ? "El título es obligatorio"
        : this.titulo.length > 200 ? "El título no puede superar los 200 caracteres" : undefined,
      autor: !this.autor.trim()
        ? "El autor es obligatorio"
        : this.autor.length > 150 ? "El autor no puede superar los 150 caracteres" : undefined,
      descripcion: !this.descripcion.trim()
        ? "La descripción es obligatoria"
        : this.descripcion.length > 2000 ? "La descripción no puede superar los 2000 caracteres" : undefined,
      editorial: !this.editorial.trim()
        ? "La editorial es obligatoria"
        : this.editorial.length > 150 ? "La editorial no puede superar los 150 caracteres" : undefined,
      tipo: !this.tipo ? "El tipo es obligatorio" : undefined,
      genero: !this.genero ? "El género es obligatorio" : undefined,
      paginas: this.paginas === "" || Number(this.paginas) <= 0
        ? "Ingresá una cantidad de páginas válida"
        : Number(this.paginas) > 9999 ? "La cantidad de páginas no puede superar 9999" : undefined,
      isbn: (() => {
        const isbnStr = this.isbn.trim()
        if (isbnStr.length !== 13) return "El ISBN debe tener exactamente 13 dígitos"
        if (isNaN(Number(isbnStr))) return "El ISBN debe contener solo dígitos"
        return undefined
      })(),
      idioma: !this.idioma ? "El idioma es obligatorio" : undefined,
      estado: !this.estado ? "El estado es obligatorio" : undefined,
      fechaPublicacion: !this.fechaPublicacion
        ? "La fecha de publicación es obligatoria" : undefined,
    };

    if (!errors.fechaPublicacion && this.fechaPublicacion) {
      // isFuture compara contra ahora; usamos startOfDay para ignorar la hora
      if (isFuture(startOfDay(this.fechaPublicacion))) {
        errors.fechaPublicacion = "La fecha de publicación no puede ser futura";
      }
    }

    return errors
  }

  isValid(): boolean {
    return !Object.values(this.validate()).some(Boolean);
  }

  toDTO(id: number): LibroDTO {
    const apiFecha = this.fechaPublicacion
      ? this.fechaPublicacion.toISOString().split("T")[0]
      : ""

    return {
      id,
      titulo: this.titulo,
      autor: this.autor,
      descripcion: this.descripcion,
      tipo: this.tipo as TipoLibro,
      genero: this.genero as Genero,
      paginas: Number(this.paginas),
      isbn: this.isbn,
      idioma: this.idioma as Idioma,
      estado: this.estado as EstadoLibro,
      fechaPublicacion: apiFecha,
      fechaAgregado: new Date().toISOString(),
      propietarioId: this.propietarioId,
      estoyReservado: this.estoyReservado,
      imagenUrl: this.imagenUrl,
      editorial: this.editorial,
      reservas: [],
      ultimasCalificaciones: [],
    };
  }
}