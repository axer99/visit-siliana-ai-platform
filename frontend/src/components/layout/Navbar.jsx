import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/site-images/logo.avif';
import { useLanguage } from '../../context/useLanguage';
import { useCurrency } from '../../context/useCurrency';
import { 
  MenuIcon, 
  XIcon, 
  SparklesIcon, 
  ChevronRightIcon,
  ChevronDownIcon
} from '../common/Icons';

function Navbar() {
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { currency, setCurrency, activeCurrency, CURRENCY_RATES } = useCurrency();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const langRef = useRef(null);
  const currencyRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard close-menu-on-route-change pattern
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    setCurrencyDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/activities', label: t.nav.activities },
    { path: '/stays', label: t.nav.stays },
    { path: '/events', label: t.nav.events },
    { path: '/heritage', label: t.nav.heritage },
  ];

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇹🇳' },
  ];

  const currencies = Object.values(CURRENCY_RATES || {});

  const currentLangObj = languages.find(l => l.code === lang) || languages[0];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav shadow-lg py-3' : 'bg-linear-to-b from-dark/90 via-dark/60 to-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo & Emblem */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-forest-light/30 border border-gold/40 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="Visit Siliana" className="h-7 w-auto object-contain" />
            </div>
            <div className="whitespace-nowrap">
              <span className="font-display text-xl text-cream font-bold tracking-tight block leading-none">
                Visit <span className="text-gold italic font-normal">Siliana</span>
              </span>
              <span className="text-[10px] text-cream/70 uppercase tracking-widest block mt-0.5 font-medium">
                Tunisie — Portail Officiel
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — whitespace-nowrap enforced */}
          <nav className="hidden xl:flex items-center gap-1.5 bg-dark/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 relative ${
                  isActive(link.path)
                    ? 'text-gold bg-gold/15'
                    : 'text-cream/80 hover:text-cream hover:bg-white/10'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions: Language Switcher, Currency Switcher & Book CTA */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-cream/90 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all cursor-pointer whitespace-nowrap"
                aria-label="Sélectionner la langue"
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="font-bold text-[11px]">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDownIcon className="w-3 h-3 text-gold" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-dark-muted border border-gold/30 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                        lang === l.code ? 'text-gold font-bold bg-white/5' : 'text-cream/80'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Dropdown */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-cream/90 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all cursor-pointer whitespace-nowrap"
                aria-label="Sélectionner la devise"
              >
                <span className="text-sm">{activeCurrency.flag}</span>
                <span className="font-bold text-[11px]">{activeCurrency.code}</span>
                <ChevronDownIcon className="w-3 h-3 text-gold" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-dark-muted border border-gold/30 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setCurrencyDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                        currency === c.code ? 'text-gold font-bold bg-white/5' : 'text-cream/80'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.code} ({c.symbol})</span>
                      </span>
                      <span className="text-gold/80 text-[10px] font-mono">{c.rate === 1 ? 'Base' : `×${c.rate}`}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book Now Button */}
            <Link to="/activities" className="btn-gold text-xs px-4 py-2 whitespace-nowrap">
              <SparklesIcon className="w-3.5 h-3.5 text-dark" />
              {t.nav.bookNow}
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-cream hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 xl:hidden bg-dark/95 backdrop-blur-xl pt-24 px-6 pb-8 flex flex-col justify-between animate-fadeIn">
          <div className="flex flex-col gap-3">
            {/* Mobile Language Selector */}
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl mb-2 border border-white/10">
              <span className="text-xs text-gold uppercase tracking-widest font-semibold">Langue:</span>
              <div className="flex gap-2">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      lang === l.code ? 'bg-gold text-dark' : 'bg-white/10 text-cream'
                    }`}
                  >
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Currency Selector */}
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl mb-3 border border-white/10">
              <span className="text-xs text-gold uppercase tracking-widest font-semibold">Devise:</span>
              <div className="flex gap-2">
                {currencies.map(c => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      currency === c.code ? 'bg-gold text-dark' : 'bg-white/10 text-cream'
                    }`}
                  >
                    {c.flag} {c.code}
                  </button>
                ))}
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center justify-between p-4 rounded-xl text-base font-semibold whitespace-nowrap transition-all ${
                  isActive(link.path)
                    ? 'bg-forest/50 text-gold border border-gold/30'
                    : 'text-cream/90 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRightIcon className="w-5 h-5 opacity-60" />
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
            <Link to="/activities" className="btn-gold text-center py-3.5 w-full justify-center text-sm font-bold">
              {t.nav.bookNow}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;