import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import NewsletterForm from '../components/NewsletterForm.jsx';

export default function LandingPage() {
  return (
    <div>
      {/* HEADER */}
      <header className="header">
        <nav className="nav" aria-label="Navegación principal">
          <a className="nav__logo" href="/" aria-label="Inicio Nobilerde">
            <img src="/imagenes/logo.png" alt="Logo Nobilerde" width="64" height="64" loading="lazy" />
          </a>
          <ul className="nav__list">
            <li className="nav__item"><a className="nav__link" href="#inicio">Inicio</a></li>
            <li className="nav__item"><a className="nav__link" href="#funcionamiento">Cómo funciona</a></li>
            <li className="nav__item"><a className="nav__link" href="#caracteristicas">Características</a></li>
            <li className="nav__item"><Link className="nav__link" to="/dashboard">Ir al Dashboard</Link></li>
          </ul>
        </nav>
      </header>

      {/* MAIN */}
      <main id="contenido" role="main">
        {/* Hero */}
        <section id="inicio" className="hero">
          <h1 className="hero__title">Encontrá la yerba mate perfecta para vos</h1>
          <p className="hero__subtitle">Nobilerde usa inteligencia artificial y la voz de miles de materos para recomendarte las mejores marcas según tu gusto.</p>
          {/* Formulario de Newsletter */}
          <div className="newsletter">
            <label className="newsletter__label" htmlFor="email-input">Recibí novedades antes que nadie</label>
            <NewsletterForm source="landing-hero" />
            <div className="privacy-notice">
              Tus datos se usan solo para enviarte novedades de Nobilerde. Podés darte de baja cuando quieras. <a href="privacidad.html">Ver política de privacidad</a>.
            </div>
          </div>
        </section>

        {/* Propósito */}
        <section id="proposito" className="section">
          <h2 className="section__title">¿Por qué Nobilerde?</h2>
          <p className="section__text">Ayudamos a amantes del mate a descubrir sus yerbas ideales y a las marcas a mejorar su calidad gracias al feedback real de la comunidad.</p>
        </section>

        {/* Cómo funciona */}
        <section id="funcionamiento" className="section">
          <h2 className="section__title">Cómo funciona</h2>
          <article className="feature">
            <h3 className="feature__title">Recomendaciones inteligentes</h3>
            <p className="feature__text">Nuestro sistema de recomendaciones con IA analiza tus preferencias y te sugiere yerbas que encajan con tu perfil de sabor.</p>
          </article>
          <article className="feature">
            <h3 className="feature__title">Filtrado</h3>
            <p className="feature__text">Nuestro sistema de filtrado te permite encontrar yerbas según las características deseadas.</p>
          </article>
          <article className="feature">
            <h3 className="feature__title">Registro de catas y puntajes</h3>
            <p className="feature__text">Anotá tus opiniones y puntuaciones en segundos y llevá un control histórico de lo que más te gustó.</p>
          </article>
          <article className="feature">
            <h3 className="feature__title">Comunidad matera</h3>
            <p className="feature__text">Leé reviews de otros usuarios, descubrí tendencias y ayudá a que cada marca eleve su estándar.</p>
          </article>
        </section>

        {/* CTA de descarga / contacto */}
        <section id="caracteristicas" className="cta">
          <h2 className="cta__title">Probala gratis</h2>
          <p className="cta__text">Pronto en iOS y Android &mdash; dejá tu correo y sé el primero en acceder.</p>
          <a className="cta__button" href="#inicio">Quiero la app</a>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <nav className="footer__nav" aria-label="Pie de página">
          <a className="footer__link" href="privacidad.html">Privacidad</a>
          <a className="footer__link" href="terminos.html">Términos</a>
          <a className="footer__link" href="mailto:hola@nobilerde.com">Contacto</a>
        </nav>
        <small className="footer__copyright">© 2025 Nobilerde</small>
      </footer>
    </div>
  );
}
