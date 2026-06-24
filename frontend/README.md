# BookLibre - Frontend 💻

Este es el cliente frontend de **BookLibre**, una aplicación web SPA (Single Page Application) moderna diseñada para el préstamo y reserva colaborativa de libros.

---

## 🛠️ Tecnologías Utilizadas

* **Framework Principal:** [React 19 (19.2.0)](https://react.dev/)
* **Lenguaje:** [TypeScript (5.9.3)](https://www.typescriptlang.org/)
* **Herramienta de Construcción & Dev Server:** [Vite 7 (7.3.3)](https://vite.dev/)
* **Estilado & Diseño:** 
  * [Tailwind CSS v4](https://tailwindcss.com/) para layouts fluidos, responsive y personalizados.
  * **Vanilla CSS** e variables de HSL para colores dinámicos.
* **Enrutado:** [React Router DOM (7.12.0)](https://reactrouter.com/)
* **Cliente de Conexión HTTP:** [Axios](https://axios-http.com/) para peticiones REST y GraphQL.
* **Componentes de UI y Librerías auxiliares:**
  * **Lucide React** para iconografía moderna.
  * **React Day Picker** para la selección interactiva de fechas de reserva.
  * **React Toastify** para notificaciones interactivas elegantes.
  * **Date-fns** para la manipulación sencilla de fechas.
* **Testing:**
  * **Vitest & React Testing Library (16.3.0)** para pruebas de interfaz y componentes interactivos.
  * **jsdom** para emulación del DOM del navegador en pruebas.

---

## 📋 Reglas de Negocio y Flujos en el Frontend

La interfaz de usuario implementa validaciones y flujos específicos para garantizar una experiencia correcta con el modelo del backend:

### 1. Control de Acceso y Rutas Protegidas (`RequireTipoUsuario`)
* El componente helper `RequireTipoUsuario` envuelve las rutas de creación (`/libros/nuevo/editar`) y edición (`/libros/:id/editar`) de libros.
* Si el rol del usuario actual es únicamente `Lector` (quien no tiene permisos de publicación en el backend), la aplicación bloquea el acceso redirigiéndolo al perfil de usuario, previniendo errores de autorización.

### 2. Formulario de Publicación y Edición de Libros
* **Validaciones Locales:**
  * Título, autor, descripción y editorial son campos de texto obligatorios y no pueden estar en blanco.
  * La cantidad de páginas debe validarse para ser un entero mayor a cero.
  * El ISBN se limpia de espacios y guiones, exigiendo exactamente 13 caracteres numéricos mediante expresiones regulares antes del envío.
* Permite seleccionar el tipo de libro (`Común`, `Con Dedicatoria` o `Coleccionable`) y su estado inicial (`Excelente`, `Muy Bueno`, `Bueno`, `Regular`, `Malo`).

### 3. Calendario y Reserva de Libros
* En la vista detallada de cada libro (`/libros/:id`), se integra un calendario interactivo que gestiona la selección de fechas.
* El formulario calcula dinámicamente y previsualiza los días totales de la reserva antes de que el usuario haga clic en "Confirmar Reserva", asegurando que el rango sea válido y no se pise con reservas existentes del libro.

### 4. Calificaciones y Reseñas
* Los usuarios pueden otorgar estrellas (de 1 a 5) y dejar un comentario opcional sobre su experiencia de lectura.
* La aplicación bloquea la posibilidad de calificar un libro más de una vez por el mismo usuario para evitar la manipulación de puntuaciones.

---

## 📐 Decisiones de Diseño y Arquitectura

### 1. Contextos Globales (React Context API)
* **`ThemeContext`:** Provee soporte global para alternar entre **Modo Claro (Light Mode)** y **Modo Oscuro (Dark Mode)**. La paleta de colores de BookLibre utiliza tonalidades HSL oscuras y doradas inspiradas en librerías clásicas, las cuales se adaptan suavemente mediante CSS dinámico.
* **`AuthContext`:** Centraliza el estado de la sesión del usuario (datos personales, token JWT y rol). Almacena el token de forma segura en `localStorage` y configura la expiración/cierre de sesión automático si el backend rechaza el token.

### 2. Clientes y Servicios Modulares (`services/`)
* Todas las llamadas a las APIs se encuentran modularizadas en archivos dentro de `src/services/` (ej. `libroService.ts`, `reservaService.ts`, `usuarioService.ts`).
* **`apiClient.ts`:** Instancia central de Axios preconfigurada con la URL base del backend. Cuenta con un interceptor que añade la cabecera `Authorization: Bearer <token>` de forma automática a todas las peticiones si hay una sesión activa, simplificando los servicios individuales.

### 3. Consumo de GraphQL para Administración
* Para la sección de consultas del administrador (`/consultas`), en lugar de hacer múltiples peticiones REST, el frontend utiliza el endpoint `/api/graphql`.
* Se estructuran consultas GraphQL en formato raw a través de Axios (POST) solicitando específicamente los campos requeridos por las gráficas y componentes (tasa de conversión, feed de eventos, top de usuarios), minimizando la carga en el navegador del cliente.

### 4. Pruebas de UI Robustas
* La suite de tests en `src/test/components/` comprueba no solo el renderizado de la UI, sino también los flujos interactivos (ej. escribir en el buscador, filtrar géneros, abrir modales de edición) simulando eventos reales del usuario a través de `@testing-library/user-event`, asegurando estabilidad en cada despliegue.
