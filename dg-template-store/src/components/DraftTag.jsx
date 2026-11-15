// Marks content drafted during the rebuild that Uday has not reviewed yet.
// Remove the tags (or set source: 'chat') as items are confirmed.
export default function DraftTag({ children = 'Draft listing, to review' }) {
  return <span className="draft-tag" title="Drafted during the rebuild. Not yet reviewed.">{children}</span>;
}
