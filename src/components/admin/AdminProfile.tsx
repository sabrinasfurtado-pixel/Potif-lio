import React, { useState, useEffect, useRef } from 'react';
import { Save, Upload, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { adminApi } from '../../api/client.ts';
import { PortfolioProfile } from '../../types/index.ts';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Partial<PortfolioProfile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminApi
      .getProfile()
      .then((res) => setProfile(res.profile))
      .catch((err) => setErrorMessage(err instanceof Error ? err.message : 'Falha ao carregar perfil.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('A imagem deve ter no máximo 5MB.');
      return;
    }

    try {
      setUploadingAvatar(true);
      const res = await adminApi.uploadImage(file);
      setProfile((prev) => ({ ...prev, avatar_url: res.url }));
      setSuccessMessage('Foto/avatar atualizada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Falha ao enviar avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!profile.full_name?.trim() || !profile.professional_title?.trim() || !profile.hero_intro?.trim()) {
      setErrorMessage('Nome, título profissional e texto de apresentação são obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      const res = await adminApi.updateProfile(profile);
      setProfile(res.profile);
      setSuccessMessage('Informações do portfólio salvas com sucesso no banco de dados!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Falha ao salvar informações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs">
        Carregando informações do perfil...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
          Informações Pessoais & Apresentação
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Edite as informações exibidas na página inicial, sobre mim, contatos e rodapé do seu portfólio público.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo / Avatar Section */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-display">
            Fotografia ou Avatar Profissional
          </h3>
          <p className="text-xs text-slate-400">
            Você pode enviar sua foto real quando quiser. Caso não cadastre nenhuma imagem, o portfólio exibe automaticamente um espaço reservado com seu monograma.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-slate-600" />
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>{uploadingAvatar ? 'Enviando foto...' : 'Escolher Foto do Computador'}</span>
              </button>

              {profile.avatar_url && (
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, avatar_url: '' })}
                  className="block text-[11px] text-rose-400 hover:underline mx-auto sm:mx-0 cursor-pointer"
                >
                  Remover foto e usar placeholder elegante
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Identity & Hero Texts */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-display">
            Identidade & Cabeçalho Inicial
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Título Profissional *
              </label>
              <input
                type="text"
                required
                value={profile.professional_title || ''}
                onChange={(e) => setProfile({ ...profile, professional_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Texto de Apresentação (Seção Principal) *
            </label>
            <textarea
              required
              rows={3}
              value={profile.hero_intro || ''}
              onChange={(e) => setProfile({ ...profile, hero_intro: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
            />
          </div>
        </div>

        {/* About Me Details */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-display">
            Seção Sobre Mim
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Trajetória Profissional e Interesses Técnicos
            </label>
            <textarea
              rows={6}
              value={profile.about_markdown || ''}
              onChange={(e) => setProfile({ ...profile, about_markdown: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Contact Links & Footer */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-display">
            Contatos & Rodapé
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                E-mail Profissional
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Localização (Cidade, UF)
              </label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                LinkedIn (URL Completa)
              </label>
              <input
                type="url"
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                placeholder="https://www.linkedin.com/in/sabrina-dos-santos-furtado-67374a185/"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                GitHub (URL Completa)
              </label>
              <input
                type="url"
                value={profile.github_url || ''}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                placeholder="https://github.com/sabrinasfurtado-pixel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Mensagem de Encerramento do Rodapé
            </label>
            <input
              type="text"
              value={profile.footer_text || ''}
              onChange={(e) => setProfile({ ...profile, footer_text: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvando alterações...' : 'Salvar Todas as Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
