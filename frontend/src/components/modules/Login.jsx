import { useState } from 'react';
import { Eye, EyeOff, Flower2, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { API_URL } from '../../services/apiClient';

export function Login({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@alesli.bo', password: 'alesli2026', remember: true });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
          <div className="bouquetMark">
            <Flower2 size={64} />
            <Heart size={28} />
          </div>
          <h1>Alesli</h1>
          <p>Gestion elegante para pedidos, clientes frecuentes y arreglos florales hechos con carino.</p>
        </div>
        <div className="loginPanel">
          <div className="brandMark loginBrand">
            <Flower2 size={34} />
            <div>
              <strong>Floreria Alesli</strong>
              <span>PAPURDIGANS</span>
            </div>
          </div>
          <div className="loginCopy">
            <h2>Bienvenida</h2>
            <p>Entra al panel para organizar pedidos, catalogo y clientes especiales.</p>
          </div>
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
        </div>
      </section>
    </main>
  );
}
