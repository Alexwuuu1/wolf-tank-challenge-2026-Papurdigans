import { BarChart3, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Stat } from '../ui/Stat';

export function Reports({ report }) {
  const max = Math.max(...(report?.byCategory || []).map(item => Number(item.revenue)), 1);
  return (
    <section className="module">
      <div className="moduleHeader">
        <div>
          <h2>Reportes financieros</h2>
          <p>Ventas, ingresos por categoria y resumen economico.</p>
        </div>
      </div>
      <div className="reportSummary">
        <Stat icon={BarChart3} label="Ingresos" value={`Bs ${Number(report?.summary?.income || 0).toFixed(0)}`} />
        <Stat icon={ShoppingBag} label="Gastos" value={`Bs ${Number(report?.summary?.expenses || 0).toFixed(0)}`} />
        <Stat icon={CheckCircle2} label="Utilidad demo" value={`Bs ${Number(report?.summary?.profit || 0).toFixed(0)}`} />
      </div>
      <div className="bars">
        {(report?.byCategory || []).map(item => (
          <div className="barRow" key={item.category}>
            <span>{item.category}</span>
            <div><i style={{ width: `${(Number(item.revenue) / max) * 100}%` }} /></div>
            <b>Bs {Number(item.revenue).toFixed(0)}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
