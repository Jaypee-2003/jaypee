import React from 'react';
import ReactDOM from 'react-dom/client';
// Fonts are self-hosted (bundled from @fontsource): the site makes no requests to anyone but itself
import '@fontsource/big-shoulders-display/600';
import '@fontsource/big-shoulders-display/700';
import '@fontsource/big-shoulders-display/800';
import '@fontsource/big-shoulders-display/900';
import '@fontsource/archivo/400';
import '@fontsource/archivo/400-italic';
import '@fontsource/archivo/500';
import '@fontsource/archivo/600';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
