import { Link } from 'react-router-dom';
import { LEGAL, hasEmail } from '../data/legal.js';

// Plain-English terms, license, refund and privacy pages.
// Not legal advice: worth a lawyer's read before launch.
// Names, email and dates come from src/data/legal.js.

export function SupportEmail() {
  const email = LEGAL.supportEmail;
  return hasEmail(email) ? <a href={`mailto:${email}`}>{email}</a> : <span>{email}</span>;
}

function LegalPage({ title, children }) {
  return (
    <div className="wrap page narrow legal">
      <header className="page-head">
        <p className="eyebrow">Legal</p>
        <h1>{title}</h1>
        <p className="muted">Effective {LEGAL.effective}</p>
      </header>
      {children}
      <p className="muted">Questions? Write to <SupportEmail />.</p>
    </div>
  );
}

const Seller = () => <>{LEGAL.seller}</>;

export function Terms() {
  return (
    <LegalPage title="Terms of sale">
      <p className="lede">These terms cover buying templates from DG Template Suite. By paying for an order you agree to them, to the <Link to="/license">template license</Link> and to the <Link to="/refunds">refund policy</Link>.</p>

      <h2>Who we are</h2>
      <p>DG Template Suite is run by <Seller />, based in {LEGAL.state}, USA. In these terms, "we" and "us" mean <Seller />, and "you" means the person buying and the organization they buy for. You can reach us at <SupportEmail />.</p>

      <h2>What you are buying</h2>
      <p>You are buying digital templates: Word, Excel, PowerPoint and similar files that you download. There is nothing physical to ship and no subscription. Each listing shows the files, formats and contents included.</p>

      <h2>Prices and payment</h2>
      <p>Prices are in US dollars, and the price shown at checkout is the total you pay, once. Payments are handled by Stripe on its secure checkout page. We never see or store your card details.</p>

      <h2>Delivery</h2>
      <p>Your download links appear as soon as your payment goes through, and we also email them to the address you give at checkout. Each link works for {LEGAL.linkHours} hours. For {LEGAL.orderLookupDays} days after you buy, you can get fresh links from your order page. After that, write to us and we will send your files again. Please download and keep your own copies.</p>

      <h2>Using the templates</h2>
      <p>The <Link to="/license">template license</Link> explains how you may use, edit and share the files. In short, use them freely inside your organization, but do not resell or give them away.</p>

      <h2>Not professional advice</h2>
      <p>The templates and the free maturity assessment are starting points written from real data governance programs. They are not legal, regulatory, compliance or audit advice, and an assessment score is an indication, not an audit. You are responsible for adapting the templates to your organization and for the decisions you make with them.</p>

      <h2>Our promise and its limits</h2>
      <p>We make the templates with care, and each one should match its listing. If it does not, the <Link to="/refunds">refund policy</Link> explains how we put it right. Beyond that, and as far as the law allows, the templates are provided as they are, without other promises or warranties.</p>
      <p>As far as the law allows, our total liability for any claim about an order is limited to the amount you paid for that order. We are not liable for indirect or consequential losses, such as lost profits, lost data or regulatory penalties.</p>

      <h2>Ownership</h2>
      <p>We own the copyright in the templates, the assessment and the content of this site. Buying a template gives you a license to use it, not ownership of it.</p>

      <h2>Law</h2>
      <p>These terms are governed by the laws of the State of {LEGAL.state}, USA, and any dispute will be handled by the courts located in {LEGAL.state}. Nothing in these terms takes away rights you have under the law that cannot be waived.</p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The version on this site when you place an order applies to that order.</p>
    </LegalPage>
  );
}

export function License() {
  return (
    <LegalPage title="Template license">
      <p className="lede">Buy once, then use and edit the templates as much as you like inside your organization. Just do not resell them or share them outside it.</p>

      <h2>Who the license covers</h2>
      <p>Each purchase licenses one organization: the company, public body or nonprofit you buy for, including companies in the same corporate group. Its employees and the contractors working for it may all use the templates.</p>

      <h2>What you may do</h2>
      <ul>
        <li>Edit, rebrand, shorten, extend and translate the templates.</li>
        <li>Copy and share them with anyone inside your organization.</li>
        <li>Use them as the basis for your own charters, policies, standards, plans and presentations.</li>
        <li>Share the finished documents you make with your board, auditors, regulators, partners and clients as part of running your program.</li>
        <li>Keep using them for as long as you like. The license does not expire.</li>
      </ul>

      <h2>What you may not do</h2>
      <ul>
        <li>Sell, sublicense, give away or publish the templates, whether as they are or edited, as templates or a template kit.</li>
        <li>Post them on a public website, a template marketplace or a shared drive open to people outside your organization.</li>
        <li>Include them in a product, course or toolkit that you sell or give to others.</li>
        <li>Transfer the license to another organization.</li>
      </ul>

      <h2>Consultants and advisers</h2>
      <p>If you buy as a consultant, each purchase covers your work with one client organization. You may keep a copy for your own records. Buy again for each further client.</p>

      <h2>Ownership</h2>
      <p>The templates stay the property of <Seller />. You own the content you add to them.</p>

      <h2>If the license ends</h2>
      <p>If you break these terms, or if your order is refunded, the license ends and you must stop using and delete the templates. Documents you have already finished and shared in good faith can stay as they are.</p>
    </LegalPage>
  );
}

export function Refunds() {
  return (
    <LegalPage title="Refund policy">
      <p className="lede">If something is wrong with your files, we will fix it or give you your money back.</p>

      <h2>When we refund</h2>
      <p>Write to us within {LEGAL.refundDays} days of buying and we will fix the problem or refund you in full if:</p>
      <ul>
        <li>a file is damaged or will not open in a current version of Microsoft Office,</li>
        <li>a file is materially different from what its listing describes,</li>
        <li>you did not receive your files and we cannot get them to you, or</li>
        <li>you bought the same template twice by mistake.</li>
      </ul>

      <h2>Change of mind</h2>
      <p>Your files are delivered the moment you pay and cannot be returned, so we do not offer refunds if you simply change your mind. If you are unsure whether a template fits, look at its preview pages or write to us before you buy.</p>

      <h2>How to ask</h2>
      <p>Write to <SupportEmail /> from the email address you paid with, or include it, and tell us what went wrong. We aim to reply within {LEGAL.replyDays} business days.</p>

      <h2>How refunds are paid</h2>
      <p>Refunds go back to the card or account you paid with, through Stripe. Your bank may take 5 to 10 business days to show it. When an order is refunded, its <Link to="/license">license</Link> ends.</p>

      <p>This policy does not affect any rights you have under the law.</p>
    </LegalPage>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p className="lede">We collect only what we need to sell and deliver your templates. No advertising, no tracking or analytics cookies, and we never sell personal data.</p>

      <h2>Who is responsible</h2>
      <p><Seller />, based in {LEGAL.state}, USA, runs this site and is responsible for your personal data. Write to <SupportEmail /> with any privacy question.</p>

      <h2>When you buy</h2>
      <p>Payment happens on Stripe's checkout page. There you give Stripe your email address and payment details, and Stripe may also ask for your name and billing address. Your card details go to Stripe and never reach us.</p>
      <p>From Stripe we receive your email address, what you bought, the amount and an order number. We keep an order record with those details and the time you paid, in private storage that only our site can read. We use it to deliver your files, send fresh download links, answer your questions, handle refunds and keep our accounts.</p>
      <p>Stripe handles your payment details under its own <a href="https://stripe.com/privacy">privacy policy</a>.</p>

      <h2>Emails</h2>
      <p>We send your download links to the email address you gave at checkout, using our email provider, Resend. We do not send marketing emails. If we ever start a newsletter, you will only get it if you sign up for it.</p>

      <h2>The free maturity assessment</h2>
      <p>Your answers are scored in your own browser and are not sent to us. While you work through the questions, your progress is saved in your browser's storage on your device, and it is cleared when you finish. Your PDF report is also made in your browser.</p>
      <p>Your answers are written into the address of your results page so you can bookmark or share it. If you reload, bookmark or share that link, the address reaches our web host like any other page address and may appear in its short-lived technical logs. We do not use these logs to look at assessment answers.</p>

      <h2>Hosting, logs and fonts</h2>
      <p>The site is hosted by Vercel. Like any web host, Vercel records technical details such as your IP address, browser type and the pages you request, which we use only for security and fixing problems. These logs are kept for a short time.</p>
      <p>Our pages load their fonts from Google Fonts, so your browser connects to Google, which receives your IP address under <a href="https://policies.google.com/privacy">Google's privacy policy</a>.</p>

      <h2>Cookies and storage</h2>
      <p>This site sets no cookies of its own. It uses your browser's storage only to save assessment progress, as described above. Stripe's checkout page may use its own cookies to process payments and prevent fraud.</p>

      <h2>Who we share data with</h2>
      <p>We share personal data only with the service providers named above (Stripe, Vercel, Resend and Google Fonts) so they can run their part of the site, and with authorities when the law requires it. These providers are in the United States, and your data is processed there.</p>

      <h2>How long we keep it</h2>
      <p>We keep order records for {LEGAL.recordYears} years for tax and accounting, then delete them. Hosting logs are kept only briefly.</p>

      <h2>Your choices</h2>
      <p>You can ask us for a copy of the personal data we hold about you, or ask us to correct or delete it, by writing to <SupportEmail />. We will delete what we can, apart from records the law requires us to keep. Stripe keeps its own payment records under its policy.</p>

      <h2>Children</h2>
      <p>This site is for professionals and organizations, not for children, and we do not knowingly collect children's data.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we will post the new version here with a new effective date.</p>
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
      <p>Write to <SupportEmail />. We aim to reply within {LEGAL.replyDays} business days.</p>
      <p>For an order, include the email address you paid with. Before you write, the <Link to="/assessment">free assessment</Link> is the quickest way to see which templates fit your program.</p>
    </div>
  );
}
