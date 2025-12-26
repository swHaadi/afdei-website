import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Info, Users, Building2, Mail } from 'lucide-react';
import HomeContent from './content/HomeContent';
import AboutContent from './content/AboutContent';
import MembershipContent from './content/MembershipContent';
import AdvisoryContent from './content/AdvisoryContent';
import ContactContent from './content/ContactContent';

const ContentManager: React.FC = () => {
  const location = useLocation();

  const sections = [
    { path: 'home', label: 'Home', icon: Home },
    { path: 'about', label: 'About Us', icon: Info },
    { path: 'membership', label: 'Membership', icon: Users },
    { path: 'advisory', label: 'Advisory Bodies', icon: Building2 },
    { path: 'contact', label: 'Contact', icon: Mail }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-2">Manage website content in English and Arabic</p>
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex flex-wrap border-b">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = location.pathname.includes(section.path);
            return (
              <Link
                key={section.path}
                to={section.path}
                className={`flex items-center px-6 py-4 border-b-2 transition-colors duration-200 ${
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {section.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Routes */}
      <Routes>
        <Route path="home" element={<HomeContent />} />
        <Route path="about" element={<AboutContent />} />
        <Route path="membership" element={<MembershipContent />} />
        <Route path="advisory" element={<AdvisoryContent />} />
        <Route path="contact" element={<ContactContent />} />
        <Route index element={<HomeContent />} />
      </Routes>
    </div>
  );
};

export default ContentManager;


