import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './pages/Dashboard';
import ContentManager from './pages/ContentManager';
import EventsManager from './pages/EventsManager';
import ProjectsManager from './pages/ProjectsManager';
import MediaLibrary from './pages/MediaLibrary';
import Settings from './pages/Settings';
import Users from './pages/Users';
import ContactSubmissions from './pages/ContactSubmissions';

const AdminPanel: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="content/*" element={<ContentManager />} />
        <Route path="events" element={<EventsManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="contact" element={<ContactSubmissions />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<Users />} />
        <Route path="/" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPanel;


