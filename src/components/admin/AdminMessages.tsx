import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Clock, Reply, AlertTriangle } from 'lucide-react';
import { adminApi } from '../../api/client.ts';
import { ContactMessage } from '../../types/index.ts';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getMessages();
      setMessages(res.messages);
    } catch (err) {
      setNotification({
        type: 'error',
        text: err instanceof Error ? err.message : 'Falha ao carregar mensagens.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      await adminApi.markMessageRead(msg.id, msg.is_read === 0);
      loadMessages();
    } catch (err) {
      setNotification({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao atualizar status.'
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir esta mensagem?')) return;
    try {
      await adminApi.deleteMessage(id);
      setNotification({ type: 'success', text: 'Mensagem excluída com sucesso.' });
      loadMessages();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao excluir mensagem.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Mensagens Recebidas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Contatos enviados através do formulário público do seu portfólio.
          </p>
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
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          Carregando mensagens...
        </div>
      ) : messages.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
          <Mail className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <span>Nenhuma mensagem recebida até o momento.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all ${
                msg.is_read === 0
                  ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {msg.name}
                    </span>
                    <span className="text-xs text-cyan-400 font-mono">
                      &lt;{msg.email}&gt;
                    </span>
                    {msg.is_read === 0 && (
                      <span className="text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                        Nova
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-1">
                    Assunto: {msg.subject || 'Contato via Portfólio'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {msg.created_at}
                  </span>

                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Contato Portfólio')}`}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                    title="Responder por e-mail"
                  >
                    <Reply className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleToggleRead(msg)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    title={msg.is_read ? 'Marcar como não lida' : 'Marcar como lida'}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${msg.is_read ? 'text-emerald-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                    title="Excluir mensagem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-3 whitespace-pre-line">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
