import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle } from 'lucide-react';
import api from '../../lib/api';

const Projects: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    api.get('/api/projects').then(res => setProjects(res.data)).catch(() => {
      setProjects([{ _id: '1', name: { en: 'E-Tajer Project', ar: 'مشروع إي تاجر' }, description: { en: 'A comprehensive e-commerce platform connecting Arab businesses.', ar: 'منصة تجارة إلكترونية شاملة تربط الأعمال العربية.' }, objectives: { en: ['Enable digital transformation', 'Create a unified marketplace', 'Support SMEs'], ar: ['تمكين التحول الرقمي', 'إنشاء سوق موحد', 'دعم الشركات الصغيرة'] }, images: [{ url: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800' }], isFeatured: true }]);
    });
  }, []);

  const featuredProject = projects.find(p => p.isFeatured) || projects[0];

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">{t('nav.projects')}</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </motion.div>
        {featuredProject && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="h-64 lg:h-auto"><img src={featuredProject.images?.[0]?.url || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg'} alt={featuredProject.name[i18n.language]} className="w-full h-full object-cover" /></div>
                <div className="p-8 lg:p-12">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">{i18n.language === 'ar' ? 'مشروع مميز' : 'Featured Project'}</span>
                  <h3 className="text-3xl font-bold text-primary-900 mb-4">{featuredProject.name[i18n.language] || featuredProject.name.en}</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">{featuredProject.description[i18n.language] || featuredProject.description.en}</p>
                  <div className="space-y-3">
                    {(featuredProject.objectives[i18n.language] || featuredProject.objectives.en || []).slice(0, 4).map((obj: string, idx: number) => (<div key={idx} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" /><span className="text-gray-700">{obj}</span></div>))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
