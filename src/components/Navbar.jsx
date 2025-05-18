'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import UserDropdown from './UserDropdown';
import Image from 'next/image';
import logo from '../../public/img/coursehab-high-resolution-logo.png';
import './navbar.css';
import LanguageSwitcher from './LanguageSwitcher';
import {useTranslation} from 'react-i18next';
import Cart_icon from './Cart_icon';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
const { t } = useTranslation();
  const navLinks = [
    { name: t('nav_links.home'), path: '/' },
    { name: t('nav_links.about'), path: '/about' },
    { name: t('nav_links.courses'), path: '/course' },
    { name: t('nav_links.blog'), path: '/blog' },
    { name: t('nav_links.contact'), path: '/contact' }
  ];

  return (
    <nav className="navbara">
      <div className="navbar-container">
        <div className="navbar-content">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <Image src={logo} alt="Coursehab Logo" width={200} height={40}/>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          {navLinks.map(({ name, path }) => (
            <Link key={name} href={path} className="nav-link">
              {name}
            </Link>
          ))}
        </div>        
        </div>

        <div className="dropdown-container">

        {/*Cart icon */}
          <Cart_icon/>          
        {/* User Dropdown */}
          <UserDropdown />
        {/*Language Dropdown */}
          <LanguageSwitcher />

        </div>
        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="navbar-toggle">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ name, path }) => (
            <Link key={name} href={path} className="mobile-link">
              {name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
