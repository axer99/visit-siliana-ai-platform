import { Link } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';
import { CompassIcon, HomeIcon, SparklesIcon } from '../components/common/Icons';

function NotFound() {
  const { lang } = useLanguage();

  const content = {
    fr: {
      tag: 'Erreur 404',
      title: 'Sentier Introuvable',
      subtitle: 'Il semble que vous vous soyez aventuré hors des sentiers balisés de Siliana. La page recherchée n\'existe pas ou a été déplacée.',
      btnHome: 'Retour à l\'Accueil',
      btnExplore: 'Découvrir les Aventures',
      quickTitle: 'Vous cherchiez peut-être :'
    },
    en: {
      tag: '404 Error',
      title: 'Trail Not Found',
      subtitle: 'It seems you have wandered off the marked trails of Siliana. The page you are looking for does not exist or has been moved.',
      btnHome: 'Return to Home',
      btnExplore: 'Explore Adventures',
      quickTitle: 'Perhaps you were looking for:'
    },
    ar: {
      tag: 'خطأ 404',
      title: 'المسار غير موجود',
      subtitle: 'يبدو أنك ابتعدت عن المسارات المحددة في ربوع سليانة. الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
      btnHome: 'العودة للرئيسية',
      btnExplore: 'استكشف المغامرات',
      quickTitle: 'ربما كنت تبحث عن:'
    }
  }[lang] || {
    tag: 'Erreur 404',
    title: 'Sentier Introuvable',
    subtitle: 'Il semble que vous vous soyez aventuré hors des sentiers balisés de Siliana.',
    btnHome: 'Retour à l\'Accueil',
    btnExplore: 'Découvrir les Aventures',
    quickTitle: 'Vous cherchiez peut-être :'
  };

  return (
    <div className="bg-cream min-h-screen pt-32 pb-24 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-forest/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10 animate-fadeIn">
        {/* Emblem / Badge */}
        <div className="w-20 h-20 rounded-full bg-forest/10 border border-gold/40 flex items-center justify-center mx-auto mb-6 text-gold shadow-lg">
          <CompassIcon className="w-10 h-10 animate-spin-slow" />
        </div>

        <span className="badge-gold mb-4 inline-block font-bold">
          {content.tag}
        </span>

        <h1 className="font-display text-5xl md:text-6xl text-dark font-light mb-6">
          {content.title}
        </h1>

        <p className="font-body text-dark/70 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          {content.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/" className="btn-primary text-sm px-8 py-3.5 w-full sm:w-auto">
            <HomeIcon className="w-4 h-4" />
            <span>{content.btnHome}</span>
          </Link>
          <Link to="/activities" className="btn-gold text-sm px-8 py-3.5 w-full sm:w-auto">
            <SparklesIcon className="w-4 h-4" />
            <span>{content.btnExplore}</span>
          </Link>
        </div>

        {/* Quick Links Suggestions */}
        <div className="pt-8 border-t border-dark/10">
          <span className="text-xs text-dark/50 uppercase tracking-widest block mb-4 font-semibold">
            {content.quickTitle}
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/stays" className="text-xs text-dark/70 hover:text-gold bg-white px-3.5 py-2 rounded-full border border-dark/10 shadow-xs hover:border-gold/40 transition-all">
              🏡 Hébergements &amp; Gîtes
            </Link>
            <Link to="/events" className="text-xs text-dark/70 hover:text-gold bg-white px-3.5 py-2 rounded-full border border-dark/10 shadow-xs hover:border-gold/40 transition-all">
              📅 Événements &amp; Festivals
            </Link>
            <Link to="/heritage" className="text-xs text-dark/70 hover:text-gold bg-white px-3.5 py-2 rounded-full border border-dark/10 shadow-xs hover:border-gold/40 transition-all">
              🏛️ Histoire &amp; Makthar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
