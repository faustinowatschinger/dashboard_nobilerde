import { useState, useRef } from 'react';

export default function NewsletterForm({ source }) {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const mountedAt = useRef(Date.now());

  const isDisabled = status === 'loading' || status === 'success';

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('El email no parece válido.');
      return;
    }

    if (hp || Date.now() - mountedAt.current < 2000) {
      setStatus('error');
      setMessage('No pudimos completar la suscripción. Probá más tarde.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          hp,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('¡Listo! Revisá tu correo para confirmar la suscripción.');

        if (typeof window !== 'undefined') {
          if (window.gtag) {
            window.gtag('event', 'newsletter_subscribed');
          }
          if (window.dataLayer) {
            window.dataLayer.push({ event: 'newsletter_subscribed', source });
          }
        }
        return;
      }

      let data;
      try {
        data = await res.json();
      } catch {
        // ignore
      }

      if (res.status === 400 && data?.code === 'invalid_email') {
        setMessage('El email no parece válido.');
      } else if (res.status === 409 && data?.code === 'duplicate') {
        setMessage('Ese email ya está registrado. Si no te llegó, revisá SPAM o intentá nuevamente.');
      } else {
        setMessage('No pudimos completar la suscripción. Probá más tarde.');
      }
      setStatus('error');
    } catch {
      setStatus('error');
      setMessage('No pudimos completar la suscripción. Probá más tarde.');
    }
  };

  return (
    <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
      <div className="newsletter__input-group">
        <input
          type="email"
          id="email-input"
          className="newsletter__input"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={handleChange}
          aria-describedby="email-help"
          aria-invalid={status === 'error'}
          disabled={isDisabled}
          required
        />
        {/* Honeypot field */}
        <input
          type="text"
          name="hp"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          tabIndex="-1"
          autoComplete="off"
          style={{ position: 'absolute', left: '-5000px', opacity: 0 }}
          aria-hidden="true"
        />
        <button type="submit" className="newsletter__button" disabled={isDisabled}>
          {status === 'loading' ? 'Enviando...' : status === 'success' ? '¡Enviado!' : 'Suscribirme'}
        </button>
      </div>
      <div id="email-help" className="newsletter__help" aria-live="polite">
        Te enviaremos un email de confirmación
      </div>
      {message && (
        <div
          className={`newsletter__message ${
            status === 'success' ? 'newsletter__message--success' : 'newsletter__message--error'
          }`}
          role="alert"
          aria-live="assertive"
        >
          {message}
        </div>
      )}
    </form>
  );
}
