import { useState } from 'react';
import { BarChart3, CheckCircle2, Edit3, Plus, Save, ShoppingBag, Trash2, X } from 'lucide-react';
import { Stat } from '../ui/Stat';

const emptyExpense = {
  id: null,
  concept: '',
  category: 'Operativo',
  amount: '',
  expenseDate: '2026-05-14'
};

export function Reports({ api, report, expenses, reload }) {
  const [draft, setDraft] = useState(emptyExpense);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const maxRevenue = Math.max(...(report?.byCategory || []).map(item => Number(item.revenue)), 1);
  const maxExpense = Math.max(...(report?.expensesByCategory || []).map(item => Number(item.amount)), 1);

  function editExpense(expense) {
    setDraft({
      id: expense.id,
      concept: expense.concept,
      category: expense.category,
      amount: expense.amount,
      expenseDate: expense.expenseDate?.slice(0, 10)
    });
    setError('');
  }

  async function saveExpense(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.request(draft.id ? `/expenses/${draft.id}` : '/expenses', {
        method: draft.id ? 'PUT' : 'POST',
        body: JSON.stringify({ ...draft, amount: Number(draft.amount) })
      });
      setDraft(emptyExpense);
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteExpense(id) {
    await api.request(`/expenses/${id}`, { method: 'DELETE' });
    await reload();
  }

  return (
    <section className="split">
      <div className="module">
        <div className="moduleHeader">
          <div>
            <h2>Reportes financieros</h2>
            <p>Ventas, gastos, utilidad y margen operativo.</p>
          </div>
        </div>
        <div className="reportSummary">
          <Stat icon={BarChart3} label="Ingresos" value={`Bs ${Number(report?.summary?.income || 0).toFixed(0)}`} />
          <Stat icon={ShoppingBag} label="Gastos" value={`Bs ${Number(report?.summary?.expenses || 0).toFixed(0)}`} />
          <Stat icon={CheckCircle2} label="Utilidad" value={`Bs ${Number(report?.summary?.profit || 0).toFixed(0)}`} />
          <Stat icon={BarChart3} label="Margen" value={`${Number(report?.summary?.margin || 0).toFixed(1)}%`} />
        </div>

        <div className="financeGrid">
          <div>
            <h3>Ingresos por categoria</h3>
            <div className="bars">
              {(report?.byCategory || []).map(item => (
                <div className="barRow" key={item.category}>
                  <span>{item.category}</span>
                  <div><i style={{ width: `${(Number(item.revenue) / maxRevenue) * 100}%` }} /></div>
                  <b>Bs {Number(item.revenue).toFixed(0)}</b>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Gastos por categoria</h3>
            <div className="bars expenseBars">
              {(report?.expensesByCategory || []).map(item => (
                <div className="barRow" key={item.category}>
                  <span>{item.category}</span>
                  <div><i style={{ width: `${(Number(item.amount) / maxExpense) * 100}%` }} /></div>
                  <b>Bs {Number(item.amount).toFixed(0)}</b>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="expenseTable">
          <div className="moduleHeader compactHeader">
            <div>
              <h2>Gastos registrados</h2>
              <p>Control administrativo para reportes.</p>
            </div>
          </div>
          {expenses.map(expense => (
            <article className="expenseRow" key={expense.id}>
              <div>
                <strong>{expense.concept}</strong>
                <span>{expense.category} - {expense.expenseDate?.slice(0, 10)}</span>
              </div>
              <b>Bs {Number(expense.amount).toFixed(0)}</b>
              <div className="rowActions">
                <button type="button" title="Editar gasto" onClick={() => editExpense(expense)}>
                  <Edit3 size={17} />
                </button>
                <button type="button" title="Eliminar gasto" onClick={() => deleteExpense(expense.id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <form className="module productForm" onSubmit={saveExpense}>
        <div className="moduleHeader">
          <div>
            <h2>{draft.id ? 'Editar gasto' : 'Nuevo gasto'}</h2>
            <p>Registra costos operativos, marketing o logistica.</p>
          </div>
        </div>
        <input required placeholder="Concepto" value={draft.concept} onChange={event => setDraft({ ...draft, concept: event.target.value })} />
        <select value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })}>
          <option>Operativo</option>
          <option>Insumos</option>
          <option>Logistica</option>
          <option>Marketing</option>
          <option>Administrativo</option>
        </select>
        <input required type="number" min="1" step="0.01" placeholder="Monto en Bs" value={draft.amount} onChange={event => setDraft({ ...draft, amount: event.target.value })} />
        <input required type="date" value={draft.expenseDate} onChange={event => setDraft({ ...draft, expenseDate: event.target.value })} />
        {error && <p className="error">{error}</p>}
        <div className="formActions">
          <button type="submit" disabled={saving}>
            {draft.id ? <Save size={18} /> : <Plus size={18} />}
            {draft.id ? 'Guardar gasto' : 'Crear gasto'}
          </button>
          {draft.id && (
            <button type="button" className="secondaryButton" onClick={() => setDraft(emptyExpense)}>
              <X size={18} />
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
