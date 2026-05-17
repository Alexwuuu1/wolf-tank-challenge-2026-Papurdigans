import { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import logoAlesli from '../../assets/logoalesli.jpg';
import { API_URL } from '../../services/apiClient';

export function Login({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@alesli.bo', password: 'alesli2026', remember: true });
  const [registerForm, setRegisterForm] = useState({ name: '', phone: '', email: '', password: '', preferences: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('login');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function register(event) {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="loginShell">
      <section className="loginExperience">
        <div className="loginArtwork" aria-hidden="true">
          <div className="floatingPetal petalOne" />
          <div className="floatingPetal petalTwo" />
          <div className="floatingPetal petalThree" />
          <div className="artworkBadge">
            <Sparkles size={18} />
            Naturalmente para ti
          </div>
          <img className="bouquetMark" src={logoAlesli} alt="" />
          <h1>Alesli</h1>
          <p>Gestion elegante para pedidos, clientes frecuentes y arreglos florales hechos con carino.</p>
        </div>
        <div className="loginPanel">
          <div className="brandMark loginBrand">
            <img className="brandLogo" src={logoAlesli} alt="Logo Floreria Alesli" />
            <div>
              <strong>Floreria Alesli</strong>
              <span>PAPURDIGANS</span>
            </div>
          </div>
          <div className="loginCopy">
            <h2>{mode === 'login' ? 'Bienvenida' : 'Crea tu cuenta'}</h2>
            <p>{mode === 'login' ? 'Entra al panel para organizar pedidos, catalogo y clientes especiales.' : 'Registrate como cliente para pedir flores y coordinar entregas.'}</p>
          </div>
          <div className="authSwitch">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Ingresar</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Crear cuenta</button>
          </div>
          {mode === 'login' ? (
            <form onSubmit={submit} className="loginForm">
              <label>
                Correo
                <input value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} />
              </label>
              <label>
                Contrasena
                <span className="passwordField">
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} />
                  <button type="button" title={showPassword ? 'Ocultar contrasena' : 'Ver contrasena'} onClick={() => setShowPassword(current => !current)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
              <label className="checkRow">
                <input type="checkbox" checked={form.remember} onChange={event => setForm({ ...form, remember: event.target.checked })} />
                Recordarme
              </label>
              {error && <p className="error">{error}</p>}
              <button type="submit" className="loginButton">
                <ShieldCheck size={18} />
                Ingresar al panel
              </button>
            </form>
          ) : (
            <form onSubmit={register} className="loginForm">
              <input required placeholder="Nombre completo" value={registerForm.name} onChange={event => setRegisterForm({ ...registerForm, name: event.target.value })} />
              <input required placeholder="WhatsApp" value={registerForm.phone} onChange={event => setRegisterForm({ ...registerForm, phone: event.target.value })} />
              <input required type="email" placeholder="Correo" value={registerForm.email} onChange={event => setRegisterForm({ ...registerForm, email: event.target.value })} />
              <span className="passwordField">
                <input required type={showPassword ? 'text' : 'password'} placeholder="Contrasena" value={registerForm.password} onChange={event => setRegisterForm({ ...registerForm, password: event.target.value })} />
                <button type="button" title={showPassword ? 'Ocultar contrasena' : 'Ver contrasena'} onClick={() => setShowPassword(current => !current)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
              <textarea placeholder="Preferencias: rosas, colores, fechas especiales..." value={registerForm.preferences} onChange={event => setRegisterForm({ ...registerForm, preferences: event.target.value })} />
              {error && <p className="error">{error}</p>}
              <button type="submit" className="loginButton">
                <ShieldCheck size={18} />
                Crear cuenta cliente
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
