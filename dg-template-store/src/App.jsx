import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import TemplateDetail from './pages/TemplateDetail.jsx';
import TemplatePreview from './pages/TemplatePreview.jsx';
import { Bundles, BundleDetail } from './pages/Bundles.jsx';
import Assessment from './pages/Assessment.jsx';
import AssessmentResults from './pages/AssessmentResults.jsx';
import Checkout from './pages/Checkout.jsx';
import Thanks from './pages/Thanks.jsx';
import { Terms, License, Refunds, Privacy, Contact } from './pages/Legal.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="templates" element={<Catalog />} />
        <Route path="templates/:slug" element={<TemplateDetail />} />
        <Route path="templates/:slug/preview" element={<TemplatePreview />} />
        <Route path="bundles" element={<Bundles />} />
        <Route path="bundles/:slug" element={<BundleDetail />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="assessment/results" element={<AssessmentResults />} />
        <Route path="checkout/:slug" element={<Checkout />} />
        <Route path="thanks" element={<Thanks />} />
        <Route path="terms" element={<Terms />} />
        <Route path="license" element={<License />} />
        <Route path="refunds" element={<Refunds />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
