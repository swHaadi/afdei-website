import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import api from '../../lib/api';

const Activities: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    api.get('/api/events').then(res => setEvents(res.data.slice(0, 6))).catch(() => {
      setEvents([
        { _id: '1', title: { en: 'Arab Economic Summit 2025', ar: 'القمة الاقتصادية العربية 2025' }, date: new Date('2025-03-15'), location: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر' }, description: { en: 'Annual summit bringing together economic leaders.', ar: 'القمة السنوية التي تجمع القادة الاقتصاديين.' }, image: { url: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=600' } },
        { _id: '2', title: { en: 'Youth Entrepreneurship Workshop', ar: 'ورشة عمل ريادة الأعمال للشباب' }, date: new Date('2025-02-20'), location: { en: 'Dubai, UAE', ar: 'دبي، الإمارات' }, description: { en: 'Empowering young entrepreneurs.', ar: 'تمكين رواد الأعمال الشباب.' }, image: { url: 'https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=600' } }
      ]);
    });
  }, []);

  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">{t('nav.activities')}</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {events.map((event, index) => (
            <motion.div key={event._id} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 overflow-hidden"><img src={event.image?.url || 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600'} alt={event.title[i18n.language]} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" /></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary-900 mb-3">{event.title[i18n.language] || event.title.en}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600"><Calendar className="w-4 h-4 me-2" /><span className="text-sm">{new Date(event.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}</span></div>
                  <div className="flex items-center text-gray-600"><MapPin className="w-4 h-4 me-2" /><span className="text-sm">{event.location[i18n.language] || event.location.en}</span></div>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-2">{event.description[i18n.language] || event.description.en}</p>
                <button className="flex items-center text-primary-600 hover:text-primary-700 font-medium"><span className="me-2">{i18n.language === 'ar' ? 'اقرأ المزيد' : 'Read More'}</span><ChevronRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
