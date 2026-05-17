import { BarChart3, Bot, CalendarDays, CheckCircle2, Flower2, ShoppingBag, UsersRound } from 'lucide-react';
import { Stat } from '../ui/Stat';

const modules = [
  { icon: Flower2, title: 'Catalogo digital', text: 'Productos con imagen, precio, descripcion y administracion basica.' },
  { icon: ShoppingBag, title: 'Pedidos', text: 'Registro centralizado, estados, detalle de productos y cancelacion.' },
  { icon: UsersRound, title: 'Clientes frecuentes', text: 'Historial, preferencias y datos de contacto para fidelizacion.' },
  { icon: CalendarDays, title: 'Fechas clave', text: 'Calendario floral para anticipar campanas y demanda.' },
  { icon: BarChart3, title: 'Reportes', text: 'Ingresos, gastos, utilidad e ingresos por categoria.' },
  { icon: Bot, title: 'Agente demo', text: 'Respuestas demostrativas para catalogo, pedidos y recordatorios.' }
];

export function Dashboard({ data }) {
  return (
    <>
      <section className="gridSection">
        <Stat icon={ShoppingBag} label="Pedidos totales" value={data?.totalOrders || 0} />
        <Stat icon={CheckCircle2} label="Pedidos activos" value={data?.activeOrders || 0} />
        <Stat icon={UsersRound} label="Clientes frecuentes" value={data?.totalCustomers || 0} />
        <Stat icon={BarChart3} label="Ingresos registrados" value={`Bs ${Number(data?.revenue || 0).toFixed(0)}`} />
      </section>
      <section className="module demoProgress">
        <div className="moduleHeader">
          <div>
            <h2>Avance funcional del prototipo</h2>
            <p>Resumen rapido para presentacion y video de entrega.</p>
          </div>
          <strong>Prototipo inicial</strong>
        </div>
        <div className="progressGrid">
          {modules.map(item => (
            <article key={item.title}>
              <item.icon size={20} />
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
