// Used only by scripts/flow-test.mjs (clicks through the app in a simulated browser).
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

export function mount(container, url) {
  const root = createRoot(container);
  act(() => root.render(<MemoryRouter initialEntries={[url]}><App /></MemoryRouter>));
  return root;
}
export { act };
