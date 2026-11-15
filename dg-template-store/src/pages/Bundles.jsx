import { Link, useParams } from 'react-router-dom';
import { BUNDLES, bundleBySlug, bundleTemplates, bundleListPrice, tierById, formatPrice, templateBuyable } from '../data/catalog.js';
import { checkoutPath } from '../lib/checkout.js';
import BuyButton from '../components/BuyButton.jsx';
import NotFound from './NotFound.jsx';

export function Bundles() {
  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">Bundles</p>
        <h1>Bundles</h1>
        <p className="lede">Every template in a tier, or the whole suite, for less than buying them one at a time.</p>
      </header>
      <div className="bundle-grid">
        {BUNDLES.map((b) => {
          const list = bundleListPrice(b);
          const save = Math.round((1 - b.price / list) * 100);
          return (
            <article key={b.slug} className={`bcard${b.tier ? ` tier-${b.tier}` : ' bcard-suite'}`}>
              <p className="tier-chip">{b.tier ? tierById(b.tier).name : 'All tiers'}</p>
              <h2><Link to={`/bundles/${b.slug}`}>{b.name}</Link></h2>
              <p>{b.summary}</p>
              <p className="bcard-price">
                <span className="price">{formatPrice(b.price)}</span>
                <s className="muted">{formatPrice(list)}</s>
                <span className="save">Save {save}%</span>
              </p>
              <p className="muted">{bundleTemplates(b).length} templates</p>
              <div className="cta-row">
                <Link className="btn btn-sm" to={`/bundles/${b.slug}`}>See what is included</Link>
              </div>
            </article>
          );
        })}
      </div>
      <p className="notice">Bundle prices are drafts for review.</p>
    </div>
  );
}

export function BundleDetail() {
  const { slug } = useParams();
  const b = bundleBySlug(slug);
  if (!b) return <NotFound />;
  const items = bundleTemplates(b);
  const list = bundleListPrice(b);

  return (
    <div className="wrap page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/bundles">Bundles</Link>
      </nav>
      <div className="detail-grid">
        <div className="detail-main">
          <p className="tier-chip">{b.tier ? tierById(b.tier).name : 'All tiers'}</p>
          <h1>{b.name}</h1>
          <p className="lede">{b.summary}</p>
          <h2 className="h-sm">Included templates</h2>
          <ul className="incl-list">
            {items.map((x) => (
              <li key={x.slug}>
                <Link to={`/templates/${x.slug}`}>{x.name}</Link>
                <span className="muted">{x.format}</span>
                <span className="price">{formatPrice(x.price)}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="buy-box" aria-label="Purchase">
          <p className="buy-price">{formatPrice(b.price)}</p>
          <p className="muted">Bought one at a time: {formatPrice(list)}</p>
          <dl className="facts">
            <div><dt>Templates</dt><dd>{items.length}</dd></div>
            <div><dt>Delivery</dt><dd>Instant download after payment</dd></div>
          </dl>
          <BuyButton className="btn btn-block" product={{ kind: 'bundle', item: b }} label="Get template bundle" />
          {items.some((x) => !x.fileReady) && (
            <p className="buy-note">This bundle goes on sale once all {items.length} templates are finished.</p>
          )}
          {items.some((x) => !x.fileReady) && items.some((x) => templateBuyable(x)) && (
            <div className="buy-now">
              <p className="h-sm">Available now on their own</p>
              <ul className="plain-list">
                {items.filter((x) => templateBuyable(x)).map((x) => (
                  <li key={x.slug}><Link to={checkoutPath(x.slug)}>Buy {x.name}, {formatPrice(x.price)}</Link></li>
                ))}
              </ul>
            </div>
          )}
          <Link className="btn btn-ghost btn-block" to="/assessment">Not sure? Take the assessment</Link>
        </aside>
      </div>
    </div>
  );
}
