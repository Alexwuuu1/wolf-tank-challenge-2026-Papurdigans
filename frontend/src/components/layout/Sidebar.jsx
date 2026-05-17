import { LogOut } from 'lucide-react';
import logoAlesli from '../../assets/logoalesli.jpg';

export function Sidebar({ tabs, active, onChange, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brandMark">
        <img className="brandLogo" src={logoAlesli} alt="Logo Floreria Alesli" />
        <div>
          <strong>Alesli</strong>
          <span>Naturalmente para ti</span>
        </div>
      </div>
      <nav>
        {tabs.map(([key, label, Icon]) => (
          <button className={active === key ? 'active' : ''} onClick={() => onChange(key)} key={key}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>
      <button className="logout" onClick={onLogout}>
        <LogOut size={18} />
        Salir
      </button>
    </aside>
  );
}
