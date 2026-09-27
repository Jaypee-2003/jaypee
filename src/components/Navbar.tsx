import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { theme } from '../styles/theme';
import jpMark from '../assets/brand/jp-mark.png';
import { availability, contact } from '../data/profile';
import { LocalTime } from '../content/kit';
import { DWELLS, NavSection, SECTIONS, sectionForStop, stopIndex } from '../site/stops';
import { scrollToStop, useActiveStop } from '../site/store';
import { SiteMode, SiteModeState } from '../site/mode';
import { setTimeOfDay, useTimeOfDay } from '../site/timeOfDay';

// The nav isn't a bar laid over the site; it belongs to it. There's no panel: the top of the frame
// just deepens into the sky (in 3D) or the page (plain), and the sections sit in it as stations on a
// route line — the same signal lamps as the yard. The line fills with amber as you travel, passed
// stations stay lit, and at night the current one glows.
// Colours come from the themed variables in index.css (--nav-scrim is the colour the frame deepens to).

const breathe = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

const AMBER_RGB = '240 161 58';

// Signal lamp: unlit is a ring, lit is amber
const lamp = (size: number) => `
  flex-shrink: 0;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: rgb(var(--nav-scrim));
  box-shadow: inset 0 0 0 1.5px ${theme.ui.textDim};
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
`;

const lit = `
  background: ${theme.colors.amber};
  box-shadow: none;
`;

// At night a lit lamp throws light; by day it's just amber
const glowing = `
  :root[data-theme='night'] & {
    box-shadow: 0 0 0 3px rgb(${AMBER_RGB} / 0.16), 0 0 14px 3px rgb(${AMBER_RGB} / 0.55);
  }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  /* Plain page: the page colour itself, easing out below the bar instead of ending in a line */
  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: calc(${theme.layout.navHeight} + 0.9rem);
    z-index: -1;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgb(var(--nav-scrim)) 0,
      rgb(var(--nav-scrim)) ${theme.layout.navHeight},
      rgb(var(--nav-scrim) / 0) 100%
    );
    transition: opacity 0.4s ease;
  }

  /* 3D: no bar at all — the sky just deepens toward the top of the frame */
  :root[data-view='scene'] &::before {
    height: calc(${theme.layout.navHeight} + 3.25rem);
    background: linear-gradient(
      to bottom,
      rgb(var(--nav-scrim) / 0.82) 0%,
      rgb(var(--nav-scrim) / 0.5) 42%,
      rgb(var(--nav-scrim) / 0.16) 72%,
      rgb(var(--nav-scrim) / 0) 100%
    );
  }
`;

const Bar = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1440px;
  height: ${theme.layout.navHeight};
  margin: 0 auto;
  padding: 0 ${theme.layout.gutter};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  /* Over the live scene, lettering carries a soft halo of the sky behind it so it holds over clouds and cranes */
  :root[data-view='scene'] & {
    text-shadow: 0 0 12px rgb(var(--nav-scrim) / 0.9), 0 1px 2px rgb(var(--nav-scrim) / 0.7);
  }
`;

/* ───────── brand: mark, name, live availability ───────── */

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: ${theme.ui.text};

  img {
    display: block;
    height: 2.5rem;
    width: auto;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &:hover img {
    transform: rotate(-6deg) scale(1.04);
  }

  &:focus-visible {
    outline-offset: 4px;
  }
`;

const BrandText = styled.span`
  display: grid;
  gap: 4px;

  strong {
    font-family: ${theme.fonts.display};
    font-weight: 900;
    font-size: 1.4rem;
    line-height: 1;
    letter-spacing: 0.08em;
  }
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 0.68rem;
  line-height: 1;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${theme.ui.textMuted};

  &::before {
    content: '';
    ${lamp(7)}
    ${lit}
    animation: ${breathe} 2.8s ease-in-out infinite;
    ${glowing}
  }

  /* small phones: the short form, so it stays on one line beside the buttons */
  .short {
    display: none;
  }
  @media (max-width: 440px) {
    .full {
      display: none;
    }
    .short {
      display: inline;
    }
  }
`;

/* ───────── desktop: the route line ───────── */

const RouteLine = styled.div`
  position: relative;

  @media (max-width: 900px) {
    display: none;
  }
`;

// The line between the first and last stations (placed by JS, which measures the lamps) and its fill
const Track = styled.div`
  position: absolute;
  bottom: 3.5px;
  height: 2px;
  border-radius: 1px;
  background: ${theme.ui.rule};

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, rgb(${AMBER_RGB} / 0.35), ${theme.colors.amber});
    transform: scaleX(0);
    transform-origin: left;
  }
`;

const Stations = styled.ol`
  display: flex;
  align-items: flex-end;
  gap: 1.7rem;

  a {
    display: grid;
    justify-items: center;
    gap: 7px;
    padding-top: 0.35rem;
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 0.92rem;
    line-height: 1;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${theme.ui.textMuted};
    transition: color ${theme.transitions.fast};

    span {
      display: inline-flex;
      align-items: baseline;
      gap: 0.4rem;
    }

    small {
      font-size: 0.68rem;
      letter-spacing: 0.06em;
      color: ${theme.ui.textDim};
      transition: color ${theme.transitions.fast};
    }

    i {
      ${lamp(9)}
      position: relative;
    }

    &[data-passed] i {
      ${lit}
    }

    &:hover {
      color: ${theme.ui.text};

      i {
        transform: scale(1.25);
      }
    }

    &[aria-current] {
      color: ${theme.ui.text};

      small {
        color: ${theme.ui.accentText};
      }

      i {
        ${lit}
        transform: scale(1.3);
        ${glowing}
      }
    }
  }

  @media (max-width: 1180px) {
    gap: 1.25rem;

    small {
      display: none;
    }
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  @media (max-width: 900px) {
    gap: 0.35rem;
  }
`;

// Two-way switch between the live 3D yard and the plain page: two words, the current one underlined in amber
const ViewSwitch = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${theme.ui.textDim};

  button {
    padding: 0.45rem 0.35rem;
    border: none;
    background: none;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: ${theme.ui.textMuted};
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 0.45em;
    text-decoration-color: transparent;
    cursor: pointer;
    transition: color ${theme.transitions.fast}, text-decoration-color ${theme.transitions.fast};

    &:hover {
      color: ${theme.ui.text};
    }

    &[aria-pressed='true'] {
      color: ${theme.ui.text};
      text-decoration-color: ${theme.colors.amber};
      cursor: default;
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

// Night / day as a small switch: moon on the left, sun on the right, and a knob that slides between them
const TimeToggle = styled.button`
  flex-shrink: 0;
  display: inline-grid;
  place-items: center;
  height: 2.75rem;
  padding: 0 0.25rem;
  border: none;
  background: none;
  cursor: pointer;

  > span {
    position: relative;
    display: block;
    width: 3.1rem;
    height: 1.6rem;
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px ${theme.ui.rule};
    background: rgb(var(--nav-scrim) / 0.55);
    transition: box-shadow ${theme.transitions.fast};
  }

  svg {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    margin-top: -6px;
    color: ${theme.ui.textDim};
  }
  .moon {
    left: 0.42rem;
  }
  .sun {
    right: 0.42rem;
  }

  /* The knob carries the current one, in full colour */
  b {
    position: absolute;
    top: 0.2rem;
    left: 0.2rem;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: ${theme.ui.text};
    color: ${theme.colors.ink};
    transition: transform 0.45s cubic-bezier(0.3, 1.4, 0.5, 1), background 0.3s ease;

    svg {
      position: static;
      margin: 0;
      width: 11px;
      height: 11px;
      color: inherit;
    }
  }

  &[data-time='night'] b {
    box-shadow: 0 0 10px rgb(236 228 210 / 0.35);
  }

  &[data-time='day'] b {
    transform: translateX(1.5rem);
    background: ${theme.colors.amber};
  }

  &:hover > span {
    box-shadow: inset 0 0 0 1px ${theme.ui.textMuted};
  }
`;

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" fill="currentColor" />
  </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4.6" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="12" y1="1.8" x2="12" y2="4.4" transform={`rotate(${a} 12 12)`} />
      ))}
    </g>
  </svg>
);

// Phones: how far through the site you are, as a hairline along the very top of the screen
const TopRail = styled.div`
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  z-index: 2;

  span {
    display: block;
    height: 100%;
    background: ${theme.colors.amber};
    transform: scaleX(0);
    transform-origin: left;
  }

  @media (max-width: 900px) {
    display: block;
  }
`;

/* ───────── phone: menu button and the route sheet ───────── */

const MenuButton = styled.button`
  display: none;
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  border: none;
  background: none;
  cursor: pointer;

  span {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 2px;
    border-radius: 1px;
    background: ${theme.ui.text};
    transition: transform ${theme.transitions.fast}, width ${theme.transitions.fast};
  }
  span:first-of-type {
    width: 20px;
    transform: translate(-50%, -4px);
  }
  span:last-of-type {
    width: 13px;
    transform: translate(-3px, 3px);
  }

  &[aria-expanded='true'] {
    span:first-of-type {
      transform: translate(-50%, -1px) rotate(45deg);
    }
    span:last-of-type {
      width: 20px;
      transform: translate(-50%, -1px) rotate(-45deg);
    }
  }

  @media (max-width: 900px) {
    display: inline-block;
  }
`;

// Covers the screen under the bar; the bar (logo, toggle, close) stays on top of it
const Sheet = styled(motion.div)`
  display: none;
  position: fixed;
  inset: 0;
  overflow-y: auto;
  background: ${theme.ui.page};
  padding: calc(${theme.layout.navHeight} + 1.25rem) ${theme.layout.gutter} 2rem;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
  }
`;

const SheetLabel = styled.p`
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${theme.ui.textDim};
`;

// The same route, vertical: a lamp per stop on a line that fills to where you are
const StopsLine = styled.div`
  position: relative;
  margin-top: 0.75rem;
`;

const VTrack = styled.div`
  position: absolute;
  left: 4.5px;
  width: 2px;
  border-radius: 1px;
  background: ${theme.ui.rule};

  span {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(180deg, rgb(${AMBER_RGB} / 0.35), ${theme.colors.amber});
    transform: scaleY(0);
    transform-origin: top;
  }
`;

const Stops = styled.ol`
  position: relative;

  a {
    display: grid;
    grid-template-columns: 11px 1.4rem minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.9rem;
    padding: 0.55rem 0;
    color: ${theme.ui.textMuted};

    i {
      ${lamp(11)}
      position: relative;
    }

    small {
      font-family: ${theme.fonts.display};
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.06em;
      color: ${theme.ui.textDim};
    }

    b {
      font-family: ${theme.fonts.display};
      font-weight: 800;
      font-size: clamp(2rem, 9vw, 2.6rem);
      line-height: 1.05;
      text-transform: uppercase;
    }

    em {
      font-style: normal;
      font-family: ${theme.fonts.display};
      font-weight: 700;
      font-size: 0.72rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: ${theme.ui.accentText};
    }

    &[data-passed] i {
      ${lit}
    }

    &:hover {
      color: ${theme.ui.text};
    }

    &[aria-current] {
      color: ${theme.ui.text};

      i {
        ${lit}
        transform: scale(1.2);
        ${glowing}
      }

      small {
        color: ${theme.ui.accentText};
      }
    }
  }
`;

const SheetFoot = styled.div`
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid ${theme.ui.rule};
  display: grid;
  gap: 1.1rem;

  p {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem 0.6rem;
    font-size: 0.95rem;
    color: ${theme.ui.text};
  }

  p span {
    font-size: 0.85rem;
    color: ${theme.ui.textMuted};
  }

  p::before {
    content: '';
    ${lamp(9)}
    ${lit}
    animation: ${breathe} 2.8s ease-in-out infinite;
    ${glowing}
  }
`;

const StartProject = styled(Link)`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.95rem 1.15rem;
  background: ${theme.ui.text};
  color: ${theme.ui.page};
  font-family: ${theme.fonts.display};
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  &:hover {
    background: ${theme.colors.amber};
    color: ${theme.colors.ink};
  }
`;

const Email = styled.a`
  justify-self: start;
  font-size: 0.95rem;
  color: ${theme.ui.textMuted};
  text-decoration: underline;
  text-decoration-color: ${theme.ui.accentText};
  text-underline-offset: 0.3em;

  &:hover {
    color: ${theme.ui.text};
  }
`;

const CONTACT = SECTIONS.find((s) => s.route === '/contact') ?? SECTIONS[SECTIONS.length - 1];
const pad = (n: number): string => String(n).padStart(2, '0');

// Scroll position at which each section is reached: in 3D, where its stop's dwell begins; on the plain
// page, where its section meets the bottom of the bar. Clamped into the scrollable range, kept increasing.
const sectionAnchors = (mode: SiteMode, navPx: number): number[] => {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  let prev = -1;
  return SECTIONS.map((section, i) => {
    let at = 0;
    if (i > 0) {
      if (mode === 'scene') at = DWELLS[stopIndex(section.stop)][0] * window.innerHeight;
      else {
        const el = document.getElementById(section.stop);
        at = el ? el.getBoundingClientRect().top + window.scrollY - navPx : 0;
      }
    }
    at = Math.min(Math.max(at, prev + 1), max + i);
    prev = at;
    return at;
  });
};

// Fractional section index for a scroll position: 2.5 is halfway from the 3rd section to the 4th
const sectionProgress = (anchors: number[], y: number): number => {
  if (y <= anchors[0]) return 0;
  for (let i = 1; i < anchors.length; i++) {
    if (y < anchors[i]) return i - 1 + (y - anchors[i - 1]) / (anchors[i] - anchors[i - 1]);
  }
  return anchors.length - 1;
};

// Where along a row of lamps the fill should reach, as a share of the first-to-last distance
const fillShare = (centers: number[], f: number): number => {
  const span = centers[centers.length - 1] - centers[0];
  if (span <= 0) return 0;
  const i = Math.min(Math.floor(f), centers.length - 2);
  const at = centers[i] + (centers[i + 1] - centers[i]) * (f - i);
  return Math.min(Math.max((at - centers[0]) / span, 0), 1);
};

const Navbar: React.FC<{ site: SiteModeState }> = ({ site }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const current = sectionForStop(useActiveStop());
  const time = useTimeOfDay();
  const nextTime = time === 'night' ? 'day' : 'night';
  // Named for what it changes: the light in the 3D yard, the theme on the plain page
  const timeLabel =
    site.mode === 'scene' ? `Switch to ${nextTime}` : `Switch to ${nextTime === 'day' ? 'light' : 'dark'} theme`;
  const still = useReducedMotion();
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstStop = useRef<HTMLAnchorElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const topFill = useRef<HTMLSpanElement>(null);
  const vLine = useRef<HTMLDivElement>(null);
  const vTrack = useRef<HTMLDivElement>(null);
  const vFill = useRef<HTMLSpanElement>(null);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = (): void => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Open: focus moves to the first stop. Escape closes and hands focus back to the button.
  useEffect(() => {
    if (!isMenuOpen) return undefined;
    firstStop.current?.focus();
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape') return;
      setIsMenuOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  // The route line: measured and written straight to the elements once per frame, so scrolling never
  // re-renders the nav. Lamps you've passed are marked for CSS; the fill runs continuously between them.
  useEffect(() => {
    let frame = 0;
    const setPassed = (links: NodeListOf<HTMLAnchorElement>, f: number): void =>
      links.forEach((a, i) => {
        const passed = i <= f + 0.001;
        if (passed !== (a.dataset.passed !== undefined)) {
          if (passed) a.dataset.passed = '';
          else delete a.dataset.passed;
        }
      });
    const draw = (): void => {
      frame = 0;
      const navPx = bar.current?.offsetHeight ?? 64;
      const f = sectionProgress(sectionAnchors(site.mode, navPx), window.scrollY);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (topFill.current) topFill.current.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;

      // Desktop: a horizontal line from the first lamp to the last
      if (line.current && track.current && fill.current && line.current.offsetParent) {
        const box = line.current.getBoundingClientRect();
        const lamps = line.current.querySelectorAll('i');
        const xs = Array.from(lamps, (el) => {
          const r = el.getBoundingClientRect();
          return r.left + r.width / 2 - box.left;
        });
        if (xs.length > 1) {
          track.current.style.left = `${xs[0]}px`;
          track.current.style.width = `${xs[xs.length - 1] - xs[0]}px`;
          fill.current.style.transform = `scaleX(${fillShare(xs, f)})`;
        }
        setPassed(line.current.querySelectorAll('a'), f);
      }

      // Phone menu: the same, vertically
      if (vLine.current && vTrack.current && vFill.current) {
        const box = vLine.current.getBoundingClientRect();
        const lamps = vLine.current.querySelectorAll('i');
        const ys = Array.from(lamps, (el) => {
          const r = el.getBoundingClientRect();
          return r.top + r.height / 2 - box.top;
        });
        if (ys.length > 1) {
          vTrack.current.style.top = `${ys[0]}px`;
          vTrack.current.style.height = `${ys[ys.length - 1] - ys[0]}px`;
          vFill.current.style.transform = `scaleY(${fillShare(ys, f)})`;
        }
        setPassed(vLine.current.querySelectorAll('a'), f);
      }
    };
    const schedule = (): void => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.documentElement);
    if (line.current) resize.observe(line.current);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule);
    schedule();
    // The menu sheet animates in: measure again once it has landed
    const settle = isMenuOpen ? window.setTimeout(schedule, 260) : 0;
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [site.mode, isMenuOpen]);

  // Following a link to the section already in the URL doesn't change the route, so move there directly
  const go = (section: NavSection) => (): void => {
    if (section.route === location.pathname) scrollToStop(section.stop);
  };

  return (
    <Nav aria-label="Sections">
      <TopRail aria-hidden="true">
        <span ref={topFill} />
      </TopRail>

      <Bar ref={bar}>
        <Brand to="/" onClick={go(SECTIONS[0])} aria-label="Jaypee — Jayprakash Behera, home">
          <img src={jpMark} alt="" width={132} height={102} />
          <BrandText>
            <strong>JAYPEE</strong>
            <Status>
              <span className="full">{availability.status}</span>
              <span className="short" aria-hidden="true">
                Available for work
              </span>
            </Status>
          </BrandText>
        </Brand>

        <Right>
          <RouteLine ref={line}>
            <Track ref={track} aria-hidden="true">
              <span ref={fill} />
            </Track>
            <Stations>
              {SECTIONS.map((section, i) => (
                <li key={section.route}>
                  <Link
                    to={section.route}
                    onClick={go(section)}
                    aria-current={section === current ? 'location' : undefined}
                  >
                    <span>
                      <small aria-hidden="true">{pad(i + 1)}</small>
                      {section.label}
                    </span>
                    <i aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </Stations>
          </RouteLine>

          {site.canScene && (
            <ViewSwitch role="group" aria-label="View">
              <button type="button" aria-pressed={site.mode === 'scene'} onClick={() => site.choose('scene')}>
                3D
              </button>
              <span aria-hidden="true">/</span>
              <button type="button" aria-pressed={site.mode === 'document'} onClick={() => site.choose('document')}>
                Plain
              </button>
            </ViewSwitch>
          )}

          <TimeToggle
            type="button"
            data-time={time}
            onClick={() => setTimeOfDay(nextTime)}
            aria-label={timeLabel}
            title={timeLabel}
          >
            <span>
              <MoonIcon className="moon" />
              <SunIcon className="sun" />
              <b>{time === 'night' ? <MoonIcon /> : <SunIcon />}</b>
            </span>
          </TimeToggle>

          <MenuButton
            ref={menuButton}
            type="button"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
          >
            <span />
            <span />
          </MenuButton>
        </Right>
      </Bar>

      <AnimatePresence>
        {isMenuOpen && (
          <Sheet
            id="site-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: still ? 0 : 0.22, ease: 'easeOut' }}
          >
            <SheetLabel>
              Route · {SECTIONS.length} stops
            </SheetLabel>
            <StopsLine ref={vLine}>
              <VTrack ref={vTrack} aria-hidden="true">
                <span ref={vFill} />
              </VTrack>
              <Stops>
                {SECTIONS.map((section, i) => (
                  <li key={section.route}>
                    <Link
                      ref={i === 0 ? firstStop : undefined}
                      to={section.route}
                      aria-current={section === current ? 'location' : undefined}
                      onClick={() => {
                        go(section)();
                        closeMenu();
                      }}
                    >
                      <i aria-hidden="true" />
                      <small aria-hidden="true">{pad(i + 1)}</small>
                      <b>{section.label}</b>
                      {section === current && <em>Here</em>}
                    </Link>
                  </li>
                ))}
              </Stops>
            </StopsLine>

            <SheetFoot>
              <p>
                {availability.status}
                <span>
                  <LocalTime /> · {availability.timeZoneLabel}
                </span>
              </p>
              <StartProject
                to={CONTACT.route}
                onClick={() => {
                  go(CONTACT)();
                  closeMenu();
                }}
              >
                Start a project <span aria-hidden="true">→</span>
              </StartProject>
              <Email href={`mailto:${contact.email}`}>{contact.email}</Email>
            </SheetFoot>
          </Sheet>
        )}
      </AnimatePresence>
    </Nav>
  );
};

export default Navbar;
