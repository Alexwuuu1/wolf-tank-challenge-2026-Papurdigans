# PAPURDIGANS - Florería Aleslí

Prototipo web con React, Node.js/Express, MySQL y Docker para la gestión comercial y administrativa de la Florería Aleslí.

## Módulos incluidos

- Login con token y opción "Recordarme".
- Catálogo digital de arreglos florales con creación, edición y activación/desactivación de productos.
- Registro y seguimiento de pedidos.
- Pedidos con creacion, detalle, edicion, cambio de estado y cancelacion.
- Clientes frecuentes con creacion, edicion, desactivacion, historial y preferencias.
- Calendario de fechas clave y campañas.
- Reportes financieros básicos con gráficos.
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
- Contraseña: `alesli123`
- Base de datos: `alesli_db`

Herramientas locales como MySQL Workbench:

- Host: `localhost`
- Puerto: `3307`
- Usuario: `alesli`
- Contraseña: `alesli123`
- Base de datos: `alesli_db`

## Credenciales demo

- Usuario: `admin@alesli.bo`
- Contraseña: `alesli2026`

## Estructura

- `frontend/`: aplicación React.
- `backend/`: API Express.
- `db/init.sql`: esquema relacional y datos semilla.
- `db/ERD.md`: diagrama entidad-relación en Mermaid.
- `db/README.md`: guía de conexión y reinicio de datos.

## Alcance prototipo

WhatsApp Business y OpenAI/Claude quedan simulados mediante endpoints locales de demostración, respetando los límites definidos para la etapa de prototipo.
