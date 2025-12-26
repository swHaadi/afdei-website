import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Briefcase,
  Mail,
  TrendingUp,
  Activity,
  Eye,
  FileText
} from 'lucide-react';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalProjects: 0,
    totalSubmissions: 0,
    totalViews: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real app, these would be actual API calls
      setStats({
        totalEvents: 12,
        totalProjects: 5,
        totalSubmissions: 48,
        totalViews: 15420
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Projects',
      value: stats.totalProjects,
      icon: Briefcase,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Contact Forms',
      value: stats.totalSubmissions,
      icon: Mail,
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'Page Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-orange-500',
      change: '+18%'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New event created', user: 'Admin', time: '2 hours ago', icon: Calendar },
    { id: 2, action: 'Project updated', user: 'Editor', time: '4 hours ago', icon: Briefcase },
    { id: 3, action: 'Contact form received', user: 'System', time: '5 hours ago', icon: Mail },
    { id: 4, action: 'Content updated', user: 'Admin', time: '1 day ago', icon: FileText }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to AFDEI Content Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.action}</p>
                    <p className="text-gray-500 text-sm">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200">
              <Calendar className="w-6 h-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Event</span>
            </button>
            <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200">
              <Briefcase className="w-6 h-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">New Project</span>
            </button>
            <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200">
              <FileText className="w-6 h-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Edit Content</span>
            </button>
            <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200">
              <Users className="w-6 h-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Manage Users</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;


