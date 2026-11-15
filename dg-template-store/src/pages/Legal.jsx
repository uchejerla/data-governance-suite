import { Link } from 'react-router-dom';

// PLACEHOLDER TEXT. Needs Uday's review and, ideally, a legal review before launch.
function LegalPage({ title, updated = 'Draft, not yet in effect', children }) {
  return (
    <div className="wrap page narrow legal">
      <header className="page-head">
        <p className="eyebrow">Legal</p>
        <h1>{title}</h1>
        <p className="muted">{updated}</p>
      </header>
      <p className="notice">Placeholder text for review. Not legal advice and not yet in effect.</p>
      {children}
      <p className="muted">Questions? <Link to="/contact">Contact us</Link>.</p>
    </div>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of use">
      <h2>License</h2>
      <p>Each purchase grants one organization a license to edit and use the templates internally. You may adapt, brand and share them with your own employees and contractors.</p>
      <h2>What you may not do</h2>
      <p>You may not resell, sublicense or publish the templates, or offer them as part of a product, in original or edited form.</p>
      <h2>No warranty</h2>
      <p>Templates are provided as starting points. They are not legal, regulatory or compliance advice. You are responsible for how you use them.</p>
      <h2>Changes</h2>
      <p>We may update these terms. The version shown at the time of purchase applies to that purchase.</p>
    </LegalPage>
  );
}

export function Refunds() {
  return (
    <LegalPage title="Refund policy">
      <h2>Digital products</h2>
      <p>Because templates are delivered as downloads, sales are generally final once a file has been downloaded.</p>
      <h2>When we refund</h2>
      <p>If a file is damaged, will not open, or is materially different from its listing, contact us within 14 days of purchase and we will fix it or refund you.</p>
      <h2>How to ask</h2>
      <p>Send your order number and a short description through the <Link to="/contact">contact page</Link>.</p>
    </LegalPage>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <h2>What we collect</h2>
      <p>At checkout we collect only your email, to deliver your files and receipt. Card details are handled by our payment processor, Stripe, and never reach us.</p>
      <h2>The free assessment</h2>
      <p>Your answers are scored in your browser and kept in the results link. We do not store them.</p>
      <h2>How we use it</h2>
      <p>We use your email to deliver purchases and, only if you opt in, to send product updates. We do not sell personal data.</p>
      <h2>Your choices</h2>
      <p>You can ask us to delete your details at any time through the <Link to="/contact">contact page</Link>.</p>
    </LegalPage>
  );
}

export function Contact() {
  return (
    <div className="wrap page narrow">
      <header className="page-head">
        <p className="eyebrow">Contact</p>
        <h1>Get in touch</h1>
        <p className="lede">Questions about a template, a bundle for your team, or an order.</p>
      </header>
      <p className="notice">The contact email will be added before launch.</p>
      <p>Before you write, the <Link to="/assessment">free assessment</Link> is the quickest way to see which templates fit your program.</p>
    </div>
  );
}
