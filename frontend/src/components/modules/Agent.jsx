import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export function Agent({ api }) {
  const [message, setMessage] = useState('Tienen catalogo y precios?');
  const [conversation, setConversation] = useState([]);

  async function send(event) {
    event.preventDefault();
    const response = await api.request('/agent/message', { method: 'POST', body: JSON.stringify({ message }) });
    setConversation([{ from: 'cliente', text: message }, { from: 'agente', text: response.reply, meta: response.intent }, ...conversation]);
    setMessage('');
  }

  return (
    <section className="module agentModule">
      <div className="moduleHeader">
        <div>
          <h2>Agente WhatsApp demo</h2>
          <p>Responde consultas frecuentes en menos de 5 segundos.</p>
        </div>
      </div>
      <form className="agentForm" onSubmit={send}>
        <input value={message} onChange={event => setMessage(event.target.value)} placeholder="Consulta del cliente" />
        <button type="submit">
          <MessageCircle size={18} />
          Enviar
        </button>
      </form>
      <div className="chatList">
        {conversation.map((item, index) => (
          <p className={item.from} key={`${item.from}-${index}`}>
            {item.text}
            {item.meta && <small>{item.meta}</small>}
          </p>
        ))}
      </div>
    </section>
  );
}
