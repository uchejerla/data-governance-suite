import { Link, useParams } from 'react-router-dom';
import { templateBySlug, tierById, bundleForTier, templatesInTier, formatPrice, bundleListPrice } from '../data/catalog.js';
import BuyButton from '../components/BuyButton.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import DraftTag from '../components/DraftTag.jsx';
import NotFound from './NotFound.jsx';

export default function TemplateDetail() {
  const { slug } = useParams();
  const tpl = templateBySlug(slug);
  if (!tpl) return <NotFound />;
  const tier = tierById(tpl.tier);
  const bundle = bundleForTier(tpl.tier);
  const related = templatesInTier(tpl.tier).filter((x) => x.slug !== tpl.slug).slice(0, 3);

  return (
    <div className="wrap page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/templates">Templates</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/templates?tier=${tier.id}`}>{tier.name}</Link>
      </nav>

      <div className="detail-grid">
        <div className="detail-main">
          <p className={`tier-chip tier-${tier.id}`}>{tier.name}</p>
          <h1>{tpl.name}</h1>
          <p className="lede">{tpl.summary}</p>
          {tpl.source === 'invented' && <DraftTag>Draft listing: name, price and contents to review</DraftTag>}

          <h2 className="h-sm">What is inside</h2>
          <ol className="outline">
            {tpl.outline.map((o) => <li key={o}>{o}</li>)}
          </ol>

          <h2 className="h-sm">Files included</h2>
          <ul className="plain-list">
            {tpl.files
              ? tpl.files.map((f) => <li key={f.name}>{f.label} <span className="muted">({f.name.split('.').pop().toUpperCase()}, {f.size})</span></li>)
              : tpl.includes.map((f) => <li key={f}>{f}</li>)}
          </ul>

          <h2 className="h-sm">Who it is for</h2>
          <p>{tpl.audience}</p>
        </div>

        <aside className="buy-box" aria-label="Purchase">
          <p className="buy-price">{formatPrice(tpl.price)}</p>
          <dl className="facts">
            <div><dt>Format</dt><dd>{tpl.format}</dd></div>
            <div><dt>Length</dt><dd>{tpl.fileReady ? tpl.length : <>About {tpl.pages} pages <span className="muted">(estimate)</span></>}</dd></div>
            <div><dt>Tier</dt><dd>{tier.name}</dd></div>
            <div><dt>Delivery</dt><dd>{tpl.fileReady ? 'Instant download after payment' : 'Coming soon'}</dd></div>
          </dl>
          <BuyButton className="btn btn-block" product={{ kind: 'template', item: tpl }} label={`Buy ${formatPrice(tpl.price)}`} />
          <Link className="btn btn-ghost btn-block" to={`/templates/${tpl.slug}/preview`}>Preview pages</Link>
          {bundle && (
            <p className="buy-note">
              Or get all {templatesInTier(tpl.tier).length} {tier.name} templates in the{' '}
              <Link to={`/bundles/${bundle.slug}`}>{bundle.name}</Link> for {formatPrice(bundle.price)}{' '}
              <span className="muted">(list {formatPrice(bundleListPrice(bundle))})</span>.
            </p>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="tier-block">
          <div className="tier-block-head"><h2>More in {tier.name}</h2></div>
          <div className="card-grid">
            {related.map((x) => <TemplateCard key={x.slug} template={x} />)}
          </div>
        </section>
      )}
    </div>
  );
}
