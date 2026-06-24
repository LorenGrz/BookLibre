# BookLibre - Backend ⚙️

Este es el servidor backend de **BookLibre**, una aplicación para el préstamo colaborativo de libros. Está desarrollado en Kotlin sobre la plataforma JVM y utiliza Spring Boot junto a un esquema de persistencia políglota.

---

## 🛠️ Tecnologías Utilizadas

* **Lenguaje:** [Kotlin 1.9.24](https://kotlinlang.org/)
* **Runtime:** Java 21 (OpenJDK)
* **Framework Principal:** [Spring Boot 3.3.1](https://spring.io/projects/spring-boot)
* **API REST & Seguridad:**
  * **Spring Web** para los endpoints tradicionales.
  * **Spring Security** con tokens **JWT (JSON Web Tokens)** para una autenticación stateless.
* **API GraphQL:**
  * **Netflix GraphQL DGS** (Domain Graph Service) para modelar y resolver consultas analíticas complejas del panel de administración.
* **Bases de Datos & Persistencia (Políglota):**
  * **Spring Data JPA & Hibernate:** Conexión a base de datos relacional PostgreSQL.
  * **Spring Data MongoDB:** Almacenamiento de documentos JSON en MongoDB.
  * **Spring Data Redis:** Caché de alto rendimiento sobre Redis.
  * **Flyway:** Automatización y versionado de las migraciones de la base de datos relacional.
* **Testing:**
  * **JUnit 5 & Kotest (5.8.0):** Para especificaciones descriptivas y tests unitarios.
  * **Mockk & Mockito-Kotlin:** Creación de dobles de prueba y mocks.
  * **H2 Database:** Base de datos relacional en memoria para agilizar la suite de pruebas automatizadas.
  * **Jacoco:** Herramienta de cobertura de código.

---

## 📋 Reglas de Negocio (Domain Logic)

El core de la aplicación define reglas clave sobre los libros, las reservas y el karma de la comunidad (**BiblioKarma**).

### 1. Tipos de Usuario (`Usuario`)
* **Lector:** Puede explorar el catálogo, calificar libros y realizar reservas. No tiene permisos para dar de alta libros.
* **Publicador:** Puede dar de alta libros en el catálogo y modificarlos, pero no puede reservar libros de otros.
* **Lector-Publicador:** Tiene permisos mixtos; puede tanto prestar libros (publicar) como pedir prestados (reservar).

### 2. Gestión de Libros y Tipos de Libro (`Libro`)
Cada libro en el catálogo pertenece a un tipo específico que determina cómo calcula el karma que otorga cuando es reservado:
* **Libro Común:**
  * Multiplica la cantidad de páginas del libro por un factor que depende de la reputación del usuario:
    * Si el usuario tiene **menos de 1000 bibliokarmas**, suma `páginas * 5`.
    * Si el usuario tiene **1000 o más**, suma `páginas * 2` (para balancear el karma en usuarios avanzados).
* **Libro Con Dedicatoria:**
  * Otorga un valor fijo de `200` bibliokarmas, más `10` extra por cada reserva histórica que haya tenido ese libro en particular.
* **Libro Coleccionable:**
  * Otorga la cantidad de páginas del libro más la quinta parte (redondeada hacia arriba) de la reputación del usuario que reserva (`ceil(usuario.bibliokarmas / 5.0)`). El usuario no puede tener karma negativo.

* **Validaciones obligatorias:**
  * El ISBN debe contener exactamente 13 caracteres numéricos.
  * La cantidad de páginas debe ser estrictamente mayor a 0.

### 3. Reservas (`Reserva`)
* **Conflicto de Fechas:** No se permiten reservas cuyos rangos de fechas (`fechaDesde` y `fechaHasta`) se solapen para un mismo libro.
* **Autoreserva:** Un usuario no puede reservar un libro del cual es dueño.
* **Coherencia temporal:** La fecha de fin (`fechaHasta`) debe ser estrictamente posterior a la fecha de inicio (`fechaDesde`).
* **Otorgamiento de Karma:** Al confirmarse la reserva, el sistema calcula el BiblioKarma generado (basado en la duración de la reserva en días y el tipo de libro) y lo suma automáticamente al balance del usuario.

---

## 📐 Decisiones de Diseño y Arquitectura

### 1. Persistencia Políglota
Una de las decisiones arquitectónicas más importantes fue el uso de tres motores de bases de datos según el tipo de datos y la consistencia requerida:
* **PostgreSQL (Relacional):** Utilizado para entidades estructuradas y transaccionales críticas, como `Usuario`, `Reserva`, y el `HistorialPuntaje`. Requiere consistencia ACID y relaciones sólidas mediante llaves foráneas.
* **MongoDB (Documental):** Utilizado para `Libro`. Los libros tienen una estructura semi-estructurada (diferentes tipos de libros con lógica polimórfica) y contienen listas anidadas que crecen con el tiempo (`clicks`, `calificaciones`, y `reservas`). Almacenarlos como documentos JSON agiliza la lectura/escritura del catálogo completo.
* **Redis (Llave-Valor/Caché):** Se utiliza para almacenar en caché de lectura los resultados más solicitados de analíticas administrativas, tales como el ranking de usuarios con más BiblioKarma (`TopBibliokarmasCache`) y el ranking de libros más solicitados (`TopLibrosCache`), evitando sobrecargar MongoDB y Postgres con consultas de agregación constantes.

### 2. API Híbrida (REST + GraphQL)
* **REST (Endpoints estándar):** Utilizado para transacciones simples de escritura y lectura rápida, como el Login/Registro, la creación y edición de libros, y el flujo de reservas y calificaciones.
* **GraphQL (Netflix DGS):** Utilizado para el panel de administración (`/api/graphql`). Las consultas analíticas suelen requerir datos de múltiples fuentes y modelos (Tasa de conversión, Salud del catálogo, Actividad reciente). Con GraphQL el frontend realiza una única petición seleccionando únicamente las propiedades necesarias, optimizando el ancho de banda y la performance del servidor.

### 3. Eventos Polimórficos de Actividad
En la consulta GraphQL `feedActividad`, se utiliza una interfaz GraphQL (`EventoActividad`) implementada por los tipos concretos `LibroAgregado` y `ReservaConfirmada`. Esto permite que el frontend renderice de forma dinámica una línea de tiempo homogénea de actividad comunitaria, aplicando lógica de negocio polimórfica directamente desde el backend.
