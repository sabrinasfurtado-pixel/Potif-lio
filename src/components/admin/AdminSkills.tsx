import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { adminApi } from '../../api/client.ts';
import { Skill, SkillCategory } from '../../types/index.ts';

export const AdminSkills: React.FC = () => {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id?: number; name: string; sort_order: number } | null>(null);

  // Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<{ id?: number; category_id: number; name: string; sort_order: number } | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getSkillsData();
      setCategories(res.categories);
      setSkills(res.skills);
    } catch (err) {
      setNotification({
        type: 'error',
        text: err instanceof Error ? err.message : 'Falha ao carregar habilidades.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccess = (msg: string) => {
    setNotification({ type: 'success', text: msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const showError = (msg: string) => {
    setNotification({ type: 'error', text: msg });
    setTimeout(() => setNotification(null), 4000);
  };

  // Category operations
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name.trim()) return;

    try {
      if (editingCategory.id) {
        await adminApi.updateCategory(editingCategory.id, editingCategory.name.trim(), editingCategory.sort_order);
        showSuccess('Categoria atualizada com sucesso!');
      } else {
        await adminApi.createCategory(editingCategory.name.trim(), editingCategory.sort_order);
        showSuccess('Nova categoria criada com sucesso!');
      }
      setCatModalOpen(false);
      loadData();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erro ao salvar categoria.');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Deseja excluir esta categoria e todas as habilidades associadas a ela?')) return;
    try {
      await adminApi.deleteCategory(id);
      showSuccess('Categoria excluída com sucesso!');
      loadData();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erro ao excluir categoria.');
    }
  };

  // Skill operations
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name.trim() || !editingSkill.category_id) return;

    try {
      if (editingSkill.id) {
        await adminApi.updateSkill(editingSkill.id, editingSkill.category_id, editingSkill.name.trim(), editingSkill.sort_order);
        showSuccess('Habilidade atualizada com sucesso!');
      } else {
        await adminApi.createSkill(editingSkill.category_id, editingSkill.name.trim(), editingSkill.sort_order);
        showSuccess('Habilidade adicionada com sucesso!');
      }
      setSkillModalOpen(false);
      loadData();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erro ao salvar habilidade.');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    try {
      await adminApi.deleteSkill(id);
      showSuccess('Habilidade removida com sucesso!');
      loadData();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erro ao remover habilidade.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Gerenciamento de Habilidades Técnicas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize suas competências por categorias temáticas. As alterações são refletidas instantaneamente no portfólio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingCategory({ name: '', sort_order: categories.length + 1 });
              setCatModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Nova Categoria</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
              : 'bg-rose-950/70 border border-rose-800 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          Carregando habilidades...
        </div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          Nenhuma categoria cadastrada.
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category_id === cat.id);
            return (
              <div
                key={cat.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white font-display tracking-wide uppercase">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                      {catSkills.length} competências
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingSkill({ category_id: cat.id, name: '', sort_order: catSkills.length + 1 });
                        setSkillModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/60 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Habilidade</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingCategory({ id: cat.id, name: cat.name, sort_order: cat.sort_order });
                        setCatModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                      title="Editar Categoria"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Excluir Categoria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {catSkills.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">
                      Nenhuma habilidade cadastrada nesta categoria.
                    </span>
                  ) : (
                    catSkills.map((s) => (
                      <div
                        key={s.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200 group"
                      >
                        <span>{s.name}</span>
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingSkill({ id: s.id, category_id: s.category_id, name: s.name, sort_order: s.sort_order });
                              setSkillModalOpen(true);
                            }}
                            className="p-0.5 hover:text-cyan-400 cursor-pointer"
                            title="Editar habilidade"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(s.id)}
                            className="p-0.5 hover:text-rose-400 cursor-pointer"
                            title="Remover habilidade"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Category Modal */}
      {catModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setCatModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white font-display mb-4">
              {editingCategory.id ? 'Editar Categoria' : 'Nova Categoria'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Ex: DESENVOLVIMENTO, AUTOMAÇÃO"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  value={editingCategory.sort_order}
                  onChange={(e) => setEditingCategory({ ...editingCategory, sort_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {skillModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSkillModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white font-display mb-4">
              {editingSkill.id ? 'Editar Habilidade' : 'Nova Habilidade'}
            </h3>
            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Categoria
                </label>
                <select
                  value={editingSkill.category_id}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category_id: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome da Habilidade / Tecnologia
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Ex: C#, .NET, Power Automate"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ordem de Exibição
                </label>
                <input
                  type="number"
                  value={editingSkill.sort_order}
                  onChange={(e) => setEditingSkill({ ...editingSkill, sort_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
