import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './website/Header';
import Hero from './website/Hero';
import About from './website/About';
import Membership from './website/Membership';
import AdvisoryBodies from './website/AdvisoryBodies';
import Activities from './website/Activities';
import Projects from './website/Projects';
import Contact from './website/Contact';
import Footer from './website/Footer';
import ScrollToTop from './website/ScrollToTop';

const PublicWebsite: React.FC = () => {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  useEffect(() => {
    const handleLanguageChange = () => {
      const isArabic = i18n.language === 'ar';
      setIsRTL(isArabic);
      // Only set lang attribute, not dir (we control dir per-component)
      document.documentElement.lang = i18n.language;
      
      // Update font family based on language
      if (isArabic) {
        document.body.classList.add('font-arabic');
        document.body.classList.remove('font-sans');
      } else {
        document.body.classList.add('font-sans');
        document.body.classList.remove('font-arabic');
      }
    };

    handleLanguageChange();
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header stays LTR - direction is set inside Header component */}
      <Header />
      
      {/* Main content changes direction based on language */}
      <main dir={isRTL ? 'rtl' : 'ltr'}>
        <Hero />
        <About />
        <Membership />
        <AdvisoryBodies />
        <Activities />
        <Projects />
        <Contact />
      </main>
      
      {/* Footer also changes direction */}
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <Footer />
      </div>
      
      <ScrollToTop />
    </div>
  );
};

export default PublicWebsite;


