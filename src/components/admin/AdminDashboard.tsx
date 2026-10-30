import React, { useEffect, useState } from 'react';
import {
  FolderGit2,
  CheckCircle,
  FileEdit,
  Wrench,
  Briefcase,
  Mail,
  ArrowUpRight,
  PlusCircle,
  UserCheck
} from 'lucide-react';
import { adminApi } from '../../api/client.ts';
import { DashboardStats } from '../../types/index.ts';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: 'Total de Projetos',
      value: stats?.totalProjects ?? 0,
      subtext: `${stats?.publishedProjects ?? 0} publicados · ${stats?.draftProjects ?? 0} rascunhos`,
      icon: FolderGit2,
      tab: 'projects'
    },
    {
      title: 'Projetos Publicados',
      value: stats?.publishedProjects ?? 0,
      subtext: 'Visíveis no portfólio público',
      icon: CheckCircle,
      tab: 'projects'
    },
    {
      title: 'Projetos em Rascunho',
      value: stats?.draftProjects ?? 0,
      subtext: 'Ocultos para visitantes',
      icon: FileEdit,
      tab: 'projects'
    },
    {
      title: 'Habilidades Cadastradas',
      value: stats?.totalSkills ?? 0,
      subtext: 'Distribuídas em categorias',
      icon: Wrench,
      tab: 'skills'
    },
    {
      title: 'Histórico Profissional',
      value: stats?.totalExperiences ?? 0,
      subtext: 'Experiências e atuações',
      icon: Briefcase,
      tab: 'experience'
    },
    {
      title: 'Mensagens Recebidas',
      value: stats?.unreadMessages ?? 0,
      subtext: 'Novos contatos do formulário',
      icon: Mail,
      tab: 'messages',
      highlight: (stats?.unreadMessages ?? 0) > 0
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800/80 border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Painel de Controle
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gerencie o conteúdo do portfólio em tempo real com persistência garantida no SQLite.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('projects')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className={`p-6 rounded-2xl bg-slate-900/80 border transition-all cursor-pointer group hover:bg-slate-900 ${
                card.highlight
                  ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>

              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums mb-1">
                {loading ? '—' : card.value}
              </div>

              <div className="text-xs font-semibold text-slate-300 font-display">
                {card.title}
              </div>

              <div className="text-[11px] text-slate-500 mt-1">
                {card.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div
          onClick={() => onNavigateTab('profile')}
          className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Editar Apresentação & Bio</h3>
          </div>
          <p className="text-xs text-slate-400">
            Atualize seu nome, cargo, texto de apresentação e links para redes sociais.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('skills')}
          className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Gerenciar Habilidades</h3>
          </div>
          <p className="text-xs text-slate-400">
            Adicione novas tecnologias (.NET, C#, RPA, SQL) ou reordene as categorias.
          </p>
        </div>

        <div
          onClick={() => onNavigateTab('experience')}
          className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Atualizar Experiências</h3>
          </div>
          <p className="text-xs text-slate-400">
            Edite cargos, modalidades (Híbrido/Remoto) e detalhamento de responsabilidades.
          </p>
        </div>
      </div>
    </div>
  );
};
