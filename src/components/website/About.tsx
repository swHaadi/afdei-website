import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Eye, Target, Lightbulb, Leaf, Users, Rocket } from 'lucide-react';
import api from '../../lib/api';

interface LangContent {
  title: string;
  vision: { title: string; content: string };
  mission: { title: string; content: string };
  values: { title: string; leadership: string; empowerment: string; innovation: string; sustainability: string };
  president: { title: string; message: string };
  objectives: { title: string; list: string[] };
}

const defaultContent = {
  en: {
    title: 'About Us',
    vision: { title: 'Vision', content: 'To be the leading force in promoting sustainable economic development and integration across the Arab world.' },
    mission: { title: 'Mission', content: 'To strengthen economic ties between Arab nations and promote sustainable development.' },
    values: { title: 'Our Values', leadership: 'Leadership', empowerment: 'Empowerment', innovation: 'Innovation', sustainability: 'Sustainability' },
    president: { title: "President's Message", message: 'Welcome to the Arab Federation for Development and Economic Integration.' },
    objectives: { title: 'Our Objectives', list: ['Strengthen relationships between Arab economic bodies.', 'Assist the Arab private sector.'] }
  },
  ar: {
    title: 'من نحن',
    vision: { title: 'الرؤية', content: 'أن نكون القوة الرائدة في تعزيز التنمية الاقتصادية المستدامة والتكامل عبر العالم العربي.' },
    mission: { title: 'الرسالة', content: 'تعزيز الروابط الاقتصادية بين الدول العربية وتعزيز التنمية المستدامة.' },
    values: { title: 'قيمنا', leadership: 'القيادة', empowerment: 'التمكين', innovation: 'الابتكار', sustainability: 'الاستدامة' },
    president: { title: 'رسالة الرئيس', message: 'مرحباً بكم في الاتحاد العربي للتنمية والتكامل الاقتصادي.' },
    objectives: { title: 'أهدافنا', list: ['تعزيز العلاقات بين الهيئات الاقتصادية العربية.', 'مساعدة القطاع الخاص العربي.'] }
  }
};

const About: React.FC = () => {
  const { i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('vision');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [content, setContent] = useState(defaultContent);
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('/api/content/section/about');
        if (response.data?.content?.en && response.data?.content?.ar) {
          setContent({ en: { ...defaultContent.en, ...response.data.content.en }, ar: { ...defaultContent.ar, ...response.data.content.ar } });
        }
      } catch (error) { console.error('Failed to fetch about content:', error); }
    };
    fetchContent();
  }, []);

  const displayContent = content[currentLang] || defaultContent[currentLang];
  const values = [{ icon: Rocket, key: 'leadership' as const }, { icon: Users, key: 'empowerment' as const }, { icon: Lightbulb, key: 'innovation' as const }, { icon: Leaf, key: 'sustainability' as const }];
  const tabs = [{ id: 'vision', label: displayContent?.vision?.title || 'Vision' }, { id: 'mission', label: displayContent?.mission?.title || 'Mission' }, { id: 'values', label: displayContent?.values?.title || 'Values' }, { id: 'president', label: displayContent?.president?.title || 'President' }, { id: 'objectives', label: displayContent?.objectives?.title || 'Objectives' }];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">{displayContent?.title || 'About Us'}</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id ? 'bg-primary-900 text-white shadow-lg' : 'bg-white text-primary-900 hover:bg-primary-50 shadow'}`}>{tab.label}</button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
          {activeTab === 'vision' && <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12"><div className="flex items-center mb-6"><Eye className="w-12 h-12 text-primary-600 me-4" /><h3 className="text-3xl font-bold text-primary-900">{displayContent?.vision?.title}</h3></div><p className="text-lg text-gray-700 leading-relaxed">{displayContent?.vision?.content}</p></div>}
          {activeTab === 'mission' && <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12"><div className="flex items-center mb-6"><Target className="w-12 h-12 text-primary-600 me-4" /><h3 className="text-3xl font-bold text-primary-900">{displayContent?.mission?.title}</h3></div><p className="text-lg text-gray-700 leading-relaxed">{displayContent?.mission?.content}</p></div>}
          {activeTab === 'values' && <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12"><h3 className="text-3xl font-bold text-primary-900 mb-8 text-center">{displayContent?.values?.title}</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{values.map((value) => { const Icon = value.icon; return (<motion.div key={value.key} whileHover={{ scale: 1.05 }} className="bg-primary-50 rounded-xl p-6 flex items-center gap-4"><Icon className="w-10 h-10 text-primary-600 flex-shrink-0" /><span className="text-xl font-semibold text-primary-900">{displayContent?.values?.[value.key]}</span></motion.div>);})}</div></div>}
          {activeTab === 'president' && <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12"><h3 className="text-3xl font-bold text-primary-900 mb-6">{displayContent?.president?.title}</h3><div className="flex flex-col md:flex-row items-center gap-8"><img src="https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=400" alt="President" className="w-48 h-48 rounded-full object-cover shadow-lg" /><p className="text-lg text-gray-700 leading-relaxed">{displayContent?.president?.message}</p></div></div>}
          {activeTab === 'objectives' && <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12"><h3 className="text-3xl font-bold text-primary-900 mb-8">{displayContent?.objectives?.title}</h3><div className="space-y-6">{(displayContent?.objectives?.list || []).map((objective, index) => (<div key={index} className="flex items-start gap-4"><div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">{index + 1}</div><p className="text-lg text-gray-700">{objective}</p></div>))}</div></div>}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
