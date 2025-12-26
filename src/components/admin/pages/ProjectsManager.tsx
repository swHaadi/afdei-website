import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Star } from 'lucide-react';
import api from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 text-gray-900";
const textareaClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 resize-none text-gray-900";

interface Project { _id?: string; id?: string; nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string; images?: { url: string }[]; isFeatured?: boolean; }

const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({ nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '', isFeatured: false });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => { try { const res = await api.get('/api/projects'); setProjects(res.data); } catch { console.error('Failed to fetch projects'); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) { await api.put(`/api/projects/${editingProject._id || editingProject.id}`, formData); }
      else { await api.post('/api/projects', formData); }
      fetchProjects(); resetForm();
    } catch { alert('Failed to save project'); }
  };

  const handleDelete = async (id: string) => { if (confirm('Delete this project?')) { try { await api.delete(`/api/projects/${id}`); fetchProjects(); } catch { alert('Failed to delete'); } } };

  const resetForm = () => { setShowForm(false); setEditingProject(null); setFormData({ nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '', isFeatured: false }); };

  const handleEdit = (project: Project) => { setEditingProject(project); setFormData(project); setShowForm(true); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold text-gray-900">Projects Manager</h1><button onClick={() => setShowForm(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><Plus className="w-5 h-5 mr-2" />Add Project</button></div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h2><button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Name (English)</label><input type="text" required value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Name (Arabic)</label><input type="text" required value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })} className={inputClass} dir="rtl" /></div></div>
              <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label><textarea rows={4} value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} className={textareaClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabic)</label><textarea rows={4} value={formData.descriptionAr} onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })} className={textareaClass} dir="rtl" /></div></div>
              <div><label className="flex items-center gap-2"><input type="checkbox" checked={formData.isFeatured || false} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 text-primary-600" /><span className="text-sm font-medium text-gray-700">Featured Project</span></label></div>
              <div className="flex justify-end gap-4"><button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button><button type="submit" className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><Save className="w-5 h-5 mr-2" />Save Project</button></div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div key={project._id || project.id} layout className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-40 overflow-hidden bg-gray-100"><img src={project.images?.[0]?.url || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600'} alt={project.nameEn} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2"><h3 className="font-bold text-gray-900">{project.nameEn}</h3>{project.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}</div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.descriptionEn}</p>
              <div className="flex justify-end gap-2"><button onClick={() => handleEdit(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(project._id || project.id || '')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;
