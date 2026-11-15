import { Link } from 'react-router-dom';
import { isBuyable } from '../data/catalog.js';
import { checkoutPath } from '../lib/checkout.js';

// Buy button for a product ({ kind, item }). Products whose files are not
// built yet show "Coming soon" instead, so nobody can pay for them.
export default function BuyButton({ product, label, className = 'btn' }) {
  if (!isBuyable(product)) {
    return <span className={`${className} btn-soon`} aria-disabled="true">Coming soon</span>;
  }
  return <Link className={className} to={checkoutPath(product.item.slug)}>{label}</Link>;
}
