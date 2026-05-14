import { CalendarDays } from 'lucide-react';

export function CalendarCampaigns({ dates }) {
  return (
    <section className="module">
      <div className="moduleHeader">
        <div>
          <h2>Fechas clave y campanas</h2>
          <p>Alertas para anticipar demanda floral.</p>
        </div>
      </div>
      <div className="timeline">
        {dates.map(date => (
          <article key={date.id}>
            <CalendarDays size={20} />
            <div>
              <strong>{date.title}</strong>
              <span>{date.eventDate?.slice(0, 10)} - alerta {date.alertDaysBefore} dias antes</span>
              <p>{date.campaignTitle || 'Sin campana vinculada'} - {date.campaignStatus || 'pendiente'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
