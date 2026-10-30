import React, { useState } from 'react';
import { Mail, Linkedin, Github, Send, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { PortfolioProfile } from '../../types/index.ts';
import { publicApi } from '../../api/client.ts';

interface ContactProps {
  profile: PortfolioProfile;
}

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    setLoading(true);
    try {
      const res = await publicApi.sendContact(formData);
      setStatusMessage({ type: 'success', text: res.message });
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Falha ao enviar mensagem. Tente novamente mais tarde.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#0d1322] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
            Comunicação & Conexão
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white font-display">
            Entre em Contato
          </p>
          <div className="w-12 h-0.5 bg-cyan-500 mx-auto mt-4" />
          <p className="text-sm text-slate-400 mt-4 max-w-xl mx-auto">
            Disponível para novas oportunidades, trocas técnicas, projetos de desenvolvimento e iniciativas de automação de processos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
          {/* Left Column: Direct Info & Social Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white font-display">
                Canais Diretos
              </h3>

              <div className="space-y-4 text-sm">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 font-medium">E-mail Profissional</span>
                      <span className="font-mono text-xs">{profile.email}</span>
                    </div>
                  </a>
                )}

                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 font-medium">LinkedIn</span>
                      <span className="font-mono text-xs">sabrina-dos-santos-furtado</span>
                    </div>
                  </a>
                )}

                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/50">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 font-medium">GitHub</span>
                      <span className="font-mono text-xs">sabrinasfurtado-pixel</span>
                    </div>
                  </a>
                )}

                {profile.location && (
                  <div className="flex items-center gap-3 text-slate-300 pt-2 border-t border-slate-800/80">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500 font-medium">Localização</span>
                      <span className="text-xs">{profile.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-xl">
              <h3 className="text-lg font-bold text-white font-display mb-6">
                Envie uma Mensagem
              </h3>

              {statusMessage && (
                <div
                  className={`p-4 rounded-xl text-xs flex items-start gap-2.5 mb-6 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/60 border border-rose-800 text-rose-300'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot anti-spam field (hidden) */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Nome completo *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                      E-mail profissional *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="seu.email@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Assunto
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="Ex: Oportunidade profissional / Parceria técnica"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Mensagem *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Descreva seu projeto ou mensagem..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Enviando mensagem...' : 'Enviar mensagem'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
