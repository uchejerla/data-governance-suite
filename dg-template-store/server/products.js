import { productBySlug, isBuyable, deliverableFiles, bundleTemplates, CURRENCY } from '../src/data/catalog.js';

// Server-side view of what can be sold. Prices always come from catalog.js here,
// never from the browser.
export function sellable(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  const product = productBySlug(slug);
  if (!product || !isBuyable(product)) return null;
  const { kind, item } = product;
  return {
    slug: item.slug,
    kind,
    name: item.name,
    description: kind === 'bundle' ? `${bundleTemplates(item).length} data governance templates` : item.summary,
    amountCents: Math.round(item.price * 100),
    currency: CURRENCY.toLowerCase(),
    stripePriceId: item.stripePriceId || null,
    files: deliverableFiles(product),
  };
}
