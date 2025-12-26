import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building2, Users, Briefcase, Globe } from 'lucide-react';
import api from '../../lib/api';

const defaultContent = {
  en: { title: 'Advisory Bodies', subtitle: 'Our advisory bodies bring together experts and leaders.', bodies: [{ title: 'Economic Development Committee', description: 'Focuses on strategic economic planning.', members: 12 }, { title: 'Social Integration Council', description: 'Works on social policies.', members: 10 }, { title: 'Business Advisory Board', description: 'Provides guidance on private sector.', members: 15 }, { title: 'International Relations Committee', description: 'Manages partnerships.', members: 8 }] },
  ar: { title: 'الهيئات الاستشارية', subtitle: 'تجمع هيئاتنا الاستشارية الخبراء والقادة.', bodies: [{ title: 'لجنة التنمية الاقتصادية', description: 'تركز على التخطيط الاقتصادي.', members: 12 }, { title: 'مجلس التكامل الاجتماعي', description: 'يعمل على السياسات الاجتماعية.', members: 10 }, { title: 'المجلس الاستشاري للأعمال', description: 'يوفر التوجيه.', members: 15 }, { title: 'لجنة العلاقات الدولية', description: 'تدير الشراكات.', members: 8 }] }
};

const AdvisoryBodies: React.FC = () => {
  const { i18n } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [content, setContent] = useState(defaultContent);
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

  useEffect(() => {
    api.get('/api/content/section/advisory').then(res => { if (res.data?.content?.en && res.data?.content?.ar) setContent(res.data.content); }).catch(console.error);
  }, []);

  const displayContent = content[currentLang] || defaultContent[currentLang];
  const icons = [Building2, Users, Briefcase, Globe];

  return (
    <section id="advisory" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">{displayContent?.title}</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">{displayContent?.subtitle}</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {(displayContent?.bodies || []).map((body, index) => { const Icon = icons[index % icons.length]; return (<motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"><div className="flex items-center mb-4"><div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center me-4"><Icon className="w-8 h-8 text-primary-600" /></div><h3 className="text-xl font-bold text-primary-900">{body.title}</h3></div><p className="text-gray-700 mb-4">{body.description}</p><div className="flex items-center text-sm text-primary-600"><Users className="w-4 h-4 me-2" /><span>{body.members} {currentLang === 'ar' ? 'عضو' : 'Members'}</span></div></motion.div>);})}
        </div>
      </div>
    </section>
  );
};

export default AdvisoryBodies;
