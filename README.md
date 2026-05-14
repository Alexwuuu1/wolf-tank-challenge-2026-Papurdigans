# WOLF TANK CHALLENGE - PAPURDIGANS

## Informacion del equipo

- **Nombre del grupo:** PAPURDIGANS
- **Rubro:** Prototipo de sistema web con agentes inteligentes para la optimizacion de la gestion comercial y administrativa enfocada en el sector floral.
- **Caso:** Floreria Alesli.

## Integrantes

- **Alex Joel Quispe Ticona:** Scrum Master / Dev - Base de datos, plataforma de pedidos. Rama: `feature/Alex`.
- **Cristopher Iori Lazcano Gutierrez:** Developer - Login, clientes frecuentes, reportes financieros. Rama: `feature/Cristopher`.
- **Said Eduardo Lazarte Vasquez:** Developer - Calendario fechas clave, campanas digitales. Rama: `feature/Said`.
- **Alejandro Villalpando Rojas:** Developer - Automatizacion WhatsApp, catalogo digital. Rama: `feature/Alejandro`.

## Stack tecnologico

- **Lenguajes:** JavaScript, SQL.
- **Frontend:** React.js con Vite.
- **Backend:** Node.js con Express.
- **Base de datos:** MySQL.
- **Infraestructura:** Docker Compose.
- **Herramientas:** Git, GitHub/GitLab, Trello, API de Inteligencia Artificial y WhatsApp Business API en modo demostrativo.

## Modulos incluidos

- Login con token y opcion "Recordarme".
- Login redisenado con estetica floral y boton para mostrar/ocultar contrasena.
- Catalogo digital de arreglos florales con creacion, edicion y activacion/desactivacion de productos.
- Pedidos con creacion, detalle, edicion, cambio de estado, cancelacion y recalculo de total.
- Clientes frecuentes con creacion, edicion, desactivacion, historial y preferencias.
- Calendario de fechas clave y campanas vinculadas.
- Reportes financieros con ingresos, gastos, utilidad, margen y CRUD de gastos.
- Agente inteligente demostrativo para consultas, confirmaciones y recordatorios estilo WhatsApp.

## Levantar con Docker

```bash
docker compose up --build
```

Luego abre:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api/health
- Adminer para revisar MySQL: http://localhost:8080
- MySQL local: `localhost:3307`

## Acceso a la base de datos

Adminer:

- Sistema: `MySQL`
- Servidor: `mysql`
- Usuario: `alesli`
- Contrasena: `alesli123`
- Base de datos: `alesli_db`

Herramientas locales como MySQL Workbench:

- Host: `localhost`
- Puerto: `3307`
- Usuario: `alesli`
- Contrasena: `alesli123`
- Base de datos: `alesli_db`

## Credenciales demo

- Usuario: `admin@alesli.bo`
- Contrasena: `alesli2026`

## Estructura

- `frontend/`: aplicacion React.
- `backend/`: API Express.
- `db/init.sql`: esquema relacional y datos semilla.
- `db/ERD.md`: diagrama entidad-relacion en Mermaid.
- `db/README.md`: guia de conexion y reinicio de datos.

## Alcance prototipo

WhatsApp Business y OpenAI/Claude quedan simulados mediante endpoints locales de demostracion, respetando los limites definidos para la etapa de prototipo.
