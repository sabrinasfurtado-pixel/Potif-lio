import React, { useState } from 'react';
import { ExternalLink, Github, Star, FolderGit2, X, Eye, Info } from 'lucide-react';
import { Project } from '../../types/index.ts';

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalProject, setModalProject] = useState<Project | null>(null);

  // Extract distinct categories
  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 bg-[#0b0f19] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
            Portfólio de Aplicações
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white font-display">
            Projetos Desenvolvidos
          </p>
          <div className="w-12 h-0.5 bg-cyan-500 mx-auto mt-4" />
          <p className="text-sm text-slate-400 mt-4 max-w-xl mx-auto">
            Aplicações práticas e soluções integradas. Cada projeto reflete arquitetura organizada, foco na experiência do usuário e resolução de problemas reais.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
                }`}
              >
                {cat === 'all' ? 'Todos os Projetos' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800 max-w-xl mx-auto">
            <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-300 mb-1">Nenhum projeto encontrado</h3>
            <p className="text-sm text-slate-500">
              Não há projetos publicados nesta categoria no momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const techList = project.technologies
                ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                : [];

              return (
                <div
                  key={project.id}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/90 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group hover:-translate-y-1"
                >
                  {/* Card Cover Media or Fallback Container */}
                  <div className="relative aspect-video w-full bg-slate-950/80 border-b border-slate-800/80 overflow-hidden flex items-center justify-center">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.image_alt || project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Safe CSS fallback if image not found
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}

                    {/* CSS Fallback if no image or image hidden */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950">
                      <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-cyan-400 mb-2">
                        <FolderGit2 className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold text-slate-300 font-display">
                        {project.title}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1">
                        {project.category}
                      </span>
                    </div>

                    {/* Featured Star Badge */}
                    {project.is_featured === 1 && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 border border-amber-500/50 text-amber-300 text-[11px] font-semibold flex items-center gap-1 shadow-md backdrop-blur-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Destaque</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Unboxed category metadata */}
                      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1.5">
                        {project.category}
                      </div>

                      <h3 className="text-xl font-bold text-white font-display mb-2">
                        {project.title}
                      </h3>

                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {project.summary}
                      </p>
                    </div>

                    {/* Technologies tags */}
                    {techList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                        {techList.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-300 bg-slate-800/80 border border-slate-700/60"
                          >
                            {tech}
                          </span>
                        ))}
                        {techList.length > 4 && (
                          <span className="text-[11px] text-slate-500 self-center">
                            +{techList.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {project.public_url ? (
                          <a
                            href={project.public_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                            title={`Acessar ${project.title}`}
                          >
                            <span>Ver projeto</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <button
                            onClick={() => setModalProject(project)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>Detalhes</span>
                          </button>
                        )}

                        {project.repo_url ? (
                          <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors cursor-pointer"
                            title="Código fonte no GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        ) : null}
                      </div>

                      {project.full_description && (
                        <button
                          onClick={() => setModalProject(project)}
                          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
                          title="Visualizar descrição completa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {modalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setModalProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              {modalProject.category}
            </div>

            <h3 className="text-2xl font-bold text-white font-display mb-3">
              {modalProject.title}
            </h3>

            {modalProject.image_url && (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-700/80 mb-5 bg-slate-950">
                <img
                  src={modalProject.image_url}
                  alt={modalProject.image_alt || modalProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {modalProject.summary}
            </p>

            {modalProject.full_description && (
              <div className="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                  Visão Geral da Aplicação
                </h4>
                {modalProject.full_description}
              </div>
            )}

            {modalProject.technologies && (
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                  Tecnologias Envolvidas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {modalProject.technologies.split(',').map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 rounded-md"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              {modalProject.public_url && (
                <a
                  href={modalProject.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Acessar Projeto</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {modalProject.repo_url && (
                <a
                  href={modalProject.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>Repositório</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
