# Alcance funcional desarrollado

Este prototipo cubre aproximadamente el 60% esperado para una primera entrega demostrable del sistema PAPURDIGANS.

## Implementado

- Arquitectura cliente-servidor con React, Express y MySQL.
- Docker Compose con tres servicios: frontend, backend y base de datos.
- Modelo relacional con usuarios, clientes, categorías, productos, pedidos, detalles de pedido, fechas clave, campañas y gastos.
- Login con token JWT y opción "Recordarme".
- Catálogo digital responsive con imágenes, precios, categorías y descripciones.
- Administración básica del catálogo: crear, editar, activar y ocultar productos.
- Gestión de pedidos con cliente, fecha, destino, productos, total y estado.
- Edición, detalle de productos y cancelación lógica de pedidos.
- Clientes frecuentes con historial de compras y preferencias.
- CRUD de clientes frecuentes con desactivación lógica.
- Calendario de fechas clave con alertas y campañas vinculadas.
- Reportes financieros por ingresos, gastos, utilidad, margen, ingresos por categoría y gastos por categoría.
- CRUD de gastos administrativos para alimentar reportes financieros.
- Agente inteligente demostrativo para consultas de catálogo, confirmación de pedidos y recordatorios.
- Simulación de WhatsApp Business API mediante respuestas locales del backend.

## Pendiente para el 100%

- Integración real con OpenAI/Claude para respuestas generativas.
- Integración real con WhatsApp Business API.
- CRUD administrativo completo para campañas, fechas y gastos.
- Pruebas automatizadas unitarias e integración.
- Roles finos por integrante/personal.
- Diagramas formales y documentación técnica extendida.

## Distribución sugerida por ramas

- `feature/Alex`: base de datos, Docker, pedidos.
- `feature/Cristopher`: login, clientes frecuentes, reportes financieros.
- `feature/Said`: calendario de fechas clave, campañas digitales.
- `feature/Alejandro`: catálogo digital, agente WhatsApp demo.
