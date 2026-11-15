import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchOrder } from '../lib/checkout.js';

// Stripe sends buyers here after paying: /thanks?session_id=cs_...
// The page asks /api/order for fresh, time-limited download links.
export default function Thanks() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    if (!sessionId) { setState({ error: 'This page needs the link from your order email.' }); return undefined; }
    let stop = false;
    let tries = 0;
    async function load() {
      try {
        const order = await fetchOrder(sessionId);
        if (stop) return;
        // A delayed payment method can take a moment to confirm.
        if (order.status === 'processing' && tries++ < 10) { setState({ order }); setTimeout(load, 3000); return; }
        setState({ order });
      } catch (e) {
        if (!stop) setState({ error: e.message });
      }
    }
    load();
    return () => { stop = true; };
  }, [sessionId]);

  const { order, error, loading } = state;
  return (
    <div className="wrap page narrow">
      <header className="page-head">
        <p className="eyebrow">Order</p>
        <h1>{order?.status === 'paid' ? 'Thank you, your files are ready' : 'Your order'}</h1>
      </header>
      {loading && <p className="muted">Loading your order…</p>}
      {error && <p className="notice notice-warn" role="alert">{error} <Link to="/contact">Contact us</Link> if you paid and need your files.</p>}
      {order?.status === 'processing' && <p className="notice">Your payment is still being confirmed. This page updates by itself, and we email your links once it clears.</p>}
      {order?.status === 'unpaid' && <p className="notice notice-warn">This order was not paid, so there is nothing to download. <Link to="/templates">Back to templates</Link></p>}
      {order?.status === 'too_old' && <p className="notice">{order.message} <Link to="/contact">Contact us</Link></p>}
      {order?.status === 'paid' && (
        <>
          <p className="lede">{order.product.name}</p>
          <ul className="download-list">
            {order.links.map((l) => (
              <li key={l.url}>
                <span><span className="dl-name">{l.label}</span> <span className="muted">{l.name}</span></span>
                <a className="btn btn-sm" href={l.url}>Download</a>
              </li>
            ))}
          </ul>
          <p className="notice notice-ok">
            These links work until {new Date(order.expiresAt).toLocaleString()}. Come back to this page any time in the next {order.freshLinksDays} days for fresh links.
            {order.emailDelivery && order.email ? ` We also emailed them to ${order.email}.` : ' Bookmark this page to download again later.'}
          </p>
        </>
      )}
    </div>
  );
}
