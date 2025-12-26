import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import api from '../../lib/api';

const defaultContent = {
  en: { title: 'Contact Us', getInTouch: 'Get in Touch', sendMessage: 'Send us a Message', address: '4 Dar Al-Salam Street – Cairo – Egypt', email: 'info@afdei.org', phone: '+20 2 2639 6296', workingHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM', formLabels: { name: 'Your Name', email: 'Your Email', subject: 'Subject', message: 'Message', submit: 'Send Message' }, successMessage: 'Thank you!', errorMessage: 'Error occurred.' },
  ar: { title: 'اتصل بنا', getInTouch: 'تواصل معنا', sendMessage: 'أرسل لنا رسالة', address: '4 شارع دار السلام - القاهرة - مصر', email: 'info@afdei.org', phone: '+20 2 2639 6296', workingHours: 'الأحد - الخميس: 9:00 صباحاً - 5:00 مساءً', formLabels: { name: 'الاسم', email: 'البريد الإلكتروني', subject: 'الموضوع', message: 'الرسالة', submit: 'إرسال' }, successMessage: 'شكراً!', errorMessage: 'حدث خطأ.' }
};

const Contact: React.FC = () => {
  const { i18n } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [content, setContent] = useState(defaultContent);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const currentLang = (i18n.language === 'ar' ? 'ar' : 'en') as 'en' | 'ar';

  useEffect(() => { api.get('/api/content/section/contact').then(res => { if (res.data?.content?.en && res.data?.content?.ar) setContent(res.data.content); }).catch(console.error); }, []);

  const displayContent = content[currentLang] || defaultContent[currentLang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true); setSubmitStatus('idle');
    try { await api.post('/api/contact', formData); setSubmitStatus('success'); setFormData({ name: '', email: '', subject: '', message: '' }); } 
    catch { setSubmitStatus('error'); } finally { setIsSubmitting(false); }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">{displayContent?.title}</h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto"></div>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
            <h3 className="text-2xl font-bold text-primary-900 mb-6">{displayContent?.getInTouch}</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4"><MapPin className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" /><div><h4 className="font-semibold text-gray-900 mb-1">{currentLang === 'ar' ? 'العنوان' : 'Address'}</h4><p className="text-gray-700">{displayContent?.address}</p></div></div>
              <div className="flex items-start gap-4"><Mail className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" /><div><h4 className="font-semibold text-gray-900 mb-1">{currentLang === 'ar' ? 'البريد' : 'Email'}</h4><a href={`mailto:${displayContent?.email}`} className="text-primary-600">{displayContent?.email}</a></div></div>
              <div className="flex items-start gap-4"><Phone className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" /><div><h4 className="font-semibold text-gray-900 mb-1">{currentLang === 'ar' ? 'الهاتف' : 'Phone'}</h4><a href={`tel:${displayContent?.phone}`} className="text-primary-600">{displayContent?.phone}</a></div></div>
              <div className="flex items-start gap-4"><Clock className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" /><div><h4 className="font-semibold text-gray-900 mb-1">{currentLang === 'ar' ? 'ساعات العمل' : 'Hours'}</h4><p className="text-gray-700">{displayContent?.workingHours}</p></div></div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }}>
            <h3 className="text-2xl font-bold text-primary-900 mb-6">{displayContent?.sendMessage}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{displayContent?.formLabels?.name}</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{displayContent?.formLabels?.email}</label><input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{displayContent?.formLabels?.subject}</label><input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">{displayContent?.formLabels?.message}</label><textarea rows={5} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 resize-none"></textarea></div>
              {submitStatus === 'success' && <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg">{displayContent?.successMessage}</div>}
              {submitStatus === 'error' && <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg">{displayContent?.errorMessage}</div>}
              <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-primary-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-50 flex items-center justify-center">
                {isSubmitting ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Send className="w-5 h-5 me-2" />{displayContent?.formLabels?.submit}</>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
