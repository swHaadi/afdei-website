import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import api from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 text-gray-900";
const textareaClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 resize-none text-gray-900";

interface Event { _id?: string; id?: string; titleEn: string; titleAr: string; descriptionEn: string; descriptionAr: string; date: string; locationEn: string; locationAr: string; imageUrl: string; }

const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Event>({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', date: '', locationEn: '', locationAr: '', imageUrl: '' });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => { try { const res = await api.get('/api/events'); setEvents(res.data); } catch { console.error('Failed to fetch events'); } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) { await api.put(`/api/events/${editingEvent._id || editingEvent.id}`, formData); }
      else { await api.post('/api/events', formData); }
      fetchEvents(); resetForm();
    } catch { alert('Failed to save event'); }
  };

  const handleDelete = async (id: string) => { if (confirm('Delete this event?')) { try { await api.delete(`/api/events/${id}`); fetchEvents(); } catch { alert('Failed to delete'); } } };

  const resetForm = () => { setShowForm(false); setEditingEvent(null); setFormData({ titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '', date: '', locationEn: '', locationAr: '', imageUrl: '' }); };

  const handleEdit = (event: Event) => { setEditingEvent(event); setFormData(event); setShowForm(true); };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold text-gray-900">Events Manager</h1><button onClick={() => setShowForm(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><Plus className="w-5 h-5 mr-2" />Add Event</button></div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-900">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2><button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Title (English)</label><input type="text" required value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic)</label><input type="text" required value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} className={inputClass} dir="rtl" /></div></div>
              <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label><textarea rows={3} value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} className={textareaClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabic)</label><textarea rows={3} value={formData.descriptionAr} onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })} className={textareaClass} dir="rtl" /></div></div>
              <div className="grid md:grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Date</label><input type="date" required value={formData.date?.split('T')[0]} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Location (English)</label><input type="text" value={formData.locationEn} onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })} className={inputClass} /></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Location (Arabic)</label><input type="text" value={formData.locationAr} onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })} className={inputClass} dir="rtl" /></div></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label><input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className={inputClass} placeholder="https://..." /></div>
              <div className="flex justify-end gap-4"><button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button><button type="submit" className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><Save className="w-5 h-5 mr-2" />Save Event</button></div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <motion.div key={event._id || event.id} layout className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-40 overflow-hidden"><img src={event.imageUrl || 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=600'} alt={event.titleEn} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{event.titleEn}</h3>
              <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mb-2">{event.locationEn}</p>
              <div className="flex justify-end gap-2"><button onClick={() => handleEdit(event)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(event._id || event.id || '')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventsManager;
