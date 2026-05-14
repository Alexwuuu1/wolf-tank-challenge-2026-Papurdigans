SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS alesli_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE alesli_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','vendedor','operador') NOT NULL DEFAULT 'admin',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(140) NOT NULL,
  phone VARCHAR(40) NOT NULL UNIQUE,
  email VARCHAR(160),
  preferences TEXT,
  total_orders INT NOT NULL DEFAULT 0,
  last_purchase_at DATETIME,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_customers_name (name),
  INDEX idx_customers_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customer_special_dates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  title VARCHAR(120) NOT NULL,
  special_date DATE NOT NULL,
  notes VARCHAR(255),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  INDEX idx_customer_special_dates_date (special_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(140) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_products_category (category_id),
  INDEX idx_products_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_time VARCHAR(40),
  delivery_address VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(140),
  recipient_phone VARCHAR(40),
  status ENUM('nuevo','confirmado','preparacion','enviado','entregado','cancelado') NOT NULL DEFAULT 'nuevo',
  payment_status ENUM('pendiente','simulado','pagado') NOT NULL DEFAULT 'pendiente',
  channel ENUM('web','whatsapp','tienda') NOT NULL DEFAULT 'web',
  notes TEXT,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_delivery_date (delivery_date),
  INDEX idx_orders_customer (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) AS (quantity * unit_price) STORED,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  method ENUM('efectivo','qr','transferencia','simulado') NOT NULL DEFAULT 'simulado',
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pendiente','confirmado','rechazado') NOT NULL DEFAULT 'pendiente',
  reference_code VARCHAR(100),
  paid_at DATETIME,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_payments_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS key_dates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(140) NOT NULL,
  event_date DATE NOT NULL,
  description TEXT,
  alert_days_before INT NOT NULL DEFAULT 7,
  priority ENUM('baja','media','alta') NOT NULL DEFAULT 'media',
  INDEX idx_key_dates_event_date (event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  key_date_id INT,
  title VARCHAR(140) NOT NULL,
  channel VARCHAR(80) NOT NULL DEFAULT 'WhatsApp',
  message TEXT NOT NULL,
  status ENUM('borrador','programada','enviada') NOT NULL DEFAULT 'borrador',
  scheduled_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (key_date_id) REFERENCES key_dates(id),
  INDEX idx_campaigns_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS message_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  intent VARCHAR(80) NOT NULL,
  body TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  order_id INT,
  direction ENUM('entrada','salida') NOT NULL,
  message TEXT NOT NULL,
  status ENUM('demo','pendiente','enviado','fallido') NOT NULL DEFAULT 'demo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_whatsapp_customer (customer_id),
  INDEX idx_whatsapp_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS agent_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  intent VARCHAR(80) NOT NULL,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  response_time_ms INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  INDEX idx_agent_logs_intent (intent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  concept VARCHAR(140) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Operativo',
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_expenses_date (expense_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW vw_order_summary AS
SELECT
  o.id,
  c.name AS customer_name,
  c.phone AS customer_phone,
  o.delivery_date,
  o.delivery_address,
  o.status,
  o.payment_status,
  o.total,
  o.created_at
FROM orders o
JOIN customers c ON c.id = o.customer_id;

CREATE OR REPLACE VIEW vw_revenue_by_category AS
SELECT
  cat.name AS category,
  COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue,
  COALESCE(SUM(oi.quantity), 0) AS units_sold
FROM categories cat
LEFT JOIN products p ON p.category_id = cat.id
LEFT JOIN order_items oi ON oi.product_id = p.id
GROUP BY cat.id, cat.name;

INSERT IGNORE INTO users (id, name, email, password_hash, role) VALUES
(1, 'Equipo PAPURDIGANS', 'admin@alesli.bo', '08d6675b9728a37527a12b2724dc081496be6dac071f855865615b7e0fc273b1', 'admin'),
(2, 'Alejandro Villalpando', 'alejandro@alesli.bo', '08d6675b9728a37527a12b2724dc081496be6dac071f855865615b7e0fc273b1', 'operador'),
(3, 'Cristopher Lazcano', 'cristopher@alesli.bo', '08d6675b9728a37527a12b2724dc081496be6dac071f855865615b7e0fc273b1', 'vendedor');

INSERT IGNORE INTO categories (id, name, description) VALUES
(1, 'Ramos', 'Ramos florales personalizados.'),
(2, 'Arreglos', 'Arreglos para mesa, eventos y entregas especiales.'),
(3, 'Detalles', 'Cajas, chocolates y regalos combinados.'),
(4, 'Fechas especiales', 'Productos para campañas de alta demanda.');

INSERT IGNORE INTO products (id, category_id, name, description, price, image_url, active) VALUES
(1, 1, 'Ramo Aleslí Clásico', 'Ramo de rosas rojas con follaje fino y envoltura premium.', 180.00, 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80', TRUE),
(2, 2, 'Canasta Naturalmente', 'Canasta floral con flores mixtas, tarjeta personalizada y lazo.', 260.00, 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=900&q=80', TRUE),
(3, 3, 'Detalle Dulce Floral', 'Caja con mini arreglo, chocolates y dedicatoria.', 150.00, 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=80', TRUE),
(4, 4, 'Flores Amarillas Especial', 'Ramo de flores amarillas para fechas virales y celebraciones.', 210.00, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80', TRUE),
(5, 1, 'Ramo Pastel Premium', 'Flores en tonos pastel con presentación elegante para cumpleaños.', 230.00, 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80', TRUE),
(6, 2, 'Centro Floral Ejecutivo', 'Arreglo formal para oficinas, recepciones y regalos corporativos.', 320.00, 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=900&q=80', TRUE);

INSERT IGNORE INTO customers (id, name, phone, email, preferences, total_orders, last_purchase_at) VALUES
(1, 'María Fernández', '70123456', 'maria@example.com', 'Prefiere rosas rojas y entregas por la mañana.', 3, '2026-05-12 10:00:00'),
(2, 'Luis Arce', '71234567', 'luis@example.com', 'Compra en fechas especiales, mensajes cortos.', 2, '2026-05-13 09:30:00'),
(3, 'Camila Rojas', '72345678', 'camila@example.com', 'Le gustan flores amarillas y tonos pastel.', 1, '2026-05-13 16:10:00'),
(4, 'Andrea Salazar', '73456789', 'andrea@example.com', 'Solicita dedicatorias largas y entrega en oficina.', 1, '2026-05-14 11:00:00');

INSERT IGNORE INTO customer_special_dates (id, customer_id, title, special_date, notes) VALUES
(1, 1, 'Aniversario', '2026-08-18', 'Sugerir ramo de rosas rojas.'),
(2, 2, 'Cumpleaños de su mamá', '2026-05-27', 'Enviar campaña de Día de la Madre.'),
(3, 3, 'Flores amarillas', '2026-09-21', 'Cliente interesada en campaña de flores amarillas.');

INSERT IGNORE INTO orders (id, customer_id, delivery_date, delivery_time, delivery_address, recipient_name, recipient_phone, status, payment_status, channel, notes, total, created_by, created_at) VALUES
(1, 1, '2026-05-20', '10:00', 'Calle Campos #248, La Paz', 'María Fernández', '70123456', 'confirmado', 'simulado', 'web', 'Entregar con tarjeta: Naturalmente para ti.', 390.00, 1, '2026-05-12 10:00:00'),
(2, 2, '2026-05-27', '12:00', 'Av. Arce esquina Rosendo Gutiérrez', 'Sra. Elena', '76543210', 'preparacion', 'pendiente', 'whatsapp', 'Confirmar disponibilidad antes del mediodía.', 150.00, 3, '2026-05-13 09:30:00'),
(3, 3, '2026-06-01', '16:30', 'Sopocachi, edificio Illimani', 'Camila Rojas', '72345678', 'nuevo', 'pendiente', 'web', 'Pedido desde catálogo digital.', 210.00, 2, '2026-05-13 16:10:00'),
(4, 4, '2026-06-05', '09:30', 'Zona Sur, calle 21 de Calacoto', 'Andrea Salazar', '73456789', 'enviado', 'pagado', 'tienda', 'Detalle corporativo con tarjeta formal.', 320.00, 1, '2026-05-14 11:00:00');

INSERT IGNORE INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 1, 180.00),
(2, 1, 4, 1, 210.00),
(3, 2, 3, 1, 150.00),
(4, 3, 4, 1, 210.00),
(5, 4, 6, 1, 320.00);

INSERT IGNORE INTO payments (id, order_id, method, amount, status, reference_code, paid_at) VALUES
(1, 1, 'simulado', 390.00, 'confirmado', 'SIM-0001', '2026-05-12 10:03:00'),
(2, 2, 'simulado', 150.00, 'pendiente', 'SIM-0002', NULL),
(3, 3, 'simulado', 210.00, 'pendiente', 'SIM-0003', NULL),
(4, 4, 'qr', 320.00, 'confirmado', 'QR-4421', '2026-05-14 11:04:00');

INSERT IGNORE INTO key_dates (id, title, event_date, description, alert_days_before, priority) VALUES
(1, 'Día de la Madre', '2026-05-27', 'Pico de demanda para ramos, canastas y detalles personalizados.', 10, 'alta'),
(2, 'Día de las Flores Amarillas', '2026-09-21', 'Campaña digital para flores amarillas y mensajes virales.', 14, 'alta'),
(3, 'Navidad', '2026-12-25', 'Arreglos navideños y regalos corporativos.', 20, 'media'),
(4, 'San Valentín', '2027-02-14', 'Ramos románticos y mensajes personalizados.', 20, 'alta');

INSERT IGNORE INTO campaigns (id, key_date_id, title, channel, message, status, scheduled_at) VALUES
(1, 1, 'Promo Mamá Aleslí', 'WhatsApp', 'Hola {{nombre}}, tenemos arreglos especiales para el Día de la Madre. ¿Deseas reservar?', 'programada', '2026-05-17 09:00:00'),
(2, 2, 'Flores Amarillas 2026', 'WhatsApp', 'Celebra con flores amarillas de Aleslí. Reserva tu ramo con anticipación.', 'borrador', NULL),
(3, 3, 'Navidad Naturalmente', 'WhatsApp', 'Tenemos arreglos navideños y detalles corporativos para diciembre.', 'borrador', NULL);

INSERT IGNORE INTO message_templates (id, name, intent, body, active) VALUES
(1, 'Confirmación de pedido', 'confirmacion_pedido', 'Hola {{nombre}}, tu pedido #{{pedido}} fue confirmado para el {{fecha}}.', TRUE),
(2, 'Catálogo y precios', 'catalogo', 'Puedes revisar nuestro catálogo digital con ramos, arreglos y detalles desde la web.', TRUE),
(3, 'Recordatorio fecha clave', 'recordatorio', 'Se acerca {{fecha_clave}}. Podemos ayudarte a reservar con anticipación.', TRUE);

INSERT IGNORE INTO whatsapp_messages (id, customer_id, order_id, direction, message, status, created_at) VALUES
(1, 1, 1, 'salida', 'Pedido confirmado en modo demostrativo.', 'demo', '2026-05-12 10:04:00'),
(2, 2, 2, 'entrada', 'Hola, quiero un detalle para el Día de la Madre.', 'demo', '2026-05-13 09:22:00'),
(3, 2, 2, 'salida', 'Claro, tenemos detalles desde Bs 150.', 'demo', '2026-05-13 09:23:00');

INSERT IGNORE INTO agent_logs (id, customer_id, intent, input_text, output_text, response_time_ms, created_at) VALUES
(1, 2, 'catalogo', '¿Tienen catálogo y precios?', 'Tenemos opciones desde Bs 150 en ramos, arreglos y detalles.', 420, '2026-05-13 09:23:00'),
(2, 1, 'confirmacion_pedido', 'Confirmar mi pedido', 'Pedido confirmado en modo demostrativo.', 390, '2026-05-12 10:04:00');

INSERT IGNORE INTO expenses (id, concept, category, amount, expense_date) VALUES
(1, 'Compra de rosas y follaje', 'Insumos', 420.00, '2026-05-11'),
(2, 'Transporte de entregas', 'Logística', 85.00, '2026-05-12'),
(3, 'Material de empaquetado', 'Insumos', 110.00, '2026-05-13'),
(4, 'Publicidad campaña Día de la Madre', 'Marketing', 160.00, '2026-05-14');
