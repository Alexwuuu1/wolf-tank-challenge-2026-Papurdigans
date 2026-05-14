import { useState } from 'react';
import { Ban, Edit3, Eye, PackagePlus, Save, Trash2, X } from 'lucide-react';
import { orderStatuses } from '../../constants/orderStatuses';

const emptyOrder = {
  id: null,
  customer: { name: '', phone: '', email: '', preferences: '' },
  deliveryDate: '2026-05-27',
  deliveryAddress: '',
  notes: '',
  status: 'nuevo',
  items: []
};

function normalizeDetail(order) {
  return {
    id: order.id,
    customer: {
      name: order.customer,
      phone: order.phone,
      email: order.email || '',
      preferences: order.preferences || ''
    },
    deliveryDate: order.deliveryDate?.slice(0, 10),
    deliveryAddress: order.deliveryAddress,
    notes: order.notes || '',
    status: order.status,
    items: order.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      name: item.name,
      price: Number(item.unitPrice)
    }))
  };
}

export function Orders({ api, orders, products, reload }) {
  const [draft, setDraft] = useState(emptyOrder);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function addProduct(product) {
    if (!product) return;
    setDraft(current => {
      const existing = current.items.find(item => item.productId === product.id);
      const items = existing
        ? current.items.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current.items, { productId: product.id, quantity: 1, name: product.name, price: Number(product.price) }];
      return { ...current, items };
    });
  }

  function removeProduct(productId) {
    setDraft(current => ({ ...current, items: current.items.filter(item => item.productId !== productId) }));
  }

  async function loadDetail(orderId, mode = 'view') {
    const detail = await api.request(`/orders/${orderId}`);
    setSelected(detail);
    if (mode === 'edit') setDraft(normalizeDetail(detail));
  }

  async function saveOrder(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.request(draft.id ? `/orders/${draft.id}` : '/orders', {
        method: draft.id ? 'PUT' : 'POST',
        body: JSON.stringify(draft)
      });
      setDraft(emptyOrder);
      setSelected(null);
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id, status) {
    await api.request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    await reload();
  }

  async function cancelOrder(id) {
    await api.request(`/orders/${id}/cancel`, { method: 'PATCH' });
    setSelected(null);
    await reload();
  }

  const draftTotal = draft.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  return (
    <section className="split">
      <div className="module">
        <div className="moduleHeader">
          <div>
            <h2>Pedidos activos</h2>
            <p>Estados, destinos y detalle de productos.</p>
          </div>
        </div>
        <div className="tableList">
          {orders.map(order => (
            <article className="orderRow orderRowActions" key={order.id}>
              <div>
                <strong>#{order.id} {order.customer}</strong>
                <span>{order.deliveryDate?.slice(0, 10)} - {order.deliveryAddress}</span>
              </div>
              <select value={order.status} onChange={event => updateStatus(order.id, event.target.value)}>
                {orderStatuses.map(status => <option key={status}>{status}</option>)}
              </select>
              <b>Bs {Number(order.total).toFixed(0)}</b>
              <div className="rowActions">
                <button type="button" title="Ver detalle" onClick={() => loadDetail(order.id)}>
                  <Eye size={17} />
                </button>
                <button type="button" title="Editar pedido" onClick={() => loadDetail(order.id, 'edit')}>
                  <Edit3 size={17} />
                </button>
                <button type="button" title="Cancelar pedido" onClick={() => cancelOrder(order.id)}>
                  <Ban size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {selected && (
          <aside className="detailPanel">
            <div className="moduleHeader">
              <div>
                <h2>Detalle #{selected.id}</h2>
                <p>{selected.customer} - {selected.status}</p>
              </div>
              <button type="button" className="secondaryButton" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="detailList">
              {selected.items.map(item => (
                <div key={item.id}>
                  <span>{item.name} x{item.quantity}</span>
                  <strong>Bs {Number(item.subtotal).toFixed(0)}</strong>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      <form className="module orderForm" onSubmit={saveOrder}>
        <div className="moduleHeader">
          <div>
            <h2>{draft.id ? `Editar pedido #${draft.id}` : 'Nuevo pedido'}</h2>
            <p>Registro centralizado con cliente y productos.</p>
          </div>
        </div>
        <div className="formGrid">
          <input required placeholder="Cliente" value={draft.customer.name} onChange={event => setDraft({ ...draft, customer: { ...draft.customer, name: event.target.value } })} />
          <input required placeholder="WhatsApp" value={draft.customer.phone} onChange={event => setDraft({ ...draft, customer: { ...draft.customer, phone: event.target.value } })} />
          <input type="date" required value={draft.deliveryDate} onChange={event => setDraft({ ...draft, deliveryDate: event.target.value })} />
          <input required placeholder="Direccion de entrega" value={draft.deliveryAddress} onChange={event => setDraft({ ...draft, deliveryAddress: event.target.value })} />
        </div>
        {draft.id && (
          <select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value })}>
            {orderStatuses.map(status => <option key={status}>{status}</option>)}
          </select>
        )}
        <textarea placeholder="Preferencias o dedicatoria" value={draft.notes} onChange={event => setDraft({ ...draft, notes: event.target.value })} />
        <select onChange={event => addProduct(products.find(product => product.id === Number(event.target.value)))} value="">
          <option value="" disabled>Agregar producto</option>
          {products.filter(product => product.active).map(product => <option value={product.id} key={product.id}>{product.name}</option>)}
        </select>
        <div className="orderItemsEditor">
          {draft.items.map(item => (
            <div key={item.productId}>
              <span>{item.name}</span>
              <input type="number" min="1" value={item.quantity} onChange={event => setDraft(current => ({
                ...current,
                items: current.items.map(row => row.productId === item.productId ? { ...row, quantity: Number(event.target.value) } : row)
              }))} />
              <strong>Bs {(Number(item.price) * Number(item.quantity)).toFixed(0)}</strong>
              <button type="button" title="Quitar producto" onClick={() => removeProduct(item.productId)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <p className="totalLine">Total: Bs {draftTotal.toFixed(0)}</p>
        {error && <p className="error">{error}</p>}
        <div className="formActions">
          <button type="submit" disabled={!draft.items.length || saving}>
            {draft.id ? <Save size={18} /> : <PackagePlus size={18} />}
            {draft.id ? 'Guardar pedido' : 'Crear pedido simulado'}
          </button>
          {draft.id && (
            <button type="button" className="secondaryButton" onClick={() => setDraft(emptyOrder)}>
              <X size={18} />
              Cancelar edicion
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
