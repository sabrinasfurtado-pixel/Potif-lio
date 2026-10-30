import React from 'react';
import { Code, Bot, GitPullRequest, Wrench, Sparkles } from 'lucide-react';
import { SkillCategory } from '../../types/index.ts';

interface SkillsProps {
  categories: SkillCategory[];
}

export const Skills: React.FC<SkillsProps> = ({ categories }) => {
  const getCategoryIcon = (name: string) => {
    const upper = name.toUpperCase();
    if (upper.includes('INTELIGÊNCIA') || upper.includes('IA') || upper.includes('AI')) {
      return Sparkles;
    }
    if (upper.includes('DESENVOLVIMENTO') || upper.includes('DEV') || upper.includes('SOFTWARE')) {
      return Code;
    }
    if (upper.includes('AUTOMAÇÃO') || upper.includes('RPA') || upper.includes('AUTO')) {
      return Bot;
    }
    if (upper.includes('PROCESSO') || upper.includes('AGILIDADE') || upper.includes('AGILE')) {
      return GitPullRequest;
    }
    return Wrench;
  };

  return (
    <section id="skills" className="py-20 bg-[#0b0f19] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
            Competências Técnicas
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white font-display">
            Habilidades & Ferramentas
          </p>
          <div className="w-12 h-0.5 bg-cyan-500 mx-auto mt-4" />
          <p className="text-sm text-slate-400 mt-4 max-w-xl mx-auto">
            Habilidades consolidadas na prática, focadas na criação de soluções tecnológicas funcionais, automação e metodologias colaborativas.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Nenhuma habilidade cadastrada no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/90 p-7 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-lg"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                      <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-bold text-white font-display tracking-wide uppercase">
                        {cat.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {cat.skills && cat.skills.length > 0 ? (
                        cat.skills.map((skill) => (
                          <div
                            key={skill.id}
                            className="px-3.5 py-2 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-200 text-xs font-medium hover:border-cyan-500/50 hover:text-white transition-all duration-150 flex items-center gap-1.5"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{skill.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">Sem itens nesta categoria.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Categoria ativa</span>
                    <span className="font-mono text-cyan-400">{cat.skills?.length || 0} competências</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
