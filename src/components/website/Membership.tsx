import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Award, Globe, Briefcase } from 'lucide-react';
import api from '../../lib/api';

const defaultContent = {
  en: { title: 'Membership', subtitle: 'Join Our Growing Network', description: 'Become a member of the Arab Federation for Development and Economic Integration.', benefits: ['Access to exclusive networking opportunities', 'Recognition as a leader in Arab economic development', 'Participation in regional and international events', 'Business development and partnership opportunities'], buttonText: 'Join Us', memberCount: '500+', memberLabel: 'Active Members' },
  ar: { title: 'العضوية', subtitle: 'انضم إلى شبكتنا المتنامية', description: 'كن عضواً في الاتحاد العربي للتنمية والتكامل الاقتصادي.', benefits: ['الوصول إلى فرص التواصل الحصرية', 'الاعتراف كقائد في التنمية الاقتصادية العربية', 'المشاركة في الفعاليات الإقليمية والدولية', 'فرص تطوير الأعمال والشراكة'], buttonText: 'انضم إلينا', memberCount: '+500', memberLabel: 'عضو نشط' }
};

const Membership: React.FC = () => {
  const { i18n } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [content, setContent] = useState(defaultContent);
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

  useEffect(() => {
    api.get('/api/content/section/membership').then(res => { if (res.data?.content?.en && res.data?.content?.ar) setContent(res.data.content); }).catch(console.error);
  }, []);

  const displayContent = content[currentLang] || defaultContent[currentLang];
  const icons = [Users, Award, Globe, Briefcase];

  return (
    <section id="membership" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">{displayContent?.title}</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
            <h3 className="text-3xl font-bold text-primary-900 mb-6">{displayContent?.subtitle}</h3>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{displayContent?.description}</p>
            <div className="space-y-4 mb-8">
              {(displayContent?.benefits || []).map((benefit, index) => { const Icon = icons[index % icons.length]; return (<motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }} className="flex items-center gap-3"><Icon className="w-6 h-6 text-primary-600 flex-shrink-0" /><span className="text-gray-700">{benefit}</span></motion.div>);})}
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-primary-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-800 transition-colors duration-300 shadow-lg">{displayContent?.buttonText}</motion.button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="relative">
            <img src="https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Team collaboration" className="rounded-2xl shadow-2xl" />
            <div className="absolute -bottom-6 -start-6 bg-primary-600 text-white p-6 rounded-xl shadow-xl"><div className="text-4xl font-bold">{displayContent?.memberCount}</div><div className="text-sm">{displayContent?.memberLabel}</div></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Membership;
