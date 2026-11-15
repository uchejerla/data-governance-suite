import { Link, useSearchParams } from 'react-router-dom';
import { TIERS, TEMPLATES, tierById, bundleForTier, formatPrice } from '../data/catalog.js';
import TemplateCard from '../components/TemplateCard.jsx';

export default function Catalog() {
  const [params] = useSearchParams();
  const active = tierById(params.get('tier')) ? params.get('tier') : null;
  const tiers = active ? TIERS.filter((t) => t.id === active) : TIERS;

  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">Catalog</p>
        <h1>{active ? `${tierById(active).name} templates` : 'All templates'}</h1>
        <p className="lede">{active ? tierById(active).description : `${TEMPLATES.length} templates across four tiers.`}</p>
      </header>

      <nav className="filter-row" aria-label="Filter by tier">
        <Link to="/templates" className={`chip${active ? '' : ' chip-on'}`} aria-current={active ? undefined : 'page'}>All</Link>
        {TIERS.map((t) => (
          <Link key={t.id} to={`/templates?tier=${t.id}`} className={`chip${active === t.id ? ' chip-on' : ''}`} aria-current={active === t.id ? 'page' : undefined}>
            {t.name}
          </Link>
        ))}
      </nav>

      {tiers.map((tier) => {
        const items = TEMPLATES.filter((x) => x.tier === tier.id);
        const bundle = bundleForTier(tier.id);
        return (
          <section key={tier.id} className="tier-block">
            <div className="tier-block-head">
              <h2><span className="step-num">Tier {tier.step}</span> {tier.name}</h2>
              {bundle && (
                <Link className="link-arrow" to={`/bundles/${bundle.slug}`}>
                  All {items.length} as the {bundle.name}, {formatPrice(bundle.price)}
                </Link>
              )}
            </div>
            <div className="card-grid">
              {items.map((x) => <TemplateCard key={x.slug} template={x} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
