import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'membership', href: '#membership' },
    { key: 'advisory', href: '#advisory' },
    { key: 'activities', href: '#activities' },
    { key: 'projects', href: '#projects' },
    { key: 'contact', href: '#contact' }
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      dir="ltr"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-primary-900 shadow-lg' : 'bg-primary-900/95'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Always on the left */}
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-2">
              <img 
                src="/logo.png" 
                alt="AFDEI Logo" 
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-white hover:text-primary-200 transition-colors duration-200 font-medium"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </nav>

          {/* Language Toggle & Mobile Menu - Always on the right */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-white hover:text-primary-200 transition-colors duration-200 px-3 py-2 rounded-lg bg-primary-800/50 hover:bg-primary-800"
            >
              <Globe className="w-5 h-5" />
              <span className="font-medium">
                {i18n.language === 'en' ? 'العربية' : 'English'}
              </span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-primary-200 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-primary-800 border-t border-primary-700"
          >
            <nav className="container mx-auto px-4 py-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="block py-3 text-white hover:text-primary-200 transition-colors duration-200 font-medium"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;


