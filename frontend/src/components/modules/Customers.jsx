import { useState } from 'react';
import { Edit3, Power, Save, UserPlus, X } from 'lucide-react';

const emptyCustomer = {
  id: null,
  name: '',
  phone: '',
  email: '',
  preferences: ''
};

export function Customers({ api, customers, reload }) {
  const [draft, setDraft] = useState(emptyCustomer);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
        </div>
        <div className="customerGrid">
          {customers.map(customer => (
            <article className="customerCard liftCard" key={customer.id}>
              <strong>{customer.name}</strong>
              <span>{customer.phone} - {customer.totalOrders} pedidos</span>
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

      <form className="module productForm" onSubmit={saveCustomer}>
        <div className="moduleHeader">
          <div>
            <h2>{draft.id ? 'Editar cliente' : 'Nuevo cliente'}</h2>
            <p>Registra preferencias para fidelizacion.</p>
          </div>
        </div>
        <input required placeholder="Nombre completo" value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} />
        <input required placeholder="WhatsApp" value={draft.phone} onChange={event => setDraft({ ...draft, phone: event.target.value })} />
        <input type="email" placeholder="Correo" value={draft.email} onChange={event => setDraft({ ...draft, email: event.target.value })} />
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
