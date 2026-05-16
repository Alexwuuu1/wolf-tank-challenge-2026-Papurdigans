# Alcance funcional desarrollado

Este documento describe el avance actual del prototipo inicial de PAPURDIGANS para Floreria Alesli.

## Estado actual

El sistema se encuentra aproximadamente al 40% del alcance total esperado. El avance prioriza el flujo funcional principal para la demostracion:

1. Cliente navega la web, revisa catalogo y crea un pedido.
2. Administracion recibe el pedido, revisa detalle, productos, total, estado y ubicacion.
3. El sistema mantiene datos en MySQL y se levanta con Docker Compose.

## Implementado

- Arquitectura cliente-servidor con React, Express y MySQL.
- Docker Compose con servicios para frontend, backend, MySQL y Adminer.
- Modelo relacional con usuarios, clientes, productos, categorias, pedidos, detalle de pedidos, fechas clave, campanas, gastos y logs demo.
- Login con token JWT, opcion "Recordarme" y boton para mostrar/ocultar contrasena.
- Registro publico de clientes desde la pantalla de acceso.
- Roles base: `admin`, `operador`, `vendedor` y `cliente`.
- Web cliente separada por vistas: Inicio, Catalogo, Pedido, Fechas, Como funciona y Contacto.
- Catalogo cliente con buscador, productos activos y carrito de pedido.
- Ficha de pedido cliente con seleccion de productos, cantidades, total, dedicatoria y direccion.
- Vista previa de Google Maps para direccion de entrega en La Paz.
- Confirmacion de pedido demo con numero de pedido y total.
- Dashboard administrativo con metricas y resumen del avance funcional.
- Gestion de pedidos con listado, cambio de estado, edicion, cancelacion y modal de detalle.
- Modal administrativo de pedido con cliente, WhatsApp, fecha, estado, productos, total y mapa.
- Catalogo administrativo con creacion, edicion y activacion/desactivacion de productos.
- Clientes frecuentes con buscador, metricas, tarjetas de contacto, preferencias y CRUD basico.
- Calendario de fechas clave y campanas vinculadas.
- Reportes financieros basicos de ingresos, gastos, utilidad e ingresos por categoria.
- Agente demostrativo para consultas de catalogo, pedidos y recordatorios.

## Pendiente para siguientes iteraciones

- Separacion estricta de permisos por rol en backend y frontend.
- Integracion real con WhatsApp Business API.
- Integracion real con OpenAI/Claude para agente inteligente generativo.
- CRUD completo de campanas, fechas clave, gastos y usuarios.
- Historial de pedidos por cliente dentro de la web cliente.
- Confirmacion de pagos reales o simulacion mas completa.
- Validaciones avanzadas, auditoria y pruebas automatizadas.
- Documentacion tecnica extendida y diagramas formales actualizados.

## Distribucion sugerida por ramas

- `feature/Alex`: base de datos, Docker, plataforma de pedidos.
- `feature/Cristopher`: login, clientes frecuentes, reportes financieros.
- `feature/Said`: calendario de fechas clave, campanas digitales.
- `feature/Alejandro`: automatizacion WhatsApp demo, catalogo digital y web cliente.
- `develop`: rama de prueba/integracion.
- `main`: rama estable para entrega final.
