import { useState } from 'react';
import { Edit3, Mail, Phone, Power, Save, Search, ShoppingBag, UserPlus, UsersRound, X } from 'lucide-react';

const emptyCustomer = {
  id: null,
  name: '',
  phone: '',
  email: '',
  preferences: ''
};

export function Customers({ api, customers, reload }) {
  const [draft, setDraft] = useState(emptyCustomer);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const filtered = customers.filter(customer => `${customer.name} ${customer.phone} ${customer.email || ''} ${customer.preferences || ''}`.toLowerCase().includes(search.toLowerCase()));
  const totalOrders = customers.reduce((sum, customer) => sum + Number(customer.totalOrders || 0), 0);
  const frequentCustomers = customers.filter(customer => Number(customer.totalOrders || 0) >= 2).length;

  function editCustomer(customer) {
    setDraft({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      preferences: customer.preferences || ''
    });
    setError('');
  }

  async function saveCustomer(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.request(draft.id ? `/customers/${draft.id}` : '/customers', {
        method: draft.id ? 'PUT' : 'POST',
        body: JSON.stringify(draft)
      });
      setDraft(emptyCustomer);
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deactivateCustomer(customer) {
    await api.request(`/customers/${customer.id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ active: false })
    });
    await reload();
  }

  return (
    <section className="split">
      <div className="module">
        <div className="moduleHeader">
          <div>
            <h2>Clientes frecuentes</h2>
            <p>Historial, recurrencia y preferencias de compra.</p>
          </div>
          <label className="searchBox">
            <Search size={18} />
            <input placeholder="Buscar cliente, WhatsApp o preferencia" value={search} onChange={event => setSearch(event.target.value)} />
          </label>
        </div>
        <div className="customerStats">
          <article><UsersRound size={20} /><strong>{customers.length}</strong><span>clientes activos</span></article>
          <article><ShoppingBag size={20} /><strong>{totalOrders}</strong><span>pedidos acumulados</span></article>
          <article><UserPlus size={20} /><strong>{frequentCustomers}</strong><span>clientes recurrentes</span></article>
        </div>
        <div className="customerGrid">
          {filtered.map(customer => (
            <article className="customerCard liftCard" key={customer.id}>
              <div className="customerAvatar">{customer.name.slice(0, 1).toUpperCase()}</div>
              <strong>{customer.name}</strong>
              <span><Phone size={14} /> {customer.phone}</span>
              {customer.email && <span><Mail size={14} /> {customer.email}</span>}
              <span><ShoppingBag size={14} /> {customer.totalOrders} pedidos registrados</span>
              <p>{customer.preferences || 'Sin preferencias registradas.'}</p>
              <div className="cardActions">
                <button type="button" title="Editar cliente" onClick={() => editCustomer(customer)}>
                  <Edit3 size={17} />
                </button>
                <button type="button" title="Desactivar cliente" onClick={() => deactivateCustomer(customer)}>
                  <Power size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <form className="module productForm customerForm" onSubmit={saveCustomer}>
        <div className="moduleHeader">
          <div>
            <h2>{draft.id ? 'Editar cliente' : 'Nuevo cliente'}</h2>
            <p>Registra preferencias para fidelizacion.</p>
          </div>
        </div>
        <div className="customerFormIntro">
          <UserPlus size={22} />
          <div>
            <strong>{draft.id ? 'Actualizando perfil' : 'Alta manual desde administracion'}</strong>
            <span>Los clientes tambien pueden crear cuenta desde el login publico.</span>
          </div>
        </div>
        <label>Nombre completo<input required placeholder="Ej: Laura Perez" value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></label>
        <label>WhatsApp<input required placeholder="Ej: 70123456" value={draft.phone} onChange={event => setDraft({ ...draft, phone: event.target.value })} /></label>
        <label>Correo<input type="email" placeholder="cliente@email.com" value={draft.email} onChange={event => setDraft({ ...draft, email: event.target.value })} /></label>
        <label>Preferencias</label>
        <textarea placeholder="Preferencias del cliente" value={draft.preferences} onChange={event => setDraft({ ...draft, preferences: event.target.value })} />
        {error && <p className="error">{error}</p>}
        <div className="formActions">
          <button type="submit" disabled={saving}>
            {draft.id ? <Save size={18} /> : <UserPlus size={18} />}
            {draft.id ? 'Guardar cliente' : 'Crear cliente'}
          </button>
          {draft.id && (
            <button type="button" className="secondaryButton" onClick={() => setDraft(emptyCustomer)}>
              <X size={18} />
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
