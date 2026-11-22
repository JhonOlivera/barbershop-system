# BarberBook

BarberBook es un sistema de reservas para barberías. Cada barbería (tenant) gestiona sus propios barberos, servicios y citas, y puede compartir un enlace público para que sus clientes reserven una cita sin necesidad de crear una cuenta.

## Funcionalidades

- **Reservas públicas sin cuenta**: cada barbería tiene un enlace (`/reservar/{barbershopId}`) que el administrador puede compartir por WhatsApp o Instagram. El cliente elige servicio, barbero, fecha y horario disponible, y reserva con solo su nombre y celular.
- **Roles y permisos**:
  - **ADMIN**: gestiona usuarios, servicios y los datos de su barbería; ve estadísticas; borra citas.
  - **BARBER**: ve y actualiza el estado de las citas de su barbería.
  - **CLIENT**: reserva citas para sí mismo (logueado) y consulta sus propias citas.
  - Un ADMIN o BARBER solo puede ver/modificar datos de su propia barbería (multi-tenant).
- **Validación de reservas**: no se permiten fechas pasadas, horarios fuera del horario de atención, barberos inactivos/de otra barbería, ni solapamiento con otra cita del mismo barbero.
- **Notificaciones por WhatsApp** (vía Twilio) al confirmar, recordar (un día antes) y cancelar una cita. Si Twilio no está configurado, la app sigue funcionando y solo loggea el envío omitido.
- **Autenticación** con JWT y autorización a nivel de método (`@PreAuthorize`).

## Stack

- **Backend**: Java 21, Spring Boot 3.4.3 (Web, Security, Data JPA, Validation), MySQL, JWT (`jjwt`), Twilio SDK, Maven.
- **Frontend**: Angular 21 (componentes standalone, signals), TypeScript.

## Cómo correrlo en local

### Backend

1. Tener MySQL corriendo en local (o ajustar `DB_URL`).
2. Copiar `backend/.env.example` a `backend/.env` (o exportar las variables en tu shell) y completar los valores:

   | Variable | Descripción | Default local |
   |---|---|---|
   | `DB_URL` | URL JDBC completa | `jdbc:mysql://localhost:3306/barbershopdb?...` |
   | `DB_USER` | Usuario de la base de datos | `root` |
   | `DB_PASSWORD` | Contraseña de la base de datos | _(vacío)_ |
   | `JWT_SECRET` | Clave para firmar los JWT | _(obligatoria, sin default)_ |
   | `ADMIN_PASSWORD` | Contraseña del usuario `admin` de demo | _(si está vacía, no se crea el admin)_ |
   | `SEED_DEMO` | Si se crean barberos/servicios de demo | `true` |
   | `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_WHATSAPP_FROM` | Credenciales de Twilio para WhatsApp | _(vacío = WhatsApp deshabilitado)_ |
   | `CORS_ORIGINS` | Orígenes permitidos por CORS (separados por coma) | `http://localhost:4200` |
   | `PORT` | Puerto del servidor | `8080` |

3. Ejecutar:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   La API queda disponible en `http://localhost:8080/api`.

### Frontend

```bash
cd frontend
npm install
npm start
```

La app queda disponible en `http://localhost:4200` y apunta a `http://localhost:8080/api` (ver `src/environments/environment.ts`).

## Despliegue

- **Backend → Railway**: usa `backend/Dockerfile` (build multi-stage con Maven + JRE). Configura las variables de entorno de la tabla anterior en el proyecto de Railway; Railway inyecta `PORT` automáticamente.
- **Frontend → Vercel**: `frontend/vercel.json` define el build (`npm run build`), el directorio de salida (`dist/barbershop-frontend/browser`) y el *rewrite* de todas las rutas a `index.html` para que las rutas de Angular (ej. `/reservar/1`) no den 404 al recargar.

## Endpoints principales por rol

| Endpoint | Rol |
|---|---|
| `POST /api/auth/login`, `POST /api/auth/register` | público |
| `GET /api/public/health` | público (health check) |
| `GET /api/public/barbershops`, `/{id}`, `/{id}/services`, `/{id}/barbers`, `GET /api/public/slots`, `POST /api/public/appointments` | público (reserva sin cuenta) |
| `POST /api/appointments` | CLIENT (crea una cita para sí mismo) |
| `GET /api/appointments/my` | CLIENT |
| `GET /api/appointments/shop/{shopId}`, `/upcoming`, `/date/{date}` | ADMIN, BARBER (de su propia barbería) |
| `PATCH /api/appointments/{id}/status` | ADMIN, BARBER (de su propia barbería) |
| `DELETE /api/appointments/{id}` | ADMIN (de su propia barbería) |
| `GET /api/appointments/stats/{shopId}` | ADMIN (de su propia barbería) |
| `GET /api/services/shop/{shopId}` | cualquier usuario autenticado |
| `POST /api/services`, `PUT /{id}`, `DELETE /{id}` | ADMIN (de su propia barbería) |
| `GET /api/users/shop/{shopId}`, `/barbers` | ADMIN (de su propia barbería) |
| `POST /api/users`, `PUT /{id}`, `DELETE /{id}` | ADMIN (de su propia barbería) |
| `GET /api/barbershops`, `/{id}` | cualquier usuario autenticado |
| `PUT /api/barbershops/{id}` | ADMIN (de su propia barbería) |

## Capturas

_Pendiente: agregar capturas de pantalla de la app (login, dashboard, reserva pública, etc.)._
