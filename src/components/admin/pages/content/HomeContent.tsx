import React, { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import api from '../../../../lib/api';
import { motion } from 'framer-motion';

const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 text-gray-900";
const textareaClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 resize-none text-gray-900";

const HomeContent: React.FC = () => {
  const [content, setContent] = useState({ en: { title: '', subtitle: '', description: '' }, ar: { title: '', subtitle: '', description: '' }, backgroundImage: '' });
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { api.get('/api/content/section/hero').then(res => { if (res.data?.content) setContent({ en: res.data.content.en || { title: '', subtitle: '', description: '' }, ar: res.data.content.ar || { title: '', subtitle: '', description: '' }, backgroundImage: res.data.content.backgroundImage || '' }); }).catch(console.error); }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try { await api.put('/api/content/section/hero', { section: 'hero', content }); alert('Content saved successfully!'); } 
    catch { alert('Failed to save content.'); } finally { setIsSaving(false); }
  };

  const handleInputChange = (field: string, value: string) => { setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: value } })); };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Home Page Content</h2>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
          {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}Save Changes
        </button>
      </div>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setActiveTab('en')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>English</button>
        <button onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'ar' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>العربية</button>
      </div>
      <div className="space-y-4" dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={content[activeTab]?.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} className={inputClass} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label><input type="text" value={content[activeTab]?.subtitle || ''} onChange={(e) => handleInputChange('subtitle', e.target.value)} className={inputClass} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea value={content[activeTab]?.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} className={textareaClass} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label><div className="flex items-center space-x-4"><button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"><Upload className="w-5 h-5 mr-2" />Upload Image</button><span className="text-sm text-gray-500">Recommended: 1920x1080px</span></div></div>
      </div>
    </motion.div>
  );
};

export default HomeContent;
