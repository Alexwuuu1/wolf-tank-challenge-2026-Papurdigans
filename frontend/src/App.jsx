import { useEffect, useState } from 'react';
import { BarChart3, CalendarDays, MessageCircle, ShoppingBag, UsersRound } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { Agent } from './components/modules/Agent';
import { CalendarCampaigns } from './components/modules/CalendarCampaigns';
import { Catalog } from './components/modules/Catalog';
import { Customers } from './components/modules/Customers';
import { Dashboard } from './components/modules/Dashboard';
import { Login } from './components/modules/Login';
import { Orders } from './components/modules/Orders';
import { Reports } from './components/modules/Reports';
import { useApi } from './hooks/useApi';
import { API_URL, publicRequest } from './services/apiClient';

export function App() {
  const saved = JSON.parse(localStorage.getItem('alesli-session') || 'null');
  const [session, setSession] = useState(saved);
  const [active, setActive] = useState('panel');
  const [state, setState] = useState({ products: [], categories: [], orders: [], customers: [], calendar: [], report: null, expenses: [], dashboard: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const api = useApi(session?.token);

  async function loadCatalogData() {
    const [products, categories] = await Promise.all([
      publicRequest('/products?includeInactive=true'),
      publicRequest('/categories')
    ]);
    setState(current => ({ ...current, products, categories }));
  }

  async function loadPrivateData() {
    if (!session?.token) return;
    setLoading(true);
    setError('');
    try {
      const [dashboard, orders, customers, calendar, report, expenses] = await Promise.all([
        api.request('/dashboard'),
        api.request('/orders'),
        api.request('/customers'),
        api.request('/calendar'),
        api.request('/reports/financial'),
        api.request('/expenses')
      ]);
      setState(current => ({ ...current, dashboard, orders, customers, calendar, report, expenses }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalogData();
  }, []);

  useEffect(() => {
    loadPrivateData();
  }, [session?.token]);

  function onLogin(data) {
    setSession(data);
    localStorage.setItem('alesli-session', JSON.stringify(data));
  }

  function logout() {
    localStorage.removeItem('alesli-session');
    setSession(null);
  }

  if (!session) return <Login onLogin={onLogin} apiUrl={API_URL} />;

  const tabs = [
    ['panel', 'Panel', BarChart3],
    ['pedidos', 'Pedidos', ShoppingBag],
    ['clientes', 'Clientes', UsersRound],
    ['calendario', 'Calendario', CalendarDays],
    ['reportes', 'Reportes', BarChart3],
    ['agente', 'Agente', MessageCircle]
  ];

  return (
    <main className="appShell">
      <Sidebar tabs={tabs} active={active} onChange={setActive} onLogout={logout} />
      <section className="content">
        <header className="topbar">
          <div>
            <span>Prototipo web con agentes inteligentes</span>
            <h1>Gestion comercial y administrativa</h1>
          </div>
          <b>{session.user.name}</b>
        </header>
        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Cargando informacion...</p>}
        {active === 'panel' && (
          <>
            <Dashboard data={state.dashboard} />
            <Catalog api={api} products={state.products} categories={state.categories} onAdd={() => setActive('pedidos')} onReload={loadCatalogData} />
          </>
        )}
        {active === 'pedidos' && <Orders api={api} orders={state.orders} products={state.products} reload={loadPrivateData} />}
        {active === 'clientes' && <Customers api={api} customers={state.customers} reload={loadPrivateData} />}
        {active === 'calendario' && <CalendarCampaigns dates={state.calendar} />}
        {active === 'reportes' && <Reports api={api} report={state.report} expenses={state.expenses} reload={loadPrivateData} />}
        {active === 'agente' && <Agent api={api} />}
      </section>
    </main>
  );
}
