import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, Copy, Check } from 'lucide-react';
import api, { API_URL } from '../../../lib/api';
import { motion } from 'framer-motion';

interface MediaItem { _id?: string; id?: string; filename: string; filepath: string; mimetype: string; size: number; createdAt: string; }

const MediaLibrary: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => { try { const res = await api.get('/api/media'); setMedia(res.data); } catch { console.error('Failed to fetch media'); } };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    try { await api.post('/api/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); fetchMedia(); } 
    catch { alert('Failed to upload'); } finally { setIsUploading(false); }
  };

  const handleDelete = async (id: string) => { if (confirm('Delete this file?')) { try { await api.delete(`/api/media/${id}`); fetchMedia(); } catch { alert('Failed to delete'); } } };

  const copyUrl = (filepath: string, id: string) => { navigator.clipboard.writeText(`${API_URL}${filepath}`); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };

  const formatSize = (bytes: number) => { if (bytes < 1024) return bytes + ' B'; if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'; return (bytes / 1048576).toFixed(1) + ' MB'; };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <label className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">{isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}{isUploading ? 'Uploading...' : 'Upload File'}<input type="file" onChange={handleUpload} className="hidden" accept="image/*" /></label>
      </div>
      {media.length === 0 ? (<div className="bg-white rounded-xl shadow-lg p-12 text-center"><ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No media files yet</p></div>) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <motion.div key={item._id || item.id} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-32 bg-gray-100 flex items-center justify-center">{item.mimetype.startsWith('image/') ? <img src={`${API_URL}${item.filepath}`} alt={item.filename} className="w-full h-full object-cover" /> : <ImageIcon className="w-12 h-12 text-gray-400" />}</div>
              <div className="p-3"><p className="font-medium text-gray-900 text-sm truncate">{item.filename}</p><p className="text-xs text-gray-500">{formatSize(item.size)}</p>
                <div className="flex justify-end gap-2 mt-2"><button onClick={() => copyUrl(item.filepath, item._id || item.id || '')} className="p-1 text-gray-600 hover:text-primary-600">{copiedId === (item._id || item.id) ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}</button><button onClick={() => handleDelete(item._id || item.id || '')} className="p-1 text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
