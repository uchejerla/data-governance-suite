import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { productBySlug, bundleTemplates, formatPrice, isBuyable, deliverableFiles } from '../data/catalog.js';
import { CHECKOUT_LIVE, startCheckout, goTo } from '../lib/checkout.js';
import NotFound from './NotFound.jsx';

export default function Checkout() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const product = productBySlug(slug);
  if (!product) return <NotFound />;
  const { kind, item } = product;
  const back = kind === 'template' ? `/templates/${item.slug}` : `/bundles/${item.slug}`;
  const count = kind === 'bundle' ? bundleTemplates(item).length : 1;
  const buyable = isBuyable(product);
  const cancelled = params.get('cancelled') === '1';

  async function pay() {
    setBusy(true);
    setError('');
    try {
      goTo(await startCheckout(item.slug));
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <div className="wrap page narrow">
      <header className="page-head">
        <p className="eyebrow">Checkout</p>
        <h1>Your order</h1>
      </header>
      {cancelled && <p className="notice notice-warn">Payment cancelled. You have not been charged.</p>}
      <div className="order">
        <div className="order-row">
          <div>
            <p className="order-name">{item.name}</p>
            <p className="muted">{kind === 'bundle' ? `${count} templates` : item.format}</p>
          </div>
          <p className="price">{formatPrice(item.price)}</p>
        </div>
        <div className="order-row order-total">
          <p>Total</p>
          <p className="price">{formatPrice(item.price)}</p>
        </div>
      </div>
      {buyable ? (
        <>
          <p className="muted">You get {deliverableFiles(product).length} {deliverableFiles(product).length === 1 ? 'file' : 'files'}. Pay securely on Stripe; your download links appear right after payment and arrive by email.</p>
          {!CHECKOUT_LIVE && <p className="notice">Checkout is turned off in this preview. It works on the live site.</p>}
          <p className="muted legal-agree">By paying you agree to our <Link to="/terms">terms of sale</Link>, <Link to="/license">template license</Link> and <Link to="/refunds">refund policy</Link>.</p>
          {error && <p className="notice notice-warn" role="alert">{error}</p>}
          <div className="cta-row">
            <button type="button" className="btn" disabled={!CHECKOUT_LIVE || busy} onClick={pay}>
              {busy ? 'Opening Stripe…' : `Pay ${formatPrice(item.price)} with Stripe`}
            </button>
            <Link className="btn btn-ghost" to={back}>Back to {kind === 'bundle' ? 'bundle' : 'template'}</Link>
          </div>
        </>
      ) : (
        <>
          <p className="notice">Coming soon. This {kind === 'bundle' ? 'bundle' : 'template'} goes on sale once its files are finished.</p>
          <div className="cta-row">
            <Link className="btn btn-ghost" to={back}>Back to {kind === 'bundle' ? 'bundle' : 'template'}</Link>
          </div>
        </>
      )}
    </div>
  );
}
