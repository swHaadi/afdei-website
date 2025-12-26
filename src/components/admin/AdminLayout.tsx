import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Briefcase,
  Image,
  Settings,
  Users,
  Mail,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  React.useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 1024);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      path: '/admin/content', 
      label: 'Content', 
      icon: FileText,
      subItems: [
        { path: '/admin/content/home', label: 'Home' },
        { path: '/admin/content/about', label: 'About Us' },
        { path: '/admin/content/membership', label: 'Membership' },
        { path: '/admin/content/advisory', label: 'Advisory Bodies' }
      ]
    },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/projects', label: 'Projects', icon: Briefcase },
    { path: '/admin/media', label: 'Media Library', icon: Image },
    { path: '/admin/contact', label: 'Contact Forms', icon: Mail },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/users', label: 'Users', icon: Users }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-primary-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-lg p-1.5 shadow-sm">
            <img src="/logo.png" alt="AFDEI Logo" className="h-8 w-auto" />
          </div>
          <span className="text-lg font-bold">CMS</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white hover:text-primary-200"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || isDesktop) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className={`fixed lg:relative z-40 w-64 h-screen bg-primary-900 text-white overflow-y-auto ${
                isSidebarOpen ? 'block' : 'hidden lg:block'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <img src="/logo.png" alt="AFDEI Logo" className="h-10 w-auto" />
                  </div>
                  <h1 className="text-xl font-bold">CMS</h1>
                </div>
                
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.path}>
                      {item.subItems ? (
                        <>
                          <button
                            onClick={() => setExpandedMenu(expandedMenu === item.path ? null : item.path)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
                              isActive(item.path) ? 'bg-primary-800' : 'hover:bg-primary-800'
                            }`}
                          >
                            <div className="flex items-center">
                              <item.icon className="w-5 h-5 mr-3" />
                              <span>{item.label}</span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                expandedMenu === item.path ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {expandedMenu === item.path && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-8 mt-2 space-y-1 overflow-hidden"
                              >
                                {item.subItems.map((subItem) => (
                                  <Link
                                    key={subItem.path}
                                    to={subItem.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                                      location.pathname === subItem.path
                                        ? 'bg-primary-700'
                                        : 'hover:bg-primary-800'
                                    }`}
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={item.path}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                            isActive(item.path) ? 'bg-primary-800' : 'hover:bg-primary-800'
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-primary-800">
                  <div className="mb-4">
                    <p className="text-sm text-primary-200">Logged in as:</p>
                    <p className="font-semibold">{user?.name || 'Admin'}</p>
                    <p className="text-sm text-primary-200">{user?.email || ''}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-primary-800 transition-colors duration-200 w-full"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


