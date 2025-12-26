import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import api from '../../lib/api';

interface LangContent {
  title: string;
  subtitle: string;
  description: string;
}

interface HeroContent {
  en: LangContent;
  ar: LangContent;
}

const defaultContent: HeroContent = {
  en: {
    title: 'Arab Federation for Development and Economic Integration',
    subtitle: 'Enhancing development and economic integration in Arab countries',
    description: 'The Arab Federation for Development and Economic Integration operates under the Council of Arab Economic Unity, part of the League of Arab States, headquartered in Cairo, Egypt.'
  },
  ar: {
    title: 'الاتحاد العربي للتنمية والتكامل الاقتصادي',
    subtitle: 'تعزيز التنمية والتكامل الاقتصادي في الدول العربية',
    description: 'يعمل الاتحاد العربي للتنمية والتكامل الاقتصادي تحت مظلة مجلس الوحدة الاقتصادية العربية التابع لجامعة الدول العربية، ومقره في القاهرة، مصر.'
  }
};

const Hero: React.FC = () => {
  const { i18n } = useTranslation();
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('/api/content/section/hero');
        if (response.data?.content?.en && response.data?.content?.ar) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error('Failed to fetch hero content:', error);
      }
    };
    fetchContent();
  }, []);

  const displayContent = content[currentLang] || defaultContent[currentLang];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2"
          alt="Business meeting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-primary-900/70 to-primary-900/90" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{displayContent?.title || ''}</h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">{displayContent?.subtitle || ''}</p>
          <p className="text-lg md:text-xl text-primary-50 max-w-4xl mx-auto mb-12">{displayContent?.description || ''}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <a href="#about" onClick={(e) => { e.preventDefault(); document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex flex-col items-center text-white hover:text-primary-200 transition-colors duration-200">
            <ChevronDown className="w-8 h-8 animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
