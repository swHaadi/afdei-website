import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Trash2 } from 'lucide-react';
import api from '../../../lib/api';
import { motion } from 'framer-motion';

interface Submission { _id?: string; id?: string; name: string; email: string; subject: string; message: string; createdAt: string; }

const ContactSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => { fetchSubmissions(); }, []);

  const fetchSubmissions = async () => { try { const res = await api.get('/api/contact'); setSubmissions(res.data); } catch { console.error('Failed to fetch submissions'); } };

  const handleDelete = async (id: string) => { if (confirm('Delete this submission?')) { try { await api.delete(`/api/contact/${id}`); fetchSubmissions(); if (selectedSubmission && (selectedSubmission._id === id || selectedSubmission.id === id)) setSelectedSubmission(null); } catch { alert('Failed to delete'); } } };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {submissions.length === 0 ? (<div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">No submissions yet</div>) : (
            submissions.map((sub) => (
              <motion.div key={sub._id || sub.id} onClick={() => setSelectedSubmission(sub)} whileHover={{ scale: 1.02 }} className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all ${selectedSubmission?._id === sub._id || selectedSubmission?.id === sub.id ? 'ring-2 ring-primary-600' : ''}`}>
                <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-gray-900 truncate">{sub.name}</h3><button onClick={(e) => { e.stopPropagation(); handleDelete(sub._id || sub.id || ''); }} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>
                <p className="text-sm text-gray-600 truncate mb-2">{sub.subject}</p>
                <div className="flex items-center text-xs text-gray-500"><Calendar className="w-3 h-3 mr-1" />{new Date(sub.createdAt).toLocaleDateString()}</div>
              </motion.div>
            ))
          )}
        </div>
        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6"><div><h2 className="text-xl font-bold text-gray-900">{selectedSubmission.subject}</h2><p className="text-sm text-gray-500">From: {selectedSubmission.name}</p></div><button onClick={() => handleDelete(selectedSubmission._id || selectedSubmission.id || '')} className="text-red-500 hover:text-red-700"><Trash2 className="w-5 h-5" /></button></div>
              <div className="flex items-center gap-2 text-gray-600 mb-4"><Mail className="w-4 h-4" /><a href={`mailto:${selectedSubmission.email}`} className="text-primary-600 hover:underline">{selectedSubmission.email}</a></div>
              <div className="border-t pt-4"><h3 className="font-medium text-gray-900 mb-2">Message</h3><p className="text-gray-700 whitespace-pre-wrap">{selectedSubmission.message}</p></div>
              <div className="mt-6 text-sm text-gray-500">Received: {new Date(selectedSubmission.createdAt).toLocaleString()}</div>
            </motion.div>
          ) : (<div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">Select a submission to view details</div>)}
        </div>
      </div>
    </div>
  );
};

export default ContactSubmissions;
