import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sectionForRoute, sectionForStop } from './stops';
import { scrollToStop, useActiveStop } from './store';
import { SiteMode } from './mode';

// Keeps the URL and the view in step, in both presentations:
//   URL → view: a nav link, a placard link (#/contact), back/forward or a deep link moves to that stop
//   view → URL: scrolling to another section updates the route in place (no history entries)
export const RouteSync: React.FC<{ mode: SiteMode }> = ({ mode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const active = useActiveStop();
  const fromScroll = useRef(false);
  const arrived = useRef(false);
  const reported = useRef(false);

  useEffect(() => {
    if (fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    scrollToStop(sectionForRoute(pathname).stop, arrived.current);
    arrived.current = true;
  }, [pathname]);

  // A presentation switch lands where the visitor already was
  const lastMode = useRef(mode);
  useEffect(() => {
    if (lastMode.current === mode) return;
    lastMode.current = mode;
    scrollToStop(sectionForRoute(pathname).stop, false);
  }, [mode, pathname]);

  useEffect(() => {
    if (!reported.current) {
      reported.current = true;
      return;
    }
    const section = sectionForStop(active);
    if (section.route !== pathname) {
      fromScroll.current = true;
      navigate(section.route, { replace: true });
    }
    // pathname is read, not tracked: only a change of stop should rewrite the URL
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, navigate]);

  return null;
};
