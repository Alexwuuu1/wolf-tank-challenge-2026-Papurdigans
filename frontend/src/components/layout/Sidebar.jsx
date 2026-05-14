import { Flower2, LogOut } from 'lucide-react';

export function Sidebar({ tabs, active, onChange, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brandMark">
        <Flower2 size={30} />
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
