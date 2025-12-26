import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../../../../lib/api';
import { motion } from 'framer-motion';

const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 text-gray-900";
const textareaClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 resize-none text-gray-900";

const ContactContent: React.FC = () => {
  const [content, setContent] = useState({ en: { title: 'Contact Us', getInTouch: 'Get in Touch', sendMessage: 'Send us a Message', address: '', email: 'info@afdei.org', phone: '+20 2 1234 5678', workingHours: 'Sunday - Thursday: 9:00 AM - 5:00 PM', formLabels: { name: 'Your Name', email: 'Your Email', subject: 'Subject', message: 'Message', submit: 'Send Message' }, successMessage: 'Thank you!', errorMessage: 'Error.' }, ar: { title: 'اتصل بنا', getInTouch: 'تواصل معنا', sendMessage: 'أرسل لنا رسالة', address: '', email: 'info@afdei.org', phone: '+20 2 1234 5678', workingHours: 'الأحد - الخميس: 9:00 صباحاً - 5:00 مساءً', formLabels: { name: 'الاسم', email: 'البريد', subject: 'الموضوع', message: 'الرسالة', submit: 'إرسال' }, successMessage: 'شكراً!', errorMessage: 'خطأ.' } });
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { api.get('/api/content/section/contact').then(res => { if (res.data?.content?.en && res.data?.content?.ar) setContent(res.data.content); }).catch(console.error); }, []);

  const handleSave = async () => { setIsSaving(true); try { await api.put('/api/content/section/contact', { section: 'contact', content }); alert('Saved!'); } catch { alert('Failed'); } finally { setIsSaving(false); } };
  const updateField = (field: string, value: string) => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: value } }));
  const updateFormLabel = (field: string, value: string) => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], formLabels: { ...prev[activeTab].formLabels, [field]: value } } }));
  const currentContent = content[activeTab];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-900">Contact Content</h2><button onClick={handleSave} disabled={isSaving} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">{isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}Save</button></div>
      <div className="flex space-x-4 mb-6"><button onClick={() => setActiveTab('en')} className={`px-4 py-2 rounded-lg ${activeTab === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>English</button><button onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-lg ${activeTab === 'ar' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>العربية</button></div>
      <div className="space-y-4" dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>
        <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={currentContent?.title || ''} onChange={(e) => updateField('title', e.target.value)} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Get in Touch</label><input type="text" value={currentContent?.getInTouch || ''} onChange={(e) => updateField('getInTouch', e.target.value)} className={inputClass} /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Address</label><textarea value={currentContent?.address || ''} onChange={(e) => updateField('address', e.target.value)} rows={2} className={textareaClass} /></div>
        <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" value={currentContent?.email || ''} onChange={(e) => updateField('email', e.target.value)} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Phone</label><input type="text" value={currentContent?.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} /></div></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label><input type="text" value={currentContent?.workingHours || ''} onChange={(e) => updateField('workingHours', e.target.value)} className={inputClass} /></div>
        <div className="border-t pt-4"><h3 className="font-medium text-gray-900 mb-4">Form Labels</h3><div className="grid md:grid-cols-2 gap-4">{Object.entries(currentContent?.formLabels || {}).map(([key, value]) => (<div key={key}><label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label><input type="text" value={value || ''} onChange={(e) => updateFormLabel(key, e.target.value)} className={inputClass} /></div>))}</div></div>
      </div>
    </motion.div>
  );
};

export default ContactContent;
