import React, { useState, useEffect } from 'react';
import { publicApi, adminApi, getAuthToken } from './api/client.ts';
import { PortfolioData, AdminUser } from './types/index.ts';
import { Header } from './components/public/Header.tsx';
import { Hero } from './components/public/Hero.tsx';
import { About } from './components/public/About.tsx';
import { Skills } from './components/public/Skills.tsx';
import { Experience } from './components/public/Experience.tsx';
import { Projects } from './components/public/Projects.tsx';
import { Contact } from './components/public/Contact.tsx';
import { Footer } from './components/public/Footer.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { Loader2, RefreshCw } from 'lucide-react';

export default function App() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state: 'public' or 'admin'
  const [currentView, setCurrentView] = useState<'public' | 'admin'>(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'public';
  });

  // Admin auth state
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Sync with browser URL changes
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin');
      } else {
        setCurrentView('public');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check admin authentication session
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      adminApi
        .getMe()
        .then((res) => {
          setAdminUser(res.admin);
        })
        .catch(() => {
          adminApi.logout();
          setAdminUser(null);
        })
        .finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, []);

  // Load public portfolio data from database
  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await publicApi.getPortfolio();
      setPortfolioData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar dados do portfólio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublic = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('public');
    loadPortfolio(); // refresh portfolio data when returning from admin
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in admin view
  if (currentView === 'admin') {
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-400 text-xs">
          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin mr-2" />
          <span>Verificando autenticação...</span>
        </div>
      );
    }

    if (adminUser) {
      return (
        <AdminLayout
          admin={adminUser}
          onLogout={() => {
            setAdminUser(null);
            navigateToPublic();
          }}
          onViewPortfolio={navigateToPublic}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={(user) => {
          setAdminUser(user);
        }}
        onBackToPortfolio={navigateToPublic}
      />
    );
  }

  // Public Portfolio View
  if (loading && !portfolioData) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-4" />
        <p className="text-sm font-medium font-display">Carregando portfólio de Sabrina Furtado...</p>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-center text-slate-300">
        <div className="max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white font-display">Falha na Conexão</h2>
          <p className="text-xs text-slate-400">
            {error || 'Não foi possível carregar as informações do portfólio no momento.'}
          </p>
          <button
            onClick={loadPortfolio}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200">
      <Header
        onNavigateToAdmin={navigateToAdmin}
        isAdminLoggedIn={Boolean(adminUser)}
      />

      <main className="flex-1">
        <Hero profile={portfolioData.profile} />
        <About profile={portfolioData.profile} />
        <Skills categories={portfolioData.skills} />
        <Experience experiences={portfolioData.experiences} />
        <Projects projects={portfolioData.projects} />
        <Contact profile={portfolioData.profile} />
      </main>

      <Footer
        profile={portfolioData.profile}
        onNavigateToAdmin={navigateToAdmin}
      />
    </div>
  );
}
