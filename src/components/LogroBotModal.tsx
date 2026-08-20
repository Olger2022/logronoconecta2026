import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, RefreshCw, X, Sparkles, Volume2, UserCheck } from 'lucide-react';
import { LanguageMode, UserProfile } from '../types';

interface LogroBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageMode;
  currentUser?: UserProfile | null;
  isDocked?: boolean;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const LogroBotModal: React.FC<LogroBotModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentUser,
  isDocked = true
}) => {
  const getGreetingText = (name?: string, language: LanguageMode = lang) => {
    const displayName = name && name.trim().length > 0 ? name.trim() : 'Estimado/a Ciudadano/a';
    if (language === 'shuar') {
      return `¡Pénker Pujustin, ${displayName}! Wi GAD Logroño IA LogroBot taitai. Yaimin takastai (¡Bienvenido/a, ${displayName}! Soy LogroBot, el asistente virtual bilingüe del GAD Municipal del Cantón Logroño. ¿En qué puedo ayudarte hoy?).`;
    }
    return `¡Hola, ${displayName}! Soy LogroBot, el Asistente Virtual Inteligente del GAD Municipal del Cantón Logroño (Morona Santiago). Te doy la más cordial bienvenida a la plataforma. ¿En qué puedo orientarte hoy? Puedo ayudarte con reportes de baches, agua potable, alcantarillado, trámites de patentes y atención en las parroquias Yaupi y Shimpis.`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: getGreetingText(currentUser?.name, lang),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update greeting message when user or language changes if message history is at initial state
  useEffect(() => {
    if (currentUser?.name) {
      setMessages((prev) => {
        if (prev.length <= 1) {
          return [
            {
              sender: 'bot',
              text: getGreetingText(currentUser.name, lang),
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        }
        return prev;
      });
    }
  }, [currentUser?.name, lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const playVoiceMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'shuar' ? 'es-EC' : 'es-EC';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const promptText = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: promptText, 
          language: lang,
          userName: currentUser?.name || 'Ciudadano'
        })
      });

      const data = await response.json();
      const botReply = data.reply || 'Disculpe, no pude procesar la consulta en este momento.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Pénker Pujustin, ${currentUser?.name || 'Ciudadano'}. El GAD Logroño está procesando su solicitud. Puede reportar cualquier daño directamente en el formulario de la app.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const content = (
    <div className={`bg-white dark:bg-slate-900 rounded-3xl w-full border-2 border-emerald-700/60 shadow-xl flex flex-col overflow-hidden text-xs ${
      isDocked ? 'h-[620px] sm:h-[700px] max-h-[calc(100vh-120px)]' : 'h-[600px] max-w-md'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#063323] via-[#0A4532] to-[#0A4191] text-white p-3.5 flex items-center justify-between border-b border-emerald-600/40 shrink-0">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-400 p-0.5 flex items-center justify-center shadow-md shrink-0">
            <Bot className="w-5 h-5 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-extrabold text-sm truncate">LogroBot IA Municipal</h3>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-[10px] text-emerald-100 font-medium truncate">
                {lang === 'shuar' ? 'Chicham Shuar & Español' : 'Asistente Cantonal'}
              </span>
              {currentUser?.name && (
                <span className="bg-white/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded-full truncate max-w-[110px]">
                  {currentUser.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMessages([
                {
                  sender: 'bot',
                  text: getGreetingText(currentUser?.name, lang),
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]);
            }}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Reiniciar conversación"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar / Ocultar LogroBot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950/60">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-2xl shadow-sm text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#0A4191] text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
              }`}
            >
              {msg.text}
            </div>
            <div className="flex items-center space-x-2 mt-1 px-1 text-[9px] text-slate-400">
              <span>{msg.time}</span>
              {msg.sender === 'bot' && (
                <button
                  type="button"
                  onClick={() => playVoiceMessage(msg.text)}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center space-x-1 cursor-pointer font-bold"
                  title="Escuchar mensaje con voz"
                >
                  <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>Escuchar</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs italic bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>LogroBot está respondiendo...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="p-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex space-x-1.5 overflow-x-auto text-[10px] shrink-0 no-scrollbar">
        <button
          type="button"
          onClick={() => setInput('¿Cómo reporto un bache o daño en la vía?')}
          className="bg-white dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 shrink-0 cursor-pointer border border-slate-300 dark:border-slate-600"
        >
          🚧 Reportar Bache
        </button>
        <button
          type="button"
          onClick={() => setInput('¿Cómo reporto una rotura de agua en Shimpis?')}
          className="bg-white dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 shrink-0 cursor-pointer border border-slate-300 dark:border-slate-600"
        >
          💧 Agua en Shimpis
        </button>
        <button
          type="button"
          onClick={() => setInput('¿Cuál es el horario de atención en el GAD Logroño?')}
          className="bg-white dark:bg-slate-700 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 shrink-0 cursor-pointer border border-slate-300 dark:border-slate-600"
        >
          🏛️ Horarios GAD
        </button>
        <button
          type="button"
          onClick={() => setInput('Pénker Pujustin! Yaimin Shuar Chicham')}
          className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full shrink-0 cursor-pointer border border-amber-300"
        >
          🗣️ Shuar Chicham
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 shrink-0">
        <input
          type="text"
          placeholder={lang === 'shuar' ? 'Chicham aatsa LogroBot...' : 'Escriba su consulta al municipio...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-[#0A4191] hover:bg-blue-800 text-white p-2.5 rounded-xl shadow cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
          title="Enviar mensaje"
        >
          <Send className="w-4 h-4 text-amber-300" />
        </button>
      </form>
    </div>
  );

  if (isDocked) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {content}
    </div>
  );
};
