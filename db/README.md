# Base de datos Aleslí

La base de datos se crea automáticamente al levantar Docker Compose. El archivo principal es `db/init.sql`.

## Conexión desde Adminer

Abre http://localhost:8080 y usa:

- Sistema: `MySQL`
- Servidor: `mysql`
- Usuario: `alesli`
- Contraseña: `alesli123`
- Base de datos: `alesli_db`

## Conexión desde herramientas locales

- Host: `localhost`
- Puerto: `3307`
- Usuario: `alesli`
- Contraseña: `alesli123`
- Base de datos: `alesli_db`

## Tablas principales

- `users`: usuarios del sistema y roles.
- `customers`: clientes frecuentes.
- `customer_special_dates`: fechas importantes por cliente.
- `categories`: categorías del catálogo.
- `products`: catálogo digital.
- `orders`: pedidos.
- `order_items`: productos incluidos en cada pedido.
- `payments`: pagos simulados.
- `key_dates`: fechas clave del negocio floral.
- `campaigns`: campañas digitales.
- `message_templates`: plantillas para automatización.
- `whatsapp_messages`: bitácora demo de WhatsApp.
- `agent_logs`: respuestas del agente inteligente demo.
- `expenses`: gastos para reportes financieros.

## Reiniciar datos desde cero

Si ya levantaste Docker antes, MySQL conserva datos en el volumen `mysql_data`. Para recrear todo:

```bash
docker compose down -v
docker compose up --build
```
