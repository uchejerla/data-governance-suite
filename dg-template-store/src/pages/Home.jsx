import { Link } from 'react-router-dom';
import { TIERS, TEMPLATES, BUNDLES, templatesInTier, formatPrice, bundleBySlug, availableTemplates } from '../data/catalog.js';
import { DIMENSIONS, QUESTION_COUNT } from '../data/assessment.js';
import TemplateCard from '../components/TemplateCard.jsx';
import RadarChart from '../components/RadarChart.jsx';

const SAMPLE = [3.4, 2.2, 2.8, 1.8, 2.4, 1.6];

export default function Home() {
  const featured = availableTemplates();
  const suite = bundleBySlug('complete-suite');
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Data governance templates</p>
            <h1>Run a governance program people actually follow.</h1>
            <p className="lede">
              {TEMPLATES.length} editable templates for charters, policies, stewardship, quality and AI governance,
              written from real enterprise programs. Start with a free maturity assessment and get the templates that
              fit where you are.
            </p>
            <div className="cta-row">
              <Link className="btn btn-lg" to="/assessment">Take the free assessment</Link>
              <Link className="btn btn-ghost btn-lg" to="/templates">Browse templates</Link>
            </div>
            <p className="hero-meta">{QUESTION_COUNT} questions · {DIMENSIONS.length} dimensions · about 8 minutes · no sign-up</p>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="sheet sheet-back" />
            <div className="sheet sheet-front">
              <p className="sheet-kicker">Sample result</p>
              <RadarChart dimensions={DIMENSIONS.map((d, i) => ({ ...d, score: SAMPLE[i] }))} size={240} />
              <p className="sheet-level">Level 2 · Developing</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2>Four tiers, in the order programs grow</h2>
            <p>Each tier builds on the one before it. Buy single templates or a tier bundle.</p>
          </div>
          <ol className="tier-steps">
            {TIERS.map((t) => (
              <li key={t.id} className={`tier-step tier-${t.id}`}>
                <span className="step-num">Tier {t.step}</span>
                <h3><Link to={`/templates?tier=${t.id}`}>{t.name}</Link></h3>
                <p className="step-tag">{t.tagline}</p>
                <p>{t.description}</p>
                <p className="step-count">{templatesInTier(t.id).length} templates</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head row-between">
            <div>
              <h2>Available now</h2>
              <p>Buy any of these today and download the files straight after paying. The rest are coming soon.</p>
            </div>
            <Link className="link-arrow" to="/templates">All {TEMPLATES.length} templates</Link>
          </div>
          <div className="card-grid">
            {featured.map((t) => <TemplateCard key={t.slug} template={t} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <h2>Everything, at about half the price</h2>
            <p>
              The {suite.name} includes all {TEMPLATES.length} templates for {formatPrice(suite.price)}. Tier bundles save
              about 30% on each tier.
            </p>
            <div className="cta-row">
              <Link className="btn" to={`/bundles/${suite.slug}`}>See the {suite.name}</Link>
              <Link className="btn btn-ghost" to="/bundles">Compare bundles</Link>
            </div>
          </div>
          <ul className="bundle-mini">
            {BUNDLES.map((b) => (
              <li key={b.slug}>
                <Link to={`/bundles/${b.slug}`}>{b.name}</Link>
                <span className="price">{formatPrice(b.price)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head"><h2>Questions</h2></div>
          <dl className="faq">
            <div>
              <dt>What do I get?</dt>
              <dd>Editable Word, Excel, PowerPoint or Power BI files, depending on the template. Each listing shows the exact format.</dd>
            </div>
            <div>
              <dt>Can I change them for my company?</dt>
              <dd>Yes. Templates are meant to be edited, branded and shared inside your organization. See the <Link to="/license">template license</Link>.</dd>
            </div>
            <div>
              <dt>How is a template delivered?</dt>
              <dd>Download links appear as soon as you pay, and we email them to you too.</dd>
            </div>
            <div>
              <dt>What if it is not what I needed?</dt>
              <dd>Read the <Link to="/refunds">refund policy</Link>, or <Link to="/contact">get in touch</Link> before you buy.</dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
