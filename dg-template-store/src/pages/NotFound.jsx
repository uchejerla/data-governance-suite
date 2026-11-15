import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="wrap page narrow" data-not-found="true">
      <h1>Page not found</h1>
      <p className="lede">That page does not exist. It may have moved.</p>
      <div className="cta-row">
        <Link className="btn" to="/templates">Browse templates</Link>
        <Link className="btn btn-ghost" to="/">Go home</Link>
      </div>
    </div>
  );
}
