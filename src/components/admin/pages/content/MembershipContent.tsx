import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../../../../lib/api';
import { motion } from 'framer-motion';

const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 text-gray-900";
const textareaClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 resize-none text-gray-900";

const MembershipContent: React.FC = () => {
  const [content, setContent] = useState({ en: { title: 'Membership', subtitle: '', description: '', benefits: ['', '', '', ''], buttonText: 'Join Us', memberCount: '500+', memberLabel: 'Active Members' }, ar: { title: 'العضوية', subtitle: '', description: '', benefits: ['', '', '', ''], buttonText: 'انضم إلينا', memberCount: '+500', memberLabel: 'عضو نشط' } });
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { api.get('/api/content/section/membership').then(res => { if (res.data?.content?.en && res.data?.content?.ar) setContent(res.data.content); }).catch(console.error); }, []);

  const handleSave = async () => { setIsSaving(true); try { await api.put('/api/content/section/membership', { section: 'membership', content }); alert('Saved!'); } catch { alert('Failed'); } finally { setIsSaving(false); } };
  const updateField = (field: string, value: string) => setContent(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: value } }));
  const updateBenefit = (index: number, value: string) => setContent(prev => { const newBenefits = [...prev[activeTab].benefits]; newBenefits[index] = value; return { ...prev, [activeTab]: { ...prev[activeTab], benefits: newBenefits } }; });
  const currentContent = content[activeTab];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-900">Membership Content</h2><button onClick={handleSave} disabled={isSaving} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">{isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}Save Changes</button></div>
      <div className="flex space-x-4 mb-6"><button onClick={() => setActiveTab('en')} className={`px-4 py-2 rounded-lg ${activeTab === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>English</button><button onClick={() => setActiveTab('ar')} className={`px-4 py-2 rounded-lg ${activeTab === 'ar' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>العربية</button></div>
      <div className="space-y-4" dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={currentContent?.title || ''} onChange={(e) => updateField('title', e.target.value)} className={inputClass} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label><input type="text" value={currentContent?.subtitle || ''} onChange={(e) => updateField('subtitle', e.target.value)} className={inputClass} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea value={currentContent?.description || ''} onChange={(e) => updateField('description', e.target.value)} rows={4} className={textareaClass} /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>{(currentContent?.benefits || []).map((b, i) => (<input key={i} type="text" value={b || ''} onChange={(e) => updateBenefit(i, e.target.value)} placeholder={`Benefit ${i + 1}`} className={`${inputClass} mb-2`} />))}</div>
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Member Count</label><input type="text" value={currentContent?.memberCount || ''} onChange={(e) => updateField('memberCount', e.target.value)} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Member Label</label><input type="text" value={currentContent?.memberLabel || ''} onChange={(e) => updateField('memberLabel', e.target.value)} className={inputClass} /></div></div>
      </div>
    </motion.div>
  );
};

export default MembershipContent;
