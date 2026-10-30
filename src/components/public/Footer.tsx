import React from 'react';
import { Shield } from 'lucide-react';
import { PortfolioProfile } from '../../types/index.ts';

interface FooterProps {
  profile: PortfolioProfile;
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onNavigateToAdmin }) => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#070b14] border-t border-slate-800 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <span className="text-base font-bold text-white font-display block">
              {profile.full_name || 'Sabrina Furtado'}
            </span>
            <span className="text-slate-400 text-xs mt-0.5 block">
              {profile.professional_title || 'Desenvolvedora de Soluções Tecnológicas'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <button
              onClick={() => scrollTo('hero')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Início
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Sobre mim
            </button>
            <button
              onClick={() => scrollTo('skills')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Habilidades
            </button>
            <button
              onClick={() => scrollTo('experience')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Experiência
            </button>
            <button
              onClick={() => scrollTo('projects')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Projetos
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Contato
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {currentYear} {profile.full_name || 'Sabrina Furtado'}. Todos os direitos reservados.
          </p>

          <p className="text-center sm:text-right">
            {profile.footer_text || 'Construído com tecnologia moderna, alta performance e persistência segura.'}
          </p>

          <button
            onClick={onNavigateToAdmin}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
            title="Acesso restrito da administradora"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Administração</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
