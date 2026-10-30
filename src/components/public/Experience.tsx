import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle } from 'lucide-react';
import { Experience as ExperienceType } from '../../types/index.ts';

interface ExperienceProps {
  experiences: ExperienceType[];
}

export const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-20 bg-[#0d1322] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
            Minha trajetória
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white font-display">
            Experiência profissional
          </p>
          <div className="w-12 h-0.5 bg-cyan-500 mx-auto mt-4" />
          <p className="text-sm sm:text-base text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
            Minha trajetória na área de tecnologia reúne experiências com automação de processos, desenvolvimento de software e agilidade. Ao longo desse caminho, venho adquirindo novos conhecimentos, trabalhando com diferentes tecnologias e ampliando minha experiência profissional.
          </p>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Nenhuma experiência cadastrada no momento.
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:bg-slate-800/80 before:hidden md:before:block">
            {experiences.map((exp, idx) => {
              const isEven = idx % 2 === 0;
              const techList = exp.technologies
                ? exp.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={exp.id}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Dot for Desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 w-4 h-4 rounded-full border-2 border-cyan-400 bg-slate-900 z-10 items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  </div>

                  {/* Experience Card */}
                  <div className="w-full md:w-[calc(50%-2rem)]">
                    <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all shadow-xl">
                      {/* Card Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                            {exp.company}
                          </span>
                          <h3 className="text-xl font-bold text-white font-display mt-0.5">
                            {exp.role}
                          </h3>
                        </div>

                        {exp.is_current === 1 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            Emprego Atual
                          </span>
                        ) : null}
                      </div>

                      {/* Metadata Row (Unboxed with separators) */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800/80">
                        <div className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {exp.start_date} {exp.end_date ? `– ${exp.end_date}` : exp.is_current ? '– Presente' : ''}
                          </span>
                        </div>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <div className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{exp.work_mode || 'Híbrido'}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-300 leading-relaxed mb-4 whitespace-pre-line">
                        {exp.description}
                      </p>

                      {/* Optional Highlight */}
                      {exp.highlights ? (
                        <div className="mb-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{exp.highlights}</span>
                        </div>
                      ) : null}

                      {/* Tech Stack List */}
                      {techList.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {techList.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 text-[11px] font-medium text-slate-300 bg-slate-800/60 border border-slate-700/60 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
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
