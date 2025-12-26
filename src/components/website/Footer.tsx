import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo & Copyright */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="bg-white rounded-lg p-2">
                <img 
                  src="/logo.png" 
                  alt="AFDEI Logo" 
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <p className="text-primary-100 text-sm">
              {t('footer.copyright')}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


