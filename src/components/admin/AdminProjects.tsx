import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  Upload,
  CheckCircle,
  Clock,
  Star,
  X,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import { adminApi } from '../../api/client.ts';
import { Project } from '../../types/index.ts';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getProjects();
      setProjects(res.projects);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Falha ao carregar projetos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      slug: '',
      category: 'Finanças pessoais',
      summary: '',
      full_description: '',
      technologies: '',
      public_url: '',
      repo_url: '',
      image_url: '',
      image_alt: '',
      is_featured: 0,
      status: 'published',
      sort_order: (projects.length + 1)
    });
    setModalOpen(true);
    setErrorText(null);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setModalOpen(true);
    setErrorText(null);
  };

  const handleToggleStatus = async (project: Project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      await adminApi.toggleProjectStatus(project.id, newStatus);
      setSuccessText(`Status do projeto "${project.title}" alterado para ${newStatus === 'published' ? 'Publicado' : 'Rascunho'}.`);
      loadProjects();
      setTimeout(() => setSuccessText(null), 3000);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteProject(id);
      setDeleteConfirmId(null);
      setSuccessText('Projeto excluído com sucesso.');
      loadProjects();
      setTimeout(() => setSuccessText(null), 3000);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Erro ao excluir projeto.');
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorText('A imagem deve ter no máximo 5MB.');
      return;
    }

    try {
      setUploadingImage(true);
      const res = await adminApi.uploadImage(file);
      setEditingProject((prev) => prev ? { ...prev, image_url: res.url } : null);
      setSuccessText('Imagem enviada com sucesso!');
      setTimeout(() => setSuccessText(null), 2500);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Falha no upload da imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title?.trim() || !editingProject.summary?.trim() || !editingProject.category?.trim()) {
      setErrorText('Título, resumo e categoria são campos obrigatórios.');
      return;
    }

    try {
      if (editingProject.id) {
        await adminApi.updateProject(editingProject.id, editingProject);
        setSuccessText('Projeto atualizado com sucesso!');
      } else {
        await adminApi.createProject(editingProject);
        setSuccessText('Novo projeto cadastrado com sucesso!');
      }
      setModalOpen(false);
      setEditingProject(null);
      loadProjects();
      setTimeout(() => setSuccessText(null), 3000);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Erro ao salvar projeto.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Gerenciamento de Projetos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cadastre, edite, publique ou alterne entre rascunho e publicação de projetos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {/* Notifications */}
      {successText && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successText}</span>
        </div>
      )}

      {errorText && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorText}</span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Projeto</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Destaque</th>
                <th className="py-3.5 px-4">Links</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Carregando projetos...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Nenhum projeto cadastrado no banco de dados.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-slate-500">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FolderGit2 className="w-5 h-5 text-cyan-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-white block text-sm">
                            {p.title}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-300 font-medium">
                      {p.category}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                          p.status === 'published'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900/80'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-700/60 hover:bg-amber-900/80'
                        }`}
                        title="Clique para alternar status"
                      >
                        {p.status === 'published' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Publicado</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Rascunho</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4">
                      {p.is_featured === 1 ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>Sim</span>
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {p.public_url && (
                          <a
                            href={p.public_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                            title={`Acessar: ${p.public_url}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {p.repo_url && (
                          <a
                            href={p.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                            title={`Repositório: ${p.repo_url}`}
                          >
                            <FolderGit2 className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setPreviewProject(p)}
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Pré-visualizar projeto"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Editar projeto"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Excluir projeto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Excluir este projeto?</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Esta ação removerá o projeto permanentemente do banco de dados. Esta operação não poderá ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Form Modal (Add / Edit) */}
      {modalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white font-display mb-1">
              {editingProject.id ? 'Editar Projeto' : 'Novo Projeto'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Todos os dados são persistidos imediatamente no banco de dados e refletidos no portfólio.
            </p>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="Ex: Happy Finance"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Slug / Identificador URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.slug || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="happy-finance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.category || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="Ex: Finanças pessoais, Automação, APIs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={editingProject.sort_order ?? 0}
                    onChange={(e) => setEditingProject({ ...editingProject, sort_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descrição Resumida *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editingProject.summary || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  placeholder="Resumo do projeto exibido no card principal..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descrição Completa & Funcionalidades
                </label>
                <textarea
                  rows={4}
                  value={editingProject.full_description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, full_description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Detalhamento técnico, arquitetura e benefícios da solução..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tecnologias Utilizadas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={editingProject.technologies || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Ex: C#, .NET, Entity Framework, SQL, REST API, React"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    URL Pública do Projeto
                  </label>
                  <input
                    type="url"
                    value={editingProject.public_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, public_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="https://meuprojeto.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    URL do Repositório (opcional)
                  </label>
                  <input
                    type="url"
                    value={editingProject.repo_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, repo_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="https://github.com/sabrinafurtado/..."
                  />
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">
                    Imagem de Capa do Projeto
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 rounded-md hover:bg-cyan-900/60 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Enviando...' : 'Fazer Upload de Imagem'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editingProject.image_url || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="URL ou caminho da imagem (/uploads/...)"
                  />
                  <input
                    type="text"
                    value={editingProject.image_alt || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, image_alt: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="Texto alternativo (alt) acessível"
                  />
                </div>

                {editingProject.image_url && (
                  <div className="relative w-32 aspect-video rounded-lg overflow-hidden border border-slate-700 mt-2">
                    <img
                      src={editingProject.image_url}
                      alt="Prévia"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Status and Featured Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.is_featured === 1}
                    onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded text-cyan-400 bg-slate-800 border-slate-700"
                  />
                  <span>Projeto em destaque no portfólio</span>
                </label>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">Status:</span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={editingProject.status === 'published'}
                      onChange={() => setEditingProject({ ...editingProject, status: 'published' })}
                      className="text-cyan-400"
                    />
                    <span>Publicado</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={editingProject.status === 'draft'}
                      onChange={() => setEditingProject({ ...editingProject, status: 'draft' })}
                      className="text-cyan-400"
                    />
                    <span>Rascunho (Oculto)</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  Salvar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setPreviewProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-[11px] font-mono text-cyan-400 uppercase mb-1">
              {previewProject.category} · {previewProject.status === 'published' ? 'Público' : 'Rascunho'}
            </div>

            <h3 className="text-xl font-bold text-white font-display mb-2">
              {previewProject.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {previewProject.summary}
            </p>

            {previewProject.full_description && (
              <p className="text-xs text-slate-400 leading-relaxed mb-4 whitespace-pre-line p-3 bg-slate-800/40 rounded-lg">
                {previewProject.full_description}
              </p>
            )}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Slug: /{previewProject.slug}
              </span>
              {previewProject.public_url && (
                <a
                  href={previewProject.public_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
                >
                  <span>Abrir URL pública</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
