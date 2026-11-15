import { Link } from 'react-router-dom';
import { formatPrice, tierById, templateBuyable } from '../data/catalog.js';
import { checkoutPath } from '../lib/checkout.js';
import DraftTag from './DraftTag.jsx';

export default function TemplateCard({ template }) {
  const tier = tierById(template.tier);
  const buyable = templateBuyable(template);
  return (
    <article className={`tcard tier-${template.tier}`}>
      <div className="tcard-top">
        <span className="tier-chip">{tier.name}</span>
        <span className="fmt">{template.format}</span>
      </div>
      <h3 className="tcard-title">
        <Link to={`/templates/${template.slug}`}>{template.name}</Link>
      </h3>
      <p className="tcard-sum">{template.summary}</p>
      {template.source === 'invented' && <DraftTag />}
      <div className="tcard-foot">
        <span className="price">{formatPrice(template.price)}{!buyable && <span className="soon-tag">Coming soon</span>}</span>
        <span className="tcard-actions">
          <Link className="btn btn-ghost btn-sm" to={`/templates/${template.slug}/preview`}>Preview</Link>
          {buyable
            ? <Link className="btn btn-sm" to={checkoutPath(template.slug)}>Buy</Link>
            : <Link className="btn btn-ghost btn-sm" to={`/templates/${template.slug}`}>Details</Link>}
        </span>
      </div>
    </article>
  );
}
