import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../../../../lib/api';
import { motion } from 'framer-motion';

const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 text-gray-900";
const textareaClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 resize-none text-gray-900";

const defaultState = {
  en: { title: 'About Us', vision: { title: 'Vision', content: '' }, mission: { title: 'Mission', content: '' }, values: { title: 'Our Values', leadership: 'Leadership', empowerment: 'Empowerment', innovation: 'Innovation', sustainability: 'Sustainability' }, president: { title: "President's Message", message: '' }, objectives: { title: 'Our Objectives', list: ['', ''] } },
  ar: { title: 'من نحن', vision: { title: 'الرؤية', content: '' }, mission: { title: 'الرسالة', content: '' }, values: { title: 'قيمنا', leadership: 'القيادة', empowerment: 'التمكين', innovation: 'الابتكار', sustainability: 'الاستدامة' }, president: { title: 'رسالة الرئيس', message: '' }, objectives: { title: 'أهدافنا', list: ['', ''] } }
};

const AboutContent: React.FC = () => {
  const [content, setContent] = useState(defaultState);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [activeSection, setActiveSection] = useState('vision');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { api.get('/api/content/section/about').then(res => { if (res.data?.content?.en && res.data?.content?.ar) setContent({ en: { ...defaultState.en, ...res.data.content.en }, ar: { ...defaultState.ar, ...res.data.content.ar } }); }).catch(console.error); }, []);

  const handleSave = async () => { setIsSaving(true); try { await api.put('/api/content/section/about', { section: 'about', content }); alert('Content saved!'); } catch { alert('Failed to save.'); } finally { setIsSaving(false); } };

  const currentContent = content[activeTab];
  const updateVision = (field: 'title' | 'content', value: string) => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], vision: { ...prev[activeTab].vision, [field]: value } } }));
  const updateMission = (field: 'title' | 'content', value: string) => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], mission: { ...prev[activeTab].mission, [field]: value } } }));
  const updateValues = (field: string, value: string) => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], values: { ...prev[activeTab].values, [field]: value } } }));
  const updatePresident = (field: 'title' | 'message', value: string) => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], president: { ...prev[activeTab].president, [field]: value } } }));
  const updateObjective = (index: number, value: string) => setContent(prev => { const newList = [...prev[activeTab].objectives.list]; newList[index] = value; return { ...prev, [activeTab]: { ...prev[activeTab], objectives: { ...prev[activeTab].objectives, list: newList } } }; });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-900">About Us Content</h2><button onClick={handleSave} disabled={isSaving} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">{isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}Save Changes</button></div>
      <div className="flex space-x-4 mb-6"><button onClick={() => setActiveTab('en')} className={`px-4 py-2 rounded-lg ${activeTab === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>English</button><button onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-lg ${activeTab === 'ar' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>العربية</button></div>
      <div className="flex flex-wrap gap-2 mb-6">{['vision', 'mission', 'values', 'president', 'objectives'].map(s => (<button key={s} onClick={() => setActiveSection(s)} className={`px-3 py-1 rounded-lg text-sm ${activeSection === s ? 'bg-primary-100 text-primary-700' : 'bg-gray-50'}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>))}</div>
      <div className="space-y-4" dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>
        {activeSection === 'vision' && <><div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={currentContent.vision?.title || ''} onChange={(e) => updateVision('title', e.target.value)} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Content</label><textarea value={currentContent.vision?.content || ''} onChange={(e) => updateVision('content', e.target.value)} rows={4} className={textareaClass} /></div></>}
        {activeSection === 'mission' && <><div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={currentContent.mission?.title || ''} onChange={(e) => updateMission('title', e.target.value)} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Content</label><textarea value={currentContent.mission?.content || ''} onChange={(e) => updateMission('content', e.target.value)} rows={4} className={textareaClass} /></div></>}
        {activeSection === 'values' && <><div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={currentContent.values?.title || ''} onChange={(e) => updateValues('title', e.target.value)} className={inputClass} /></div>{['leadership', 'empowerment', 'innovation', 'sustainability'].map(v => (<div key={v}><label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{v}</label><input type="text" value={(currentContent.values as any)?.[v] || ''} onChange={(e) => updateValues(v, e.target.value)} className={inputClass} /></div>))}</>}
        {activeSection === 'president' && <><div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={currentContent.president?.title || ''} onChange={(e) => updatePresident('title', e.target.value)} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Message</label><textarea value={currentContent.president?.message || ''} onChange={(e) => updatePresident('message', e.target.value)} rows={6} className={textareaClass} /></div></>}
        {activeSection === 'objectives' && <>{(currentContent.objectives?.list || []).map((obj, i) => (<div key={i}><label className="block text-sm font-medium text-gray-700 mb-2">Objective {i + 1}</label><textarea value={obj || ''} onChange={(e) => updateObjective(i, e.target.value)} rows={2} className={textareaClass} /></div>))}</>}
      </div>
    </motion.div>
  );
};

export default AboutContent;
