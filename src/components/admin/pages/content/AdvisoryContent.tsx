import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import api from '../../../../lib/api';
import { motion } from 'framer-motion';

const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 text-gray-900";
const textareaClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 resize-none text-gray-900";

interface Body { title: string; description: string; members: number; }

const AdvisoryContent: React.FC = () => {
  const [content, setContent] = useState({ en: { title: 'Advisory Bodies', subtitle: '', bodies: [{ title: '', description: '', members: 0 }] as Body[] }, ar: { title: 'الهيئات الاستشارية', subtitle: '', bodies: [{ title: '', description: '', members: 0 }] as Body[] } });
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { api.get('/api/content/section/advisory').then(res => { if (res.data?.content?.en && res.data?.content?.ar) setContent(res.data.content); }).catch(console.error); }, []);

  const handleSave = async () => { setIsSaving(true); try { await api.put('/api/content/section/advisory', { section: 'advisory', content }); alert('Saved!'); } catch { alert('Failed'); } finally { setIsSaving(false); } };
  const updateField = (field: string, value: string) => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: value } }));
  const updateBody = (index: number, field: keyof Body, value: string | number) => setContent(prev => { const newBodies = [...prev[activeTab].bodies]; newBodies[index] = { ...newBodies[index], [field]: value }; return { ...prev, [activeTab]: { ...prev[activeTab], bodies: newBodies } }; });
  const addBody = () => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], bodies: [...prev[activeTab].bodies, { title: '', description: '', members: 0 }] } }));
  const removeBody = (index: number) => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], bodies: prev[activeTab].bodies.filter((_, i) => i !== index) } }));
  const currentContent = content[activeTab];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-900">Advisory Bodies</h2><button onClick={handleSave} disabled={isSaving} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">{isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}Save</button></div>
      <div className="flex space-x-4 mb-6"><button onClick={() => setActiveTab('en')} className={`px-4 py-2 rounded-lg ${activeTab === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>English</button><button onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-lg ${activeTab === 'ar' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>العربية</button></div>
      <div className="space-y-6" dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={currentContent?.title || ''} onChange={(e) => updateField('title', e.target.value)} className={inputClass} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label><textarea value={currentContent?.subtitle || ''} onChange={(e) => updateField('subtitle', e.target.value)} rows={2} className={textareaClass} /></div>
        <div><div className="flex justify-between mb-4"><label className="text-sm font-medium text-gray-700">Bodies</label><button onClick={addBody} className="flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-lg"><Plus className="w-4 h-4 mr-1" />Add</button></div>
          {(currentContent?.bodies || []).map((body, index) => (<div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"><div className="flex justify-between mb-3"><span className="text-sm font-medium text-gray-500">Body {index + 1}</span>{currentContent.bodies.length > 1 && <button onClick={() => removeBody(index)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>}</div><div className="space-y-3"><input type="text" value={body?.title || ''} onChange={(e) => updateBody(index, 'title', e.target.value)} placeholder="Title" className={inputClass} /><textarea value={body?.description || ''} onChange={(e) => updateBody(index, 'description', e.target.value)} placeholder="Description" rows={2} className={textareaClass} /><input type="number" value={body?.members || 0} onChange={(e) => updateBody(index, 'members', parseInt(e.target.value) || 0)} className={`${inputClass} w-32`} /></div></div>))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdvisoryContent;
