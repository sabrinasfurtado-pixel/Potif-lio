import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, AlertTriangle, X, Calendar, MapPin } from 'lucide-react';
import { adminApi } from '../../api/client.ts';
import { Experience } from '../../types/index.ts';

export const AdminExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getExperiences();
      setExperiences(res.experiences);
    } catch (err) {
      setNotification({
        type: 'error',
        text: err instanceof Error ? err.message : 'Falha ao carregar experiências.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const showSuccess = (msg: string) => {
    setNotification({ type: 'success', text: msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const showError = (msg: string) => {
    setNotification({ type: 'error', text: msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingExp({
      company: '',
      role: '',
      start_date: 'Atual',
      end_date: '',
      is_current: 0,
      work_mode: 'Híbrido',
      description: '',
      technologies: '',
      highlights: '',
      sort_order: experiences.length + 1
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp({ ...exp });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente remover esta experiência?')) return;
    try {
      await adminApi.deleteExperience(id);
      showSuccess('Experiência removida com sucesso!');
      loadExperiences();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erro ao remover experiência.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    if (!editingExp.company?.trim() || !editingExp.role?.trim() || !editingExp.description?.trim()) {
      showError('Empresa, cargo e descrição são campos obrigatórios.');
      return;
    }

    try {
      if (editingExp.id) {
        await adminApi.updateExperience(editingExp.id, editingExp);
        showSuccess('Experiência atualizada com sucesso!');
      } else {
        await adminApi.createExperience(editingExp);
        showSuccess('Experiência adicionada com sucesso!');
      }
      setModalOpen(false);
      setEditingExp(null);
      loadExperiences();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erro ao salvar experiência.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Gerenciamento de Trajetória Profissional
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mantenha seu histórico de atuações, modalidades e tecnologias utilizadas atualizado.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Experiência</span>
        </button>
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
          Carregando experiências...
        </div>
      ) : experiences.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          Nenhuma experiência profissional cadastrada.
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-colors shadow-lg space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                      {exp.company}
                    </span>
                    {exp.is_current === 1 && (
                      <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                        Emprego Atual
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white font-display mt-0.5">
                    {exp.role}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Editar experiência"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Excluir experiência"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {exp.start_date} {exp.end_date ? `– ${exp.end_date}` : exp.is_current ? '– Presente' : ''}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {exp.work_mode}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>

              {exp.technologies && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                  {exp.technologies.split(',').map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white font-display mb-4">
              {editingExp.id ? 'Editar Experiência' : 'Cadastrar Nova Experiência'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="Ex: OPAH IT Consultoria (Banco Carrefour)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Cargo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.role || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="Ex: Analista de Sistemas"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Data Início
                  </label>
                  <input
                    type="text"
                    value={editingExp.start_date || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, start_date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                    placeholder="Ex: Jan 2023 ou Atual"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Data Término
                  </label>
                  <input
                    type="text"
                    disabled={editingExp.is_current === 1}
                    value={editingExp.end_date || ''}
                    onChange={(e) => setEditingExp({ ...editingExp, end_date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 disabled:opacity-40"
                    placeholder="Deixe em branco se atual"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Modalidade
                  </label>
                  <select
                    value={editingExp.work_mode || 'Híbrido'}
                    onChange={(e) => setEditingExp({ ...editingExp, work_mode: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Híbrido">Híbrido</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingExp.is_current === 1}
                    onChange={(e) => setEditingExp({ ...editingExp, is_current: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 rounded text-cyan-400 bg-slate-800 border-slate-700"
                  />
                  <span>Esta é minha atuação profissional atual</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descrição das Responsabilidades *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingExp.description || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Detalhamento das atribuições técnicas e atividades realizadas..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Principais Tecnologias e Metodologias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={editingExp.technologies || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, technologies: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Ex: Agilidade, C#, .NET, SQL, RPA"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Destaques Profissionais Opcionais
                </label>
                <input
                  type="text"
                  value={editingExp.highlights || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, highlights: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  placeholder="Ex: Liderança em práticas ágeis e mapeamento de eficiência operacional"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md cursor-pointer"
                >
                  Salvar Experiência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
