import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { FaHome, FaUser, FaCode, FaEnvelope, FaBars } from 'react-icons/fa';
import { theme } from '../styles/theme';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${theme.colors.bgCard};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.colors.highlightTransparent};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${theme.shadows.card};
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: ${theme.borderRadius.small};
  transition: ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.accent};
    transform: translateY(-2px);
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

    &:hover {
      color: ${theme.colors.accent};
    }

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
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

const NavLink = styled(Link)`
  color: ${theme.colors.textMuted};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: ${theme.borderRadius.small};
  transition: ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.accent};
    transform: translateY(-2px);
  }

  &.active {
    color: ${theme.colors.accent};
    background: ${theme.colors.bgGlass};
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.textPrimary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${theme.borderRadius.small};
  transition: ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.accent};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    display: block;
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

  &:hover {
    color: ${theme.colors.accent};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/about', icon: FaUser, label: 'About' },
    { path: '/projects', icon: FaCode, label: 'Projects' },
    { path: '/contact', icon: FaEnvelope, label: 'Contact' },
  ];

  return (
    <NavContainer>
      <Logo to="/">
        <FaCode /> JP
      </Logo>
      <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? '✕' : '☰'}
      </MenuButton>
      <NavLinks className={isMenuOpen ? 'active' : ''}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            onClick={() => setIsMenuOpen(false)}
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </NavLinks>
      <MobileMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <FaBars />
      </MobileMenuButton>
    </NavContainer>
  );
};

export default Navbar; 