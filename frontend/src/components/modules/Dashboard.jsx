import { BarChart3, CheckCircle2, ShoppingBag, UsersRound } from 'lucide-react';
import { Stat } from '../ui/Stat';

export function Dashboard({ data }) {
  return (
    <section className="gridSection">
      <Stat icon={ShoppingBag} label="Pedidos totales" value={data?.totalOrders || 0} />
      <Stat icon={CheckCircle2} label="Pedidos activos" value={data?.activeOrders || 0} />
      <Stat icon={UsersRound} label="Clientes frecuentes" value={data?.totalCustomers || 0} />
      <Stat icon={BarChart3} label="Ingresos registrados" value={`Bs ${Number(data?.revenue || 0).toFixed(0)}`} />
    </section>
  );
}
