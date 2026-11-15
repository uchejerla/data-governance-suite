import { Link, useParams } from 'react-router-dom';
import { templateBySlug, tierById, formatPrice } from '../data/catalog.js';
import BuyButton from '../components/BuyButton.jsx';
import NotFound from './NotFound.jsx';

// Ready templates show watermarked images of real pages (made by
// build-files/make_previews.py). Others show a layout drawn from the outline.
const IMAGES = import.meta.glob('../assets/previews/*.jpg', { eager: true, import: 'default' });
const imageFor = (slug, n) => IMAGES[`../assets/previews/${slug}-${n}.jpg`];

function RealPages({ tpl }) {
  return (
    <div className="real-pages">
      {tpl.previews.map((caption, i) => {
        const src = imageFor(tpl.slug, i + 1);
        return src ? (
          <figure key={caption} className="real-page">
            <img src={src} alt={`${tpl.name}: ${caption}`} loading="lazy" />
            <figcaption>{caption}</figcaption>
          </figure>
        ) : null;
      })}
    </div>
  );
}

export default function TemplatePreview() {
  const { slug } = useParams();
  const tpl = templateBySlug(slug);
  if (!tpl) return <NotFound />;
  const tier = tierById(tpl.tier);
  const firstSection = tpl.outline[0];

  return (
    <div className="wrap page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/templates">Templates</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/templates/${tpl.slug}`}>{tpl.name}</Link>
        <span aria-hidden="true">/</span>
        <span>Preview</span>
      </nav>
      <header className="page-head row-between">
        <div>
          <h1>{tpl.name}: preview</h1>
          <p className="lede">
            {tpl.fileReady
              ? `Real pages from the files you download: ${tpl.length}.`
              : 'Cover, contents and a first section, so you can see how the document is laid out.'}
          </p>
          {!tpl.fileReady && <p className="notice">Layout preview built from the outline. Pages from the finished file will replace it before launch.</p>}
        </div>
        <div className="cta-row">
          <BuyButton product={{ kind: 'template', item: tpl }} label={`Buy ${formatPrice(tpl.price)}`} />
          <Link className="btn btn-ghost" to={`/templates/${tpl.slug}`}>Back to details</Link>
        </div>
      </header>

      {tpl.fileReady && tpl.previews ? <RealPages tpl={tpl} /> : (
      <div className={`pages tier-${tpl.tier}`}>
        <section className="doc-page cover" aria-label="Cover page">
          <span className="watermark" aria-hidden="true">PREVIEW</span>
          <p className="doc-kicker">{tier.name} tier</p>
          <h2 className="doc-title">{tpl.name}</h2>
          <p className="doc-sub">[Your organization name]</p>
          <dl className="doc-meta">
            <div><dt>Version</dt><dd>1.0</dd></div>
            <div><dt>Owner</dt><dd>[Name, title]</dd></div>
            <div><dt>Approved</dt><dd>[Date]</dd></div>
          </dl>
        </section>

        <section className="doc-page" aria-label="Contents page">
          <span className="watermark" aria-hidden="true">PREVIEW</span>
          <h3 className="doc-h">Contents</h3>
          <ol className="toc">
            {tpl.outline.map((o, i) => (
              <li key={o}><span>{o}</span><span className="toc-dots" /><span className="toc-pg">{2 + i * 2}</span></li>
            ))}
          </ol>
        </section>

        <section className="doc-page" aria-label="First section">
          <span className="watermark" aria-hidden="true">PREVIEW</span>
          <h3 className="doc-h">1. {firstSection}</h3>
          <p className="doc-guide">Guidance: Replace the bracketed text with your program’s details. Keep this section to one page.</p>
          <div className="doc-lines" aria-hidden="true">
            {[92, 100, 86, 97, 64, 0, 100, 90, 95, 71].map((w, i) => <span key={i} style={{ width: `${w}%` }} />)}
          </div>
          <table className="doc-table">
            <thead><tr><th>Item</th><th>Owner</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>[Item 1]</td><td>[Role]</td><td>[Draft]</td></tr>
              <tr><td>[Item 2]</td><td>[Role]</td><td>[Approved]</td></tr>
            </tbody>
          </table>
        </section>
      </div>
      )}
    </div>
  );
}
