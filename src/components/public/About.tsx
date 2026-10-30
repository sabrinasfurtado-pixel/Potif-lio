import React from 'react';
import { Layers, Network, Database, Cpu, Sparkles, TrendingUp } from 'lucide-react';
import { PortfolioProfile } from '../../types/index.ts';

interface AboutProps {
  profile: PortfolioProfile;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  const highlights = [
    {
      icon: Layers,
      title: 'Desenvolvimento de Aplicações',
      description: 'Vivência no desenvolvimento de aplicações e na construção de soluções para diferentes necessidades, buscando aprender novas tecnologias e colocar conhecimentos em prática por meio de projetos.'
    },
    {
      icon: Network,
      title: 'APIs e Integrações',
      description: 'Experiência com APIs e integração entre sistemas, compreendendo como as aplicações se comunicam e compartilham informações.'
    },
    {
      icon: Database,
      title: 'Bancos de Dados',
      description: 'Vivência com bancos de dados e SQL, realizando consultas e trabalhando com informações utilizadas pelas aplicações.'
    },
    {
      icon: Cpu,
      title: 'Automação de Processos',
      description: 'Experiência com RPA, utilizando ferramentas como Blue Prism e Power Automate para automatizar tarefas e contribuir para a melhoria dos processos.'
    },
    {
      icon: Sparkles,
      title: 'Inteligência Artificial',
      description: 'Utilização de ferramentas de IA para apoiar o desenvolvimento de projetos, explorar possibilidades, gerar e revisar código e encontrar soluções para desafios técnicos.'
    },
    {
      icon: TrendingUp,
      title: 'Aprendizado e Melhoria Contínua',
      description: 'Interesse em aprender, experimentar novas tecnologias e desenvolver habilidades na prática, mantendo uma postura aberta a novos desafios e à evolução profissional.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-[#0d1322] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
            Perfil Profissional
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white font-display">
            Sobre Mim
          </p>
          <div className="w-12 h-0.5 bg-cyan-500 mx-auto mt-4" />
        </div>

        {/* Narrative Biography Box */}
        <div className="max-w-4xl mx-auto mb-16 p-8 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg whitespace-pre-line shadow-xl">
          {profile.about_markdown || (
            <>
              Sou profissional de tecnologia, com experiência em automação de processos e vivência em desenvolvimento de software. Ao longo da minha trajetória, tive contato com tecnologias como C#, Java e React, além de ferramentas de RPA.
              {'\n\n'}
              Também utilizo ferramentas de inteligência artificial para apoiar o desenvolvimento de projetos, explorar soluções e facilitar a resolução de problemas. Gosto de aprender na prática, experimentar novas tecnologias e transformar ideias em projetos.
              {'\n\n'}
              Estou em constante aprendizado, buscando ampliar meus conhecimentos, desenvolver minhas habilidades e construir minha trajetória na área de tecnologia.
            </>
          )}
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 group-hover:border-cyan-500/40 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 font-display">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
