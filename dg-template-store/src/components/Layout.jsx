import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { TIERS } from '../data/catalog.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="DG Template Suite home">
      <svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true">
        <rect x="2" y="2" width="11" height="11" rx="2" className="logo-a" />
        <rect x="15" y="2" width="11" height="11" rx="2" className="logo-b" />
        <rect x="2" y="15" width="11" height="11" rx="2" className="logo-b" />
        <rect x="15" y="15" width="11" height="11" rx="2" className="logo-c" />
      </svg>
      <span>DG Template Suite</span>
    </Link>
  );
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <header className="site-header">
        <div className="wrap header-row">
          <Logo />
          <nav className="main-nav" aria-label="Main">
            <NavLink to="/templates">Templates</NavLink>
            <NavLink to="/bundles">Bundles</NavLink>
            <NavLink to="/assessment" className="nav-cta">Free assessment</NavLink>
          </nav>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>Practical data governance templates written from real enterprise programs.</p>
          </div>
          <div>
            <h2 className="footer-h">Templates</h2>
            <ul>
              {TIERS.map((t) => (
                <li key={t.id}>
                  <Link to={`/templates?tier=${t.id}`}>{t.name}</Link>
                </li>
              ))}
              <li><Link to="/bundles">Bundles</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Free tools</h2>
            <ul>
              <li><Link to="/assessment">Maturity assessment</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="footer-h">Company</h2>
            <ul>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/terms">Terms of sale</Link></li>
              <li><Link to="/license">Template license</Link></li>
              <li><Link to="/refunds">Refund policy</Link></li>
              <li><Link to="/privacy">Privacy policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="wrap footer-base">© 2026 DG Template Suite. All rights reserved.</div>
      </footer>
    </>
  );
}
