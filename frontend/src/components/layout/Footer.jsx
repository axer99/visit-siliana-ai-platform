import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/site-images/logo.avif';
import { useLanguage } from '../../context/useLanguage';
import { 
  ArrowUpIcon, 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon, 
  ClockIcon, 
  CheckCircleIcon,
  GlobeIcon,
  ShieldIcon,
} from '../common/Icons';

import partner1 from '../../assets/partner-images/partner-1.avif';
import partner2 from '../../assets/partner-images/partner-2.avif';
import partner3 from '../../assets/partner-images/partner-3.avif';
import partner4 from '../../assets/partner-images/partner-4.avif';

/* ── Social icons ── */
function InstagramIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function YouTubeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function TripAdvisorIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.006 4.295c-2.67 0-5.34.672-7.69 2.016L0 6.31l.002.002C1.73 8.07 2.63 10.48 2.417 12.9a9.397 9.397 0 0 0 2.748 7.3 9.397 9.397 0 0 0 7.3 2.748 9.39 9.39 0 0 0 6.344-2.748 9.403 9.403 0 0 0 2.748-6.344c.002-.42-.023-.84-.072-1.258.19.015.38.023.572.023a5.17 5.17 0 0 0 5.17-5.17h-2.396a2.77 2.77 0 0 1-2.77 2.77 2.77 2.77 0 0 1-2.77-2.77H17.3a9.407 9.407 0 0 0-5.294-3.156zM12 7.73a4.27 4.27 0 1 1 0 8.54A4.27 4.27 0 0 1 12 7.73zm0 2.135a2.135 2.135 0 1 0 0 4.27 2.135 2.135 0 0 0 0-4.27z"/>
    </svg>
  );
}

function Footer() {
  const { t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const partners = [
    { img: partner1, name: t.partners.minCulture, sub: t.partners.minCultureSub },
    { img: partner2, name: t.partners.ontt,       sub: t.partners.onttSub },
    { img: partner4, name: t.partners.tripTrek,   sub: t.partners.tripTrekSub },
    { img: partner3, name: t.partners.guides,     sub: t.partners.guidesSub },
  ];

  const socials = [
    { name: 'Instagram',   url: 'https://instagram.com',   Icon: InstagramIcon,   color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
    { name: 'Facebook',    url: 'https://facebook.com',    Icon: FacebookIcon,    color: 'hover:bg-blue-600' },
    { name: 'YouTube',     url: 'https://youtube.com',     Icon: YouTubeIcon,     color: 'hover:bg-red-600' },
    { name: 'TripAdvisor', url: 'https://tripadvisor.com', Icon: TripAdvisorIcon, color: 'hover:bg-emerald-600' },
  ];

  return (
    <footer className="bg-dark text-cream pt-20 pb-10 border-t border-gold/20 relative overflow-hidden">
      {/* Background Blur Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-forest/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Partners Section */}
        <div className="mb-16 pb-12 border-b border-white/10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-2">
              {t.partners.tag}
            </span>
            <h3 className="font-display text-2xl text-cream font-light">
              {t.partners.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {partners.map((p) => (
              <div
                key={p.name}
                className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 hover:border-gold/40 hover:bg-white/[0.08] transition-all duration-500 cursor-default"
              >
                {/* Gold accent line on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-2/3 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full transition-all duration-500" />

                {/* Logo */}
                <div className="w-20 h-14 flex items-center justify-center">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="max-w-full max-h-full object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>

                {/* Name & subtitle */}
                <div className="text-center">
                  <p className="text-cream/80 text-xs font-semibold leading-snug group-hover:text-cream transition-colors duration-300">{p.name}</p>
                  <span className="text-[10px] text-gold/70 font-medium block mt-1 group-hover:text-gold transition-colors duration-300">{p.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Columns Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Column 1: Brand + Socials */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="w-10 h-10 rounded-full bg-forest-light/30 border border-gold/40 flex items-center justify-center">
                <img src={logo} alt="Visit Siliana" className="h-7 w-auto object-contain" />
              </div>
              <div>
                <span className="font-display text-2xl text-cream font-bold tracking-tight block leading-none">
                  Visit <span className="text-gold italic font-normal">Siliana</span>
                </span>
                <span className="text-xs text-cream/70 uppercase tracking-widest block mt-1 font-medium">
                  {t.hero.tag}
                </span>
              </div>
            </Link>

            <p className="text-cream/70 text-sm leading-relaxed mb-6 max-w-md">
              {t.hero.subtitle}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socials.map(({ name, url, Icon, color }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  title={name}
                  className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/70 hover:text-white hover:border-transparent transition-all duration-300 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-gold text-xs font-semibold uppercase tracking-widest mb-5">
              {t.nav.home} &amp; Menu
            </h4>
            <ul className="space-y-3 text-sm text-cream/80 font-body">
              <li><Link to="/" className="hover:text-gold transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/activities" className="hover:text-gold transition-colors">{t.nav.activities}</Link></li>
              <li><Link to="/stays" className="hover:text-gold transition-colors">{t.nav.stays}</Link></li>
              <li><Link to="/events" className="hover:text-gold transition-colors">{t.nav.events}</Link></li>
              <li><Link to="/heritage" className="hover:text-gold transition-colors">{t.nav.heritage}</Link></li>
              <li className="pt-2">
                <Link 
                  to="/admin/login" 
                  className="inline-flex items-center gap-1.5 text-xs text-cream/40 hover:text-gold transition-all duration-300 py-1.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-gold/30 group"
                  title={t.nav.adminPortal}
                >
                  <ShieldIcon className="w-3.5 h-3.5 text-gold/60 group-hover:text-gold transition-colors" />
                  <span>{t.nav.adminPortal}</span>
                  <span className="text-[10px] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-gold text-xs font-semibold uppercase tracking-widest mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>Avenue Habib Bourguiba, 6100 Siliana, Tunisie</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-4 h-4 text-gold shrink-0" />
                <span>+216 78 800 123</span>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon className="w-4 h-4 text-gold shrink-0" />
                <span>contact@visit-siliana.tn</span>
              </li>
              <li className="flex items-center gap-3">
                <ClockIcon className="w-4 h-4 text-gold shrink-0" />
                <span>Lun - Sam: 08:30 - 17:30</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-gold text-xs font-semibold uppercase tracking-widest mb-5">
              Newsletter
            </h4>
            <p className="text-cream/70 text-xs mb-4 leading-relaxed">
              Recevez les guides de randonnées et l'agenda de Siliana.
            </p>

            {subscribed ? (
              <div className="bg-forest/60 border border-gold/50 rounded-xl p-3 text-xs text-cream flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-gold shrink-0" />
                <span>Merci! Vous êtes inscrit.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Votre email"
                  required
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-cream placeholder-cream/40 focus:outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  className="btn-gold text-xs py-2.5 w-full justify-center text-dark font-bold cursor-pointer"
                >
                  S'abonner
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <div className="flex items-center gap-2">
            <GlobeIcon className="w-4 h-4 text-gold" />
            <span>Visit Siliana © 2026. République Tunisienne.</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Socials repeated compactly at bottom */}
            <div className="flex gap-2">
              {socials.map(({ name, url, Icon }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  title={name}
                  className="text-cream/40 hover:text-gold transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-forest-light/40 border border-gold/40 text-gold hover:bg-gold hover:text-dark transition-all duration-300"
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
