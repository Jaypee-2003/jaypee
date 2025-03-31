import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { theme } from '../styles/theme';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${theme.colors.bgCard};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.colors.highlightTransparent};
  box-shadow: ${theme.shadows.card};
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.accent};
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  transition: ${theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    text-shadow: ${theme.shadows.glow};
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  a {
    color: ${theme.colors.textPrimary};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    position: relative;
    padding: 0.5rem 0;

    &:hover {
      color: ${theme.colors.accent};
    }

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: 0;
      left: 0;
      background: ${theme.colors.accent};
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }

    &.active {
      color: ${theme.colors.accent};
      &::after {
        width: 100%;
      }
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.textPrimary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${theme.borderRadius.small};
  transition: ${theme.transitions.default};
  z-index: 1001;

  &:hover {
    color: ${theme.colors.accent};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background: ${theme.colors.bgCard};
  backdrop-filter: blur(10px);
  padding: 5rem 2rem 2rem;
  z-index: 1000;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const MobileNavLink = styled(Link)`
  color: ${theme.colors.textPrimary};
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 500;
  padding: 0.5rem;
  transition: ${theme.transitions.default};
  position: relative;
  width: 100%;
  text-align: center;

  &:hover {
    color: ${theme.colors.accent};
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: ${theme.colors.accent};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 50%;
  }

  &.active {
    color: ${theme.colors.accent};
    &::after {
      width: 50%;
    }
  }
`;

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();

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

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">JP</Logo>
        <NavLinks>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            About
          </Link>
          <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>
            Projects
          </Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
            Contact
          </Link>
        </NavLinks>
        <MobileMenuButton onClick={toggleMenu} aria-label="Toggle menu">
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
            <MobileNavLink to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={closeMenu}>
              About
            </MobileNavLink>
            <MobileNavLink to="/projects" className={location.pathname === '/projects' ? 'active' : ''} onClick={closeMenu}>
              Projects
            </MobileNavLink>
            <MobileNavLink to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={closeMenu}>
              Contact
            </MobileNavLink>
          </MobileMenu>
        )}
      </AnimatePresence>
    </Nav>
  );
};

export default Navbar; 