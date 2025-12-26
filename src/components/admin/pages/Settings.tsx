import React, { useState } from 'react';
import { Save, Lock } from 'lucide-react';
import api from '../../../lib/api';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';

const inputClass = "w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 text-gray-900";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { setMessage({ type: 'error', text: 'Passwords do not match' }); return; }
    setIsSaving(true); setMessage(null);
    try {
      await api.post('/api/auth/change-password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch { setMessage({ type: 'error', text: 'Failed to change password' }); } finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6"><Lock className="w-6 h-6 text-primary-600" /><h2 className="text-xl font-bold text-gray-900">Change Password</h2></div>
        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label><input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">New Password</label><input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label><input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className={inputClass} /></div>
          {message && <div className={`px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message.text}</div>}
          <button type="submit" disabled={isSaving} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}Change Password</button>
        </form>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-3"><div><span className="text-sm text-gray-500">Name:</span><p className="font-medium text-gray-900">{user?.name}</p></div><div><span className="text-sm text-gray-500">Email:</span><p className="font-medium text-gray-900">{user?.email}</p></div><div><span className="text-sm text-gray-500">Role:</span><p className="font-medium text-gray-900 capitalize">{user?.role}</p></div></div>
      </motion.div>
    </div>
  );
};

export default Settings;
