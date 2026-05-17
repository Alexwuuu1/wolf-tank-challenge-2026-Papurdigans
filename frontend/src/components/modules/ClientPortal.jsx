import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Facebook,
  Globe,
  HeartHandshake,
  Instagram,
  LogOut,
  MapPin,
  MessageCircle,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X
} from 'lucide-react';
import logoAlesli from '../../assets/logoalesli.jpg';
import { buildMapEmbedUrl, buildMapLink } from '../../utils/maps';

const emptyCustomer = {
  name: 'Cliente Demo Alesli',
  phone: '70000001',
  email: 'cliente@alesli.bo',
  preferences: ''
};

export function ClientPortal({ api, products, user, onLogout }) {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(emptyCustomer);
  const [deliveryDate, setDeliveryDate] = useState('2026-05-27');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [view, setView] = useState('inicio');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const activeProducts = useMemo(() => products.filter(product => product.active), [products]);
  const filtered = activeProducts.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase()));
  const featured = activeProducts.slice(0, 3);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  function addToCart(product) {
    setCart(current => {
      const existing = current.find(item => item.productId === product.id);
      if (existing) {
        return current.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { productId: product.id, name: product.name, price: Number(product.price), quantity: 1 }];
    });
    setMessage('');
    setCreatedOrder(null);
  }

  function updateQuantity(productId, change) {
    setCart(current => current
      .map(item => item.productId === productId ? { ...item, quantity: item.quantity + change } : item)
      .filter(item => item.quantity > 0));
    setCreatedOrder(null);
  }

  function removeFromCart(productId) {
    setCart(current => current.filter(item => item.productId !== productId));
    setCreatedOrder(null);
  }

  function continueShopping() {
    setCreatedOrder(null);
    setMessage('');
    setSearch('');
    setView('catalogo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToView(nextView) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submitOrder(event) {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const order = await api.request('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customer,
          deliveryDate,
          deliveryAddress,
          notes,
          items: cart
        })
      });
      setCreatedOrder({ id: order.id, total: Number(order.total), deliveryDate });
      setCart([]);
      setDeliveryAddress('');
      setNotes('');
      setMessage('');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="clientShell">
      <header className="clientNav">
        <div className="clientBrand">
          <img src={logoAlesli} alt="Logo Floreria Alesli" />
          <div>
            <span>Floreria Alesli</span>
            <strong>Naturalmente para ti</strong>
          </div>
        </div>
        <nav>
          {[
            ['inicio', 'Inicio'],
            ['catalogo', 'Catalogo'],
            ['pedido', 'Pedido'],
            ['fechas', 'Fechas'],
            ['como', 'Como funciona'],
            ['contacto', 'Contacto']
          ].map(([key, label]) => (
            <button className={view === key ? 'active' : ''} type="button" onClick={() => goToView(key)} key={key}>
              {label}
            </button>
          ))}
        </nav>
        <div className="clientActions">
          <strong>{user.name}<span>Cliente conectado</span></strong>
          <b>{cart.length} en pedido</b>
          <button type="button" className="secondaryButton" onClick={onLogout}>
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </header>

      {view === 'inicio' && <section className="clientHero">
        <div className="clientHeroCopy">
          <span><Sparkles size={16} /> Arreglos florales con detalle</span>
          <h1>Flores para celebrar, agradecer y sorprender.</h1>
          <p>Alesli ayuda a elegir arreglos, reservar pedidos y coordinar entregas especiales con confirmacion por WhatsApp.</p>
          <div className="heroActions">
            <button type="button" onClick={() => goToView('catalogo')}>
              <ShoppingBag size={18} />
              Ver catalogo
            </button>
            <button type="button" className="secondaryButton" onClick={() => goToView('pedido')}>
              <PackageCheck size={18} />
              Hacer pedido
            </button>
          </div>
          <div className="clientBenefits">
            <span><Truck size={17} /> Entrega programada</span>
            <span><MessageCircle size={17} /> Confirmacion WhatsApp</span>
            <span><HeartHandshake size={17} /> Dedicatorias personalizadas</span>
          </div>
        </div>
        <div className="heroShowcase">
          {featured.map(product => (
            <article key={product.id}>
              <img src={product.imageUrl} alt={product.name} />
              <span>{product.category}</span>
              <strong>{product.name}</strong>
            </article>
          ))}
        </div>
      </section>}

      {view === 'catalogo' && <section className="clientSection">
        <div className="sectionHeading">
          <span>Catalogo</span>
          <h2>Elige el detalle ideal</h2>
          <p>Productos disponibles para reservar en modo prototipo.</p>
        </div>
        <div className="module">
          <div className="moduleHeader">
            <div>
              <h2>Flores y detalles</h2>
              <p>Busca por ramo, arreglo o categoria.</p>
            </div>
            <label className="searchBox">
              <Search size={18} />
              <input placeholder="Buscar ramo o detalle" value={search} onChange={event => setSearch(event.target.value)} />
            </label>
          </div>
          <div className="catalogGrid clientCatalog">
            {filtered.map(product => (
              <article className="productCard" key={product.id}>
                <img src={product.imageUrl} alt={product.name} />
                <div>
                  <span className="tag">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <footer>
                    <strong>Bs {Number(product.price).toFixed(0)}</strong>
            <button type="button" onClick={() => addToCart(product)}>
                      <ShoppingBag size={17} />
                      Pedir
                    </button>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>}

      {view === 'pedido' && <section className="clientSection orderWebSection">
        <div className="sectionHeading">
          <span>Pedido</span>
          <h2>Reserva en pocos pasos</h2>
          <p>Selecciona productos, completa la entrega y recibe confirmacion por WhatsApp.</p>
        </div>
        <form className="module clientOrder checkoutCard" onSubmit={submitOrder}>
          <div className="moduleHeader">
            <div>
              <h2>Tu pedido</h2>
              <p>Simula la reserva como cliente.</p>
            </div>
          </div>

          <div className="checkoutProgress">
            <span className={cart.length ? 'done' : ''}>1. Productos</span>
            <span className={deliveryAddress ? 'done' : ''}>2. Entrega</span>
            <span className={createdOrder ? 'done' : ''}>3. Confirmacion</span>
          </div>

          {createdOrder && (
            <aside className="orderConfirmation">
              <CheckCircle2 size={28} />
              <div>
                <span>Pedido registrado</span>
                <strong>#{createdOrder.id} - Bs {createdOrder.total.toFixed(0)}</strong>
                <p>Alesli confirmara disponibilidad y entrega por WhatsApp.</p>
              </div>
              <button type="button" className="secondaryButton" onClick={continueShopping}>
                <RotateCcw size={17} />
                Seguir comprando
              </button>
            </aside>
          )}

          <section className="checkoutBlock">
            <div className="checkoutBlockHeader">
              <div>
                <strong>Productos seleccionados</strong>
                <span>{cart.length ? 'Revisa cantidades antes de confirmar.' : 'Abre el catalogo y elige tus flores.'}</span>
              </div>
              <button type="button" className="secondaryButton" onClick={() => setPickerOpen(true)}>
                <ShoppingBag size={17} />
                Agregar productos
              </button>
            </div>

          <div className="cartList">
            {cart.length === 0 && (
              <p className="emptyState">Aun no agregaste productos. Usa el boton Agregar productos para abrir el catalogo.</p>
            )}
            {cart.map(item => (
              <div key={item.productId}>
                <span>
                  {item.name}
                  <small>Bs {Number(item.price).toFixed(0)} c/u</small>
                </span>
                <div>
                  <button type="button" title="Restar" onClick={() => updateQuantity(item.productId, -1)}>
                    <Minus size={15} />
                  </button>
                  <strong>{item.quantity}</strong>
                  <button type="button" title="Sumar" onClick={() => updateQuantity(item.productId, 1)}>
                    <Plus size={15} />
                  </button>
                </div>
                <b>Bs {(Number(item.price) * Number(item.quantity)).toFixed(0)}</b>
                <button type="button" className="removeCartItem" title="Quitar producto" onClick={() => removeFromCart(item.productId)}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          </section>

          <section className="checkoutBlock">
            <div className="checkoutBlockHeader">
              <div>
                <strong>Datos para coordinar entrega</strong>
                <span>Alesli usara estos datos para confirmar por WhatsApp.</span>
              </div>
            </div>

          <input required placeholder="Tu nombre" value={customer.name} onChange={event => setCustomer({ ...customer, name: event.target.value })} />
          <input required placeholder="WhatsApp" value={customer.phone} onChange={event => setCustomer({ ...customer, phone: event.target.value })} />
          <input type="date" required value={deliveryDate} onChange={event => setDeliveryDate(event.target.value)} />
          <label className="mapField">
            <span>Direccion de entrega en La Paz</span>
            <input required placeholder="Ej: Av. Arce, Sopocachi, Miraflores..." value={deliveryAddress} onChange={event => setDeliveryAddress(event.target.value)} />
          </label>
          <div className="mapPreview">
            <div>
              <MapPin size={18} />
              <span>{deliveryAddress || 'Vista previa de La Paz hasta escribir una direccion'}</span>
            </div>
            <iframe title="Ubicacion de entrega en Maps" src={buildMapEmbedUrl(deliveryAddress)} loading="lazy" />
            <a href={buildMapLink(deliveryAddress)} target="_blank" rel="noreferrer">
              Abrir ubicacion en Google Maps
            </a>
          </div>
          <textarea placeholder="Dedicatoria o preferencias" value={notes} onChange={event => setNotes(event.target.value)} />
          </section>

          <div className="clientSummary">
            <span>{cart.length} producto{cart.length === 1 ? '' : 's'} en carrito</span>
            <strong>Total estimado: Bs {total.toFixed(0)}</strong>
            <small>Pago y disponibilidad quedan en modo demostrativo.</small>
          </div>
          {message && <p className={message.includes('registrado') ? 'success' : 'error'}>{message}</p>}
          <button type="submit" disabled={!cart.length || saving}>
            <PackageCheck size={18} />
            Confirmar pedido demo
          </button>
        </form>
      </section>}

      {pickerOpen && (
        <div className="catalogPicker" role="dialog" aria-modal="true" aria-label="Catalogo para pedido">
          <div className="catalogPickerPanel">
            <div className="moduleHeader">
              <div>
                <h2>Catalogo para pedir</h2>
                <p>Agrega productos sin salir de tu ficha de pedido.</p>
              </div>
              <button type="button" className="secondaryButton" onClick={() => setPickerOpen(false)}>
                <X size={18} />
                Cerrar
              </button>
            </div>
            <label className="searchBox pickerSearch">
              <Search size={18} />
              <input placeholder="Buscar flores, detalles o categoria" value={search} onChange={event => setSearch(event.target.value)} />
            </label>
            <div className="pickerGrid">
              {filtered.map(product => (
                <article key={product.id}>
                  <img src={product.imageUrl} alt={product.name} />
                  <div>
                    <span className="tag">{product.category}</span>
                    <strong>{product.name}</strong>
                    <p>{product.description}</p>
                    <footer>
                      <b>Bs {Number(product.price).toFixed(0)}</b>
                      <button type="button" onClick={() => addToCart(product)}>
                        <Plus size={17} />
                        Pedir
                      </button>
                    </footer>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'fechas' && <section className="clientSection">
        <div className="sectionHeading">
          <span>Fechas especiales</span>
          <h2>Reserva antes de los dias de alta demanda</h2>
          <p>Alesli organiza campanas para que no falte el detalle en momentos importantes.</p>
        </div>
        <div className="occasionGrid">
          {[
            ['Dia de la Madre', 'Ramos y canastas para reservar con anticipacion.', '27 mayo'],
            ['Flores amarillas', 'Detalles virales y arreglos con tonos luminosos.', '21 septiembre'],
            ['San Valentin', 'Rosas, dedicatorias y entregas romanticas.', '14 febrero'],
            ['Navidad', 'Arreglos navidenos y regalos corporativos.', '25 diciembre']
          ].map(([title, text, date]) => (
            <article key={title}>
              <CalendarDays size={22} />
              <span>{date}</span>
              <strong>{title}</strong>
              <p>{text}</p>
              <button type="button" className="secondaryButton" onClick={() => goToView('catalogo')}>
                Ver opciones
              </button>
            </article>
          ))}
        </div>
      </section>}

      {view === 'como' && <section className="clientSection howSection">
        <div className="sectionHeading">
          <span>Como funciona</span>
          <h2>Del catalogo a la entrega</h2>
        </div>
        <div className="stepsGrid">
          {[
            ['1', 'Elige tus flores', 'Agrega al pedido los productos que quieres reservar.'],
            ['2', 'Completa la entrega', 'Indica fecha, direccion y dedicatoria especial.'],
            ['3', 'Confirmacion', 'Alesli valida disponibilidad y coordina por WhatsApp.'],
            ['4', 'Preparacion', 'El equipo prepara el arreglo y actualiza el estado del pedido.']
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>}

      {view === 'contacto' && <section className="clientSection contactSection">
        <div>
          <span>Contacto</span>
          <h2>Atencion cercana para cada ocasion</h2>
          <p>Este prototipo simula la coordinacion comercial de Floreria Alesli con pedidos web y confirmacion por WhatsApp.</p>
        </div>
        <div className="contactCards">
          <article><Phone size={20} /><strong>WhatsApp demo</strong><span>70000001</span></article>
          <article><MapPin size={20} /><strong>Zona de entrega</strong><span>La Paz y alrededores</span></article>
          <article><Clock3 size={20} /><strong>Horario</strong><span>Lunes a sabado</span></article>
        </div>
      </section>}

      <footer className="clientFooter">
        <div>
          <img src={logoAlesli} alt="Logo Floreria Alesli" />
          <span>Floreria Alesli</span>
          <p>Prototipo web para pedidos florales, clientes frecuentes y confirmacion por WhatsApp.</p>
        </div>
        <nav aria-label="Redes sociales">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram size={18} /> Instagram</a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><Facebook size={18} /> Facebook</a>
          <a href="https://wa.me/59170000001" target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
          <a href="https://alesli.demo" target="_blank" rel="noreferrer"><Globe size={18} /> Web</a>
        </nav>
      </footer>
    </main>
  );
}
