import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  UserCheck,
  Wrench,
  Briefcase,
  Mail,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { AdminUser } from '../../types/index.ts';
import { adminApi } from '../../api/client.ts';
import { AdminDashboard } from './AdminDashboard.tsx';
import { AdminProjects } from './AdminProjects.tsx';
import { AdminProfile } from './AdminProfile.tsx';
import { AdminSkills } from './AdminSkills.tsx';
import { AdminExperience } from './AdminExperience.tsx';
import { AdminMessages } from './AdminMessages.tsx';
import { AdminSecurity } from './AdminSecurity.tsx';

interface AdminLayoutProps {
  admin: AdminUser;
  onLogout: () => void;
  onViewPortfolio: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ admin, onLogout, onViewPortfolio }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'profile' | 'skills' | 'experience' | 'messages' | 'security'>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'projects', label: 'Projetos', icon: FolderGit2 },
    { id: 'profile', label: 'Informações & Perfil', icon: UserCheck },
    { id: 'skills', label: 'Habilidades', icon: Wrench },
    { id: 'experience', label: 'Experiência', icon: Briefcase },
    { id: 'messages', label: 'Mensagens', icon: Mail },
    { id: 'security', label: 'Segurança', icon: Shield }
  ];

  const handleLogout = () => {
    adminApi.logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col md:flex-row text-slate-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-sm text-white font-display">Painel Admin</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900/90 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 z-30`}
      >
        <div className="space-y-6">
          {/* Brand & Admin Badge */}
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white font-display block">
                  Sabrina Furtado
                </span>
                <span className="text-[10px] text-cyan-400 font-mono block">
                  Administradora
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-1">
              {admin.email}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-2 mt-6">
          <button
            onClick={onViewPortfolio}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <span>Ver Portfólio Público</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={(tab) => setActiveTab(tab as any)} />}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'profile' && <AdminProfile />}
        {activeTab === 'skills' && <AdminSkills />}
        {activeTab === 'experience' && <AdminExperience />}
        {activeTab === 'messages' && <AdminMessages />}
        {activeTab === 'security' && <AdminSecurity />}
      </main>
    </div>
  );
};
