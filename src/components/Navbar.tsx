import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { theme } from '../styles/theme';
import jpMark from '../assets/brand/jp-mark.png';
import { NavSection, SECTIONS, sectionForStop } from '../site/stops';
import { scrollToStop, useActiveStop } from '../site/store';
import { SiteModeState } from '../site/mode';

// A solid ink strip across the top of the frame — nothing translucent, nothing blurred
const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${theme.colors.ink};
  border-bottom: 1px solid ${theme.colors.ruleOnInk};
`;

const NavContainer = styled.div`
  max-width: 1440px;
  height: ${theme.layout.navHeight};
  margin: 0 auto;
  padding: 0 ${theme.layout.gutter};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: ${theme.fonts.display};
  font-weight: 900;
  font-size: 1.35rem;
  letter-spacing: 0.06em;
  color: ${theme.colors.bone};

  /* the JP mark: dark letters rim-lit in amber on a transparent ground, set straight on the ink bar */
  img {
    display: block;
    height: 2.1rem;
    width: auto;
  }
`;

const navType = `
  font-family: ${theme.fonts.display};
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.9rem;
  align-items: center;

  a {
    ${navType}
    color: ${theme.colors.boneMuted};
    padding: 0.4rem 0;
    border-bottom: 2px solid transparent;
    transition: color ${theme.transitions.fast}, border-color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.bone};
    }

    &.active {
      color: ${theme.colors.bone};
      border-bottom-color: ${theme.colors.amber};
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

// Switch between the live 3D yard and the plain document
const ViewToggle = styled.button`
  ${navType}
  font-size: 0.85rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid ${theme.colors.ruleOnInk};
  background: none;
  color: ${theme.colors.boneMuted};
  cursor: pointer;
  transition: color ${theme.transitions.fast}, border-color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.bone};
    border-color: ${theme.colors.boneDim};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: 1px solid ${theme.colors.ruleOnInk};
  color: ${theme.colors.bone};
  font-size: 1.1rem;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  z-index: 1001;

  @media (max-width: 900px) {
    display: inline-flex;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: ${theme.colors.ink};
  padding: calc(${theme.layout.navHeight} + 2rem) ${theme.layout.gutter} 2rem;
  z-index: 1000;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
  }
`;

const MobileNavLink = styled(Link)`
  font-family: ${theme.fonts.display};
  font-weight: 800;
  font-size: 2.6rem;
  line-height: 1.1;
  text-transform: uppercase;
  color: ${theme.colors.boneMuted};
  padding: 0.55rem 0;
  border-bottom: 1px solid ${theme.colors.ruleOnInk};

  &:hover {
    color: ${theme.colors.bone};
  }

  &.active {
    color: ${theme.colors.amber};
  }
`;

const Navbar: React.FC<{ site: SiteModeState }> = ({ site }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const current = sectionForStop(useActiveStop());

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

  // Following a link to the section already in the URL doesn't change the route, so move there directly
  const go = (section: NavSection) => (): void => {
    if (section.route === location.pathname) scrollToStop(section.stop);
  };

  return (
    <Nav aria-label="Sections">
      <NavContainer>
        <Logo to="/" onClick={go(SECTIONS[0])} aria-label="Jayprakash Behera — home">
          <img src={jpMark} alt="" width={132} height={102} />
          JAYPEE
        </Logo>
        <NavLinks>
          {SECTIONS.map((section) => (
            <Link
              key={section.route}
              to={section.route}
              onClick={go(section)}
              className={section === current ? 'active' : ''}
              aria-current={section === current ? 'location' : undefined}
            >
              {section.label}
            </Link>
          ))}
          {site.canScene && (
            <ViewToggle type="button" onClick={() => site.choose(site.mode === 'scene' ? 'document' : 'scene')}>
              {site.mode === 'scene' ? 'Plain view' : '3D view'}
            </ViewToggle>
          )}
        </NavLinks>
        <MobileMenuButton onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>

      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {SECTIONS.map((section) => (
              <MobileNavLink
                key={section.route}
                to={section.route}
                className={section === current ? 'active' : ''}
                onClick={() => {
                  go(section)();
                  closeMenu();
                }}
              >
                {section.label}
              </MobileNavLink>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </Nav>
  );
};

export default Navbar;
