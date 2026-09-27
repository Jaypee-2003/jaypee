import React, { lazy, Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import DocumentSite from './document/DocumentSite';
import { RouteSync } from './site/RouteSync';
import { stillStop, useSiteMode } from './site/mode';

// The 3D yard is its own chunk (three, drei, troika): phones and reduced-motion visitors never load it
const SceneSite = lazy(() => import('./scene/SceneSite'));

const App: React.FC = () => {
  const site = useSiteMode();

  return (
    <HashRouter>
      <RouteSync mode={site.mode} />
      {!stillStop && <Navbar site={site} />}
      {site.mode === 'scene' ? (
        <Suspense fallback={null}>
          <SceneSite onFail={site.fail} />
        </Suspense>
      ) : (
        <DocumentSite />
      )}
    </HashRouter>
  );
};

export default App;
