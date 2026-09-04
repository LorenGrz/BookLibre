# Contexto del proyecto

**BookLibre**: plataforma colaborativa para prestar/reservar libros entre una
comunidad de lectores. Originalmente un trabajo grupal de la materia
Programación de Aplicaciones Móviles (UNSAM) — el `render.yaml` referencia
los repos del grupo (`phm-unsam/backend-2026-grupo-12` /
`frontend-2026-grupo-12`), pero **este remoto local es el fork/copia personal
de Loren** (`LorenGrz/BookLibre`). Es la implementación de referencia citada
en las reglas globales de React (`~/.agents/skills/config/rules/react.md`).

## Stack

- **Backend:** Kotlin · Java 21 · Spring Boot 3.3.1 (Web, Security/JWT,
  HATEOAS) · **persistencia políglota**: PostgreSQL (JPA, usuarios/préstamos/
  reservas), MongoDB (catálogo de libros), Redis/Valkey (cache, top-10 libros
  más clickeados) · Netflix GraphQL DGS · Flyway · testing: Kotest, JUnit 5,
  Mockk, Jacoco.
- **Frontend** (`frontend/`): React 19 · TypeScript · Vite 7 · Tailwind v4 ·
  React Router DOM · Axios · testing: Vitest + React Testing Library.

## Deploy — `feat/deploy` es la rama de producción

**Ojo:** en este repo la rama que dispara deploy real **no es `main`**, es
`feat/deploy`. Un push ahí:

- **Backend:** Render detecta el push y redeploya el Web Service Docker
  (`booklibre-api`, plan free) automáticamente.
- **Frontend:** GitHub Actions (`deploy-pages.yml`) buildea con Vite
  (`--base=/BookLibre/`) y publica en GitHub Pages.

Infra (`backend/render.yaml`, Render Blueprint):
- Postgres gestionado por Render (`booklibre-db`, plan free).
- Valkey/Redis gestionado por Render (`booklibre-kv`, plan free, solo red
  interna).
- **MongoDB NO está en Render** (no ofrece Mongo gestionado) → Atlas M0. Ver
  `docs/deploy.md` para el detalle.
- Secrets (`MONGODB_URI`, `JWT_SECRET`) se cargan a mano en el dashboard de
  Render, nunca en el repo.
- Cookies JWT: `SameSite=None; Secure` en prod (frontend en GitHub Pages,
  backend en Render → dominios distintos).
- La API de Render para env vars **reemplaza toda la lista** en cada PUT — no
  se puede actualizar una sola variable sin reenviar las 12.

## Historial reciente relevante

- Endurecimiento de seguridad: autorización atada al principal (no confiar en
  IDs del cliente), auth solo por header (no cookie+header mixto), JWT secret
  real en prod (antes de eso corría con un secret de desarrollo).
- `/api/health` liviano para que UptimeRobot haga ping y el free tier de
  Render no entre en cold start — mismo patrón de keep-alive que se usó en
  `data-saturday-sorteo-form` (`/api/ping`).
- Cookies `SameSite=None` para que funcionen en navegadores mobile que las
  bloquean por default.

## Última revisión

2026-09-04 — primera vez que se documenta en CLAUDE.md. Nota: al momento de
escribir esto había cambios sin commitear en
`backend/src/main/kotlin/ar/edu/unsam/phm/domain/Libro.kt` y un
`build.gradle.kts.orig` borrado — no se tocaron, quedan para que Loren los
revise aparte.
