import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { askAIConcierge, getLiveWeather } from '../../services/api';
import { useLanguage } from '../../context/useLanguage';
import { 
  SparklesIcon, 
  XIcon, 
  SunIcon, 
  SendIcon, 
  ShieldIcon,
  ChevronRightIcon
} from './Icons';

export default function AIConciergeModal() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [weather, setWeather] = useState(null);
  const [messages, setMessages] = useState(() => {
    const greeting = {
      fr: "Bonjour ! Je suis votre Concierge IA officiel pour le Gouvernorat de Siliana. Posez-moi vos questions sur la météo, les sentiers de Djebel Bargou, les vestiges de Makthar ou les hébergements à Kesra.",
      en: "Hello! I am your official AI Travel Concierge for Siliana. Ask me anything about live weather, Djebel Bargou trails, ancient Makthar, or stays in Kesra.",
      ar: "مرحباً بكم! أنا المساعد الذكي الرسمي لولاية سليانة. اسألني عن حالة الطقس، مسارات جبل برقو، آثار مكثر، أو الإقامة في قرية كسرة."
    }[lang] || "Bonjour ! Je suis votre Concierge IA officiel pour Siliana.";
    return [
      {
        sender: 'assistant',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch live weather on mount for header widget
  useEffect(() => {
    getLiveWeather('bargou')
      .then(data => setWeather(data))
      .catch(err => console.error('Weather widget error:', err));

    const handleOpenEvent = (e) => {
      setIsOpen(true);
      if (e.detail?.prompt) {
        handleSend(e.detail.prompt);
      }
    };
    window.addEventListener('open-ai-concierge', handleOpenEvent);
    return () => window.removeEventListener('open-ai-concierge', handleOpenEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    { label: "🌤️ Météo & sécurité à Bargou", text: "Est-ce que les conditions météo sont favorables pour une randonnée à Djebel Bargou ce weekend ?" },
    { label: "🏛️ Histoire de Makthar & Zama", text: "Raconte-moi l'histoire numide de Makthar et la bataille historique de Zama." },
    { label: "🏡 Week-end à Kesra (200 TND)", text: "Quel séjour et activités conseillez-vous à Kesra pour 2 personnes avec un budget de 200 TND ?" }
  ];

  async function handleSend(textToSend = null) {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const res = await askAIConcierge(text.trim(), lang);
      const assistantMsg = {
        sender: 'assistant',
        text: res.response || "Voici les recommandations pour votre séjour à Siliana.",
        weatherInfo: res.weather,
        actions: res.suggested_actions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: "Désolé, une erreur temporaire est survenue. N'hésitez pas à consulter directement notre catalogue d'activités.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-gold shadow-2xl px-4 py-3 rounded-full flex items-center gap-2.5 group cursor-pointer border border-dark/20 hover:scale-105 transition-all duration-300"
          aria-label="Ouvrir le Concierge IA"
        >
          <div className="relative">
            <SparklesIcon className="w-5 h-5 text-dark animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-forest animate-ping" />
          </div>
          <span className="font-bold text-xs tracking-wide">
            {isOpen ? 'Fermer' : 'Concierge IA & Météo'}
          </span>
          {weather && (
            <span className="hidden sm:inline-block bg-dark/15 px-2 py-0.5 rounded-full text-[11px] font-semibold text-dark">
              {weather.temperature_c}°C
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-h-[85vh] h-[640px] bg-dark-muted/95 backdrop-blur-2xl border border-gold/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn text-cream">
          {/* Header */}
          <div className="p-4 bg-dark/80 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-light/40 border border-gold/40 flex items-center justify-center text-gold">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base text-cream font-bold leading-tight">
                  Visit Siliana <span className="text-gold italic font-normal">Concierge IA</span>
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-cream/70 font-medium">LangGraph &amp; Météo En Direct</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-cream/60 hover:text-cream rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Live Weather Strip */}
          {weather && (
            <div className="bg-forest-dark/70 border-b border-gold/20 px-4 py-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-cream/90 font-medium">
                <SunIcon className="w-4 h-4 text-gold shrink-0" />
                <span>{weather.region} : <strong className="text-gold">{weather.temperature_c}°C</strong> ({weather.condition})</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                weather.is_outdoor_safe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {weather.is_outdoor_safe ? 'Plein Air ✅' : 'Vigilance ⚠️'}
              </span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-body">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-gold text-dark font-semibold rounded-br-xs'
                      : 'bg-dark/80 text-cream/95 border border-white/10 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs">{m.text}</p>

                  {/* Weather Advisory Card if present */}
                  {m.weatherInfo && m.weatherInfo.advisory && (
                    <div className="mt-2.5 pt-2.5 border-t border-white/10 text-[11px] text-cream/80 bg-forest-dark/40 p-2 rounded-xl">
                      <div className="flex items-center gap-1.5 text-gold font-bold mb-1">
                        <ShieldIcon className="w-3.5 h-3.5 text-gold" />
                        <span>Avis Météo &amp; Sécurité :</span>
                      </div>
                      <p>{m.weatherInfo.advisory.join(' ')}</p>
                    </div>
                  )}

                  {/* 1-Click Booking Actions */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                      <span className="text-[10px] text-gold font-bold uppercase tracking-wider block">
                        Suggestions Directes :
                      </span>
                      {m.actions.map((act, aIdx) => (
                        <Link
                          key={aIdx}
                          to={act.url}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between bg-white/10 hover:bg-gold hover:text-dark p-2 rounded-xl text-[11px] font-bold text-cream transition-colors duration-200 group"
                        >
                          <span className="truncate">{act.title}</span>
                          <span className="shrink-0 flex items-center gap-1 text-[10px] opacity-80 group-hover:opacity-100">
                            {act.price ? `${act.price} TND` : 'Voir'}
                            <ChevronRightIcon className="w-3 h-3" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-cream/40 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-cream/60 p-2 bg-white/5 rounded-2xl w-fit">
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] font-medium text-gold ml-1">Analyse Météo &amp; RAG en cours...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-dark/60 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(p.text)}
                disabled={loading}
                className="shrink-0 text-[10px] bg-white/5 hover:bg-gold/20 hover:text-gold border border-white/10 hover:border-gold/30 px-2.5 py-1 rounded-full text-cream/80 transition-all cursor-pointer whitespace-nowrap"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-dark/90 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Question sur Siliana, la météo, un circuit..."
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputValue.trim()}
              className="p-2.5 rounded-xl bg-gold text-dark font-bold hover:bg-gold-light disabled:opacity-40 transition-all cursor-pointer shrink-0"
              aria-label="Envoyer"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
