import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { theme } from '../styles/theme';
import jpMark from '../assets/brand/jp-mark.png';
import { availability, contact } from '../data/profile';
import { LocalTime } from '../content/kit';
import { NavSection, SECTIONS, sectionForStop } from '../site/stops';
import { scrollToStop, useActiveStop } from '../site/store';
import { SiteModeState } from '../site/mode';
import { setTimeOfDay, useTimeOfDay } from '../site/timeOfDay';

// The nav is the yard's signal board: each section is a numbered stop with a lamp, the current stop's
// lamp is lit, and a rail along the bottom fills as you travel the route. Solid, nothing translucent:
// ink by night, paper by day (colours are the themed --bar / --text variables in index.css).

const breathe = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
`;

// Signal lamp: lit (amber) or unlit (a ring). Flat colour — the scene's real lamps do the glowing.
const lamp = (size: number) => `
  flex-shrink: 0;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: ${theme.ui.bar};
  box-shadow: inset 0 0 0 1.5px ${theme.ui.textDim};
  transition: background ${theme.transitions.fast}, box-shadow ${theme.transitions.fast};
`;

const lit = `
  background: ${theme.colors.amber};
  box-shadow: none;
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${theme.ui.bar};
  transition: background-color 0.9s ease;
`;

const Bar = styled.div`
  position: relative;
  max-width: 1440px;
  height: ${theme.layout.navHeight};
  margin: 0 auto;
  padding: 0 ${theme.layout.gutter};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
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
    letter-spacing: 0.06em;
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

/* ───────── desktop: the route as a row of signal lamps ───────── */

const Route = styled.ol`
  display: flex;
  align-items: center;
  gap: 1.6rem;

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 0.95rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${theme.ui.textMuted};
    transition: color ${theme.transitions.fast};

    i {
      ${lamp(7)}
    }

    small {
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      color: ${theme.ui.textDim};
      transition: color ${theme.transitions.fast};
    }

    &:hover {
      color: ${theme.ui.text};

      i {
        box-shadow: inset 0 0 0 1.5px ${theme.ui.text};
      }
    }

    &[aria-current] {
      color: ${theme.ui.text};

      i {
        ${lit}
      }

      small {
        color: ${theme.ui.accentText};
      }
    }
  }

  @media (max-width: 1180px) {
    gap: 1.25rem;

    small {
      display: none;
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1.75rem;

  @media (max-width: 900px) {
    gap: 0.5rem;
  }
`;

// Night / day. In the 3D view it changes the light in the yard; on the plain page, the theme.
// Shows the current time of day: a moon at night, a sun by day.
const TimeToggle = styled.button`
  position: relative;
  flex-shrink: 0;
  width: 2.2rem;
  height: 2.2rem;
  display: inline-grid;
  place-items: center;
  border: 1px solid ${theme.ui.rule};
  background: none;
  color: ${theme.ui.text};
  cursor: pointer;
  transition: border-color ${theme.transitions.fast};

  svg {
    grid-area: 1 / 1;
    width: 18px;
    height: 18px;
    transition: opacity 0.35s ease, transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .sun {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }

  &[data-time='day'] {
    .sun {
      opacity: 1;
      transform: none;
    }
    .moon {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }
  }

  &:hover {
    border-color: ${theme.ui.textMuted};
  }

  @media (max-width: 900px) {
    width: 2.75rem;
    height: 2.75rem;
  }
`;

const Moon: React.FC = () => (
  <svg className="moon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" fill="currentColor" />
  </svg>
);

const Sun: React.FC = () => (
  <svg className="sun" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" fill={theme.colors.amber} />
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="12" y1="2.6" x2="12" y2="5" transform={`rotate(${a} 12 12)`} />
      ))}
    </g>
  </svg>
);

// Two-way switch between the live 3D yard and the plain page
const ViewSwitch = styled.div`
  display: inline-flex;
  border: 1px solid ${theme.ui.rule};

  button {
    padding: 0.4rem 0.65rem;
    border: none;
    background: none;
    font-family: ${theme.fonts.display};
    font-weight: 700;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${theme.ui.textMuted};
    cursor: pointer;
    transition: color ${theme.transitions.fast}, background ${theme.transitions.fast};

    &:hover {
      color: ${theme.ui.text};
    }

    &[aria-pressed='true'] {
      background: ${theme.ui.text};
      color: ${theme.ui.bar};
      cursor: default;
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

// Progress along the route: fills as the page scrolls (in 3D, as the camera travels the yard)
const Rail = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: ${theme.ui.rule};

  span {
    display: block;
    height: 100%;
    background: ${theme.colors.amber};
    transform: scaleX(0);
    transform-origin: left;
  }
`;

/* ───────── phone: menu button and the route sheet ───────── */

const MenuButton = styled.button`
  display: none;
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid ${theme.ui.rule};
  background: none;
  cursor: pointer;

  span {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18px;
    height: 2px;
    background: ${theme.ui.text};
    transition: transform ${theme.transitions.fast};
  }
  span:first-of-type {
    transform: translate(-50%, -4px);
  }
  span:last-of-type {
    transform: translate(-50%, 3px);
  }

  &[aria-expanded='true'] {
    span:first-of-type {
      transform: translate(-50%, -1px) rotate(45deg);
    }
    span:last-of-type {
      transform: translate(-50%, -1px) rotate(-45deg);
    }
  }

  @media (max-width: 900px) {
    display: inline-block;
  }
`;

// Opens under the bar, so the logo and the close button stay where they were
const Sheet = styled(motion.div)`
  display: none;
  position: fixed;
  top: ${theme.layout.navHeight};
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  background: ${theme.ui.bar};
  border-top: 1px solid ${theme.ui.rule};
  padding: 1.75rem ${theme.layout.gutter} 2rem;

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

// The stops as a route line: a lamp per stop on a vertical rail, the current one lit
const Stops = styled.ol`
  position: relative;
  margin-top: 0.75rem;

  &::before {
    content: '';
    position: absolute;
    left: 5px;
    top: 1.6rem;
    bottom: 1.6rem;
    width: 1px;
    background: ${theme.ui.rule};
  }

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

    &:hover {
      color: ${theme.ui.text};
    }

    &[aria-current] {
      color: ${theme.ui.text};

      i {
        ${lit}
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
  }
`;

const StartProject = styled(Link)`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.95rem 1.15rem;
  background: ${theme.ui.text};
  color: ${theme.ui.bar};
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
  const rail = useRef<HTMLSpanElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstStop = useRef<HTMLAnchorElement>(null);

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

  // Route rail: written straight to the element once per frame, so scrolling never re-renders the nav
  useEffect(() => {
    let frame = 0;
    const draw = (): void => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      if (rail.current) rail.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = (): void => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(document.documentElement);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [site.mode]);

  // Following a link to the section already in the URL doesn't change the route, so move there directly
  const go = (section: NavSection) => (): void => {
    if (section.route === location.pathname) scrollToStop(section.stop);
  };

  return (
    <Nav aria-label="Sections">
      <Bar>
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
          <Route>
            {SECTIONS.map((section, i) => (
              <li key={section.route}>
                <Link
                  to={section.route}
                  onClick={go(section)}
                  aria-current={section === current ? 'location' : undefined}
                >
                  <i aria-hidden="true" />
                  <small aria-hidden="true">{pad(i + 1)}</small>
                  {section.label}
                </Link>
              </li>
            ))}
          </Route>

          {site.canScene && (
            <ViewSwitch role="group" aria-label="View">
              <button type="button" aria-pressed={site.mode === 'scene'} onClick={() => site.choose('scene')}>
                3D
              </button>
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
            <Moon />
            <Sun />
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

        <Rail aria-hidden="true">
          <span ref={rail} />
        </Rail>
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
