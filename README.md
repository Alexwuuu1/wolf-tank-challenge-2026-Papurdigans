# WOLF TANK CHALLENGE - PAPURDIGANS

## Informacion del equipo

- **Nombre del grupo:** PAPURDIGANS
- **Rubro:** Prototipo de sistema web con agentes inteligentes para la optimizacion de la gestion comercial y administrativa enfocada en el sector floral.
- **Caso:** Floreria Alesli.
- **Avance actual:** prototipo inicial al 40%.

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
- **Herramientas:** Git, GitHub/GitLab, Trello, Adminer, API de Inteligencia Artificial y WhatsApp Business API en modo demostrativo.

## Modulos incluidos en el prototipo

- Login con token JWT, opcion "Recordarme" y boton para mostrar/ocultar contrasena.
- Registro publico de clientes desde la pantalla de acceso.
- Roles base: `admin`, `operador`, `vendedor` y `cliente`.
- Web cliente con vistas de Inicio, Catalogo, Pedido, Fechas, Como funciona y Contacto.
- Catalogo cliente con buscador, carrito, cantidades y confirmacion de pedido.
- Direccion de entrega con vista previa de Google Maps enfocada en La Paz.
- Panel administrativo con dashboard y resumen funcional.
- Catalogo digital administrativo con creacion, edicion y activacion/desactivacion de productos.
- Pedidos con creacion, detalle en modal, edicion, cambio de estado, cancelacion y total recalculado.
- Detalle administrativo de pedido con productos, cliente, WhatsApp, estado, total y mapa.
- Clientes frecuentes con buscador, metricas, creacion, edicion, desactivacion y preferencias.
- Calendario de fechas clave y campanas vinculadas.
- Reportes financieros basicos con ingresos, gastos, utilidad e ingresos por categoria.
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

Todas usan la contrasena:

```text
alesli2026
```

Usuarios:

- Admin: `admin@alesli.bo`
- Operador: `alejandro@alesli.bo`
- Vendedor: `cristopher@alesli.bo`
- Cliente: `cliente@alesli.bo`

## Flujo principal de demostracion

1. El cliente ingresa o crea cuenta.
2. El cliente navega la web, revisa catalogo y agrega productos al pedido.
3. El cliente completa datos de entrega, direccion con mapa y dedicatoria.
4. El cliente confirma el pedido demo.
5. El administrador entra al panel interno.
6. El administrador revisa el pedido en modal con productos, total, estado y mapa.
7. El administrador gestiona catalogo, clientes, reportes, calendario y agente demo.

## Estructura

- `frontend/`: aplicacion React.
- `backend/`: API Express.
- `db/init.sql`: esquema relacional y datos semilla.
- `db/ERD.md`: diagrama entidad-relacion en Mermaid.
- `db/README.md`: guia de conexion y reinicio de datos.
- `docker-compose.yml`: entorno Docker para frontend, backend, MySQL y Adminer.

## Alcance prototipo

El prototipo actual representa un avance inicial aproximado del 40%. WhatsApp Business y OpenAI/Claude quedan simulados mediante endpoints locales de demostracion. Las siguientes iteraciones deben completar integraciones reales, permisos finos por rol, CRUDs faltantes, pruebas automatizadas y documentacion tecnica extendida.
