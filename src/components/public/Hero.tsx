import React from 'react';
import { ArrowRight, Mail, Sparkles, Terminal, Code2 } from 'lucide-react';
import { PortfolioProfile } from '../../types/index.ts';

interface HeroProps {
  profile: PortfolioProfile;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 lg:py-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Presentation */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Analista e Desenvolvedora de Sistemas</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display text-balance">
                {profile.full_name || 'Sabrina Furtado'}
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-cyan-300 font-display">
                {profile.professional_title || 'Desenvolvedora de Soluções Tecnológicas'}
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {profile.hero_intro ||
                'Olá, eu sou a Sabrina! Atuo com tecnologia, desenvolvimento de software, automação de processos e melhoria contínua. Gosto de transformar problemas em soluções práticas, combinando pensamento analítico, desenvolvimento de sistemas e aprendizado constante.'}
            </p>

            {/* Quick tech stack tags (unboxed with separators) */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
              <span className="text-slate-300 font-medium">Foco técnico:</span>
              <span>C#</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>.NET</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Java</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>React</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>APIs REST</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Inteligência Artificial (IA)</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>RPA & Automação</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Bancos SQL</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => scrollTo('projects')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-lg shadow-cyan-500/20 transition-all hover:translate-y-[-1px] cursor-pointer"
              >
                <span>Conheça meus projetos</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('contact')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 rounded-lg transition-all hover:translate-y-[-1px] cursor-pointer"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Entre em contato</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Avatar / Monogram Anchor */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 rounded-2xl blur-xl group-hover:blur-2xl opacity-70 transition-all duration-500" />

              {/* Main Card Frame */}
              <div className="relative w-72 sm:w-80 h-96 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-sm overflow-hidden">
                {/* Circuit Grid Subtle Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                {/* Top Corner Icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-center text-cyan-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Portfolio v1.0
                  </div>
                </div>

                {/* Avatar / Photo Display */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Sabrina Furtado'}
                      referrerPolicy="no-referrer"
                      className="w-32 h-32 rounded-full object-cover border-2 border-cyan-400/50 shadow-lg mb-4"
                      onError={(e) => {
                        // Fallback to placeholder if image fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="relative mb-4">
                      {/* Monogram Box */}
                      <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-inner">
                        <span className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 font-display">
                          SF
                        </span>
                      </div>
                      <div className="absolute -bottom-2 -right-2 p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-cyan-400">
                        <Code2 className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-white font-display">
                    {profile.full_name || 'Sabrina Furtado'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {profile.location || 'São Paulo, Brasil'}
                  </p>
                </div>

                {/* Bottom Card Footer */}
                <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Desenvolvimento & Soluções</span>
                  <span className="font-mono text-cyan-400">.NET / IA / RPA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
