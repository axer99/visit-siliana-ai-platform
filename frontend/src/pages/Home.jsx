import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getActivities } from '../services/api';
import { useLanguage } from '../context/useLanguage';
import { useCurrency } from '../context/useCurrency';
import LiveWeatherBarometer from '../components/common/LiveWeatherBarometer';
import RegionalExplorer3D from '../components/common/RegionalExplorer3D';
import AITripEstimator from '../components/common/AITripEstimator';
import heroImage from '../assets/site-images/hero-ziplining.jpg';
import hikingImg from '../assets/site-images/activity-hiking.avif';

import { 
  CompassIcon, 
  MountainIcon, 
  MapPinIcon, 
  SearchIcon, 
  ChevronRightIcon,
  SunIcon,
  LandmarkIcon,
  CalendarIcon,
  CoffeeIcon,
  ShieldIcon,
  ClockIcon
} from '../components/common/Icons';

function Home() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  useEffect(() => {
    getActivities()
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const travelTips = [
    {
      icon: CalendarIcon,
      title: 'Meilleure Saison',
      desc: "Le printemps (Mars à Mai) et l'automne (Septembre à Novembre) offrent des températures idéales pour la randonnée, la spéléologie et la récolte des figues de Kesra."
    },
    {
      icon: MapPinIcon,
      title: 'Accès & Transport',
      desc: "Situé à 120km au sud-ouest de Tunis (1h30 via la route nationale RN4). Des bus régionaux et louages desservent Siliana, Kesra et Makthar régulièrement."
    },
    {
      icon: CoffeeIcon,
      title: 'Gastronomie & Terroir',
      desc: "Dégustez la confiture de figues AOP de Kesra, l'huile d'olive de montagne pressée à froid, le miel sauvage et le pain Tabouna cuit au feu de bois."
    },
    {
      icon: ShieldIcon,
      title: 'Charte Éco-Responsable',
      desc: "Respectez les sentiers balisés, préservez la quiétude du Parc National de Jebel Serj et favorisez l'économie locale et les guides certifiés."
    }
  ];

  return (
    <div className="bg-cream min-h-screen">
      {/* 1. Hero Section with Luxury Glassmorphism & Full Viewport Coverage */}
      <section id="hero" aria-label="Accueil Visit Siliana" className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-forest transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-dark via-dark/70 to-dark/40" />
        {/* Soft bottom vignette to guarantee zero white line artifact */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-cream to-transparent pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto w-full text-center md:text-left pt-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/50 text-gold text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md shadow-xl">
              <span className="w-2 h-2 rounded-full bg-gold inline-block animate-ping" />
              {t.hero.tag}
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Concierge IA Multi-Agents Actif
            </div>
          </div>

          <h1 className="text-cream text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.04] mb-6 max-w-4xl tracking-tight">
            {t.hero.title1} <br />
            <em className="italic font-normal text-gold underline decoration-gold/30 underline-offset-8">
              {t.hero.title2}
            </em>
          </h1>

          <p className="text-cream/90 text-lg md:text-2xl max-w-2xl mb-10 leading-relaxed font-light">
            {t.hero.subtitle}
          </p>

          {/* Quick Search Overlay */}
          <div className="glass-panel-dark rounded-2xl md:rounded-full p-3 border border-gold/40 max-w-4xl mb-10 shadow-2xl">
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                navigate(`/activities?search=${encodeURIComponent(searchLocation || searchCategory)}`); 
              }}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
            >
              <div className="md:col-span-5 flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-white/10">
                <MapPinIcon className="w-5 h-5 text-gold shrink-0" />
                <input
                  type="text"
                  placeholder={t.hero.searchPlace}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="bg-transparent text-cream placeholder-cream/50 text-sm focus:outline-none w-full"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-3 px-4 py-2 border-b md:border-b-0 md:border-r border-white/10">
                <CompassIcon className="w-5 h-5 text-gold shrink-0" />
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-transparent text-cream/90 text-sm focus:outline-none w-full cursor-pointer [&>option]:bg-dark [&>option]:text-cream"
                >
                  <option value="">{t.hero.searchCat}</option>
                  <option value="hiking">Randonnée &amp; Trekking</option>
                  <option value="caving">Spéléologie (Grotte de la Mine)</option>
                  <option value="climbing">Escalade (Bargou)</option>
                  <option value="heritage">Patrimoine Numido-Romain</option>
                  <option value="camping">Camping &amp; Bivouac</option>
                  <option value="gastronomy">Gastronomie &amp; Terroir</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <button type="submit" className="btn-gold w-full text-xs py-3.5 justify-center shadow-lg cursor-pointer">
                  <SearchIcon className="w-4 h-4 text-dark" />
                  {t.hero.btnSearch}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full text-xs text-cream">
              <MountainIcon className="w-4 h-4 text-gold" />
              <span>{t.hero.stat1}</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full text-xs text-cream">
              <LandmarkIcon className="w-4 h-4 text-gold" />
              <span>{t.hero.stat2}</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full text-xs text-cream">
              <SunIcon className="w-4 h-4 text-gold" />
              <span>{t.hero.stat3}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Live Weather & Mountain Safety Barometer */}
      <section id="weather-safety" aria-label="Météo et Sécurité Montagne" className="w-full py-12 md:py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <LiveWeatherBarometer />
        </div>
      </section>

      {/* 3. Interactive Regional Explorer (4 Trésors de Siliana) */}
      <RegionalExplorer3D />

      {/* 4. Featured Live Experiences from Real Database */}
      <section id="featured-activities" aria-label="Activités et Expériences à Siliana" className="w-full py-20 bg-white border-y border-dark/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-2">
                {t.sections.featuredTag}
              </span>
              <h2 className="text-dark text-4xl md:text-5xl font-light">
                {t.sections.featuredTitle}
              </h2>
            </div>
            <Link to="/activities" className="mt-4 md:mt-0 text-forest font-semibold hover:underline flex items-center gap-1 text-sm">
              Voir les {activities.length} expériences <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-dark/60 text-sm">{t.common.loading}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.slice(0, 6).map((item) => (
                <div key={item.id} className="card group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-dark/10 shadow-sm hover:shadow-xl hover:border-gold/40 transition-all duration-300">
                  <div className="relative h-60 overflow-hidden bg-forest">
                    <img
                      src={item.image_url || hikingImg}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-dark/70 via-transparent to-transparent" />
                    
                    <span className="absolute top-4 left-4 badge-gold backdrop-blur-md bg-dark/70 text-gold border-gold/40 text-xs">
                      {item.difficulty || item.type || 'Aventure'}
                    </span>
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-dark font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-dark/10">
                      {formatPrice(item.price)}
                    </div>

                    {item.duration_hours && (
                      <div className="absolute bottom-3 left-4 text-cream/90 text-xs flex items-center gap-1.5 font-medium drop-shadow-md">
                        <ClockIcon className="w-3.5 h-3.5 text-gold" />
                        <span>{item.duration_hours}h d'activité</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-dark text-xl font-light mb-2.5 group-hover:text-forest transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-dark/70 text-sm leading-relaxed flex-1 mb-6 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-dark/10 mt-auto">
                      <Link to={`/activities/${item.id}`} className="text-xs text-forest font-bold hover:underline flex items-center gap-1">
                        {t.common.viewDetails} <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                      <Link to={`/booking/activity/${item.id}`} className="btn-primary text-xs px-5 py-2.5">
                        {t.common.bookThis}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Smart AI Trip & Budget Estimator (Interactive Simulator) */}
      <section id="budget-estimator" aria-label="Simulateur de Budget et Séjour" className="w-full py-16 md:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <AITripEstimator />
        </div>
      </section>

      {/* 6. Video Showcase of Siliana */}
      <section id="heritage-showcase" aria-label="Histoire et Patrimoine de Siliana" className="w-full bg-white py-20 border-y border-dark/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-gold-dark text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
              <MapPinIcon className="w-4 h-4 text-gold-dark" />
              Siliana, Tunisie
            </div>

            <h2 className="font-display text-4xl md:text-5xl text-dark font-light leading-tight">
              Terre de Légendes, de <span className="text-forest font-semibold italic">Montagnes</span> et d'Histoire
            </h2>

            <p className="font-body text-dark/80 text-base leading-relaxed">
              Le gouvernorat de Siliana réunit un patrimoine naturel et historique unique au Maghreb. Les crêtes du Djebel Serj et Bargou abritent une faune préservée, tandis que Kesra et Mactaris offrent un voyage dans le temps au cœur des civilisations berbère et numido-romaine.
            </p>

            <div className="p-5 rounded-2xl bg-cream border border-gold/30 text-dark/90 font-medium italic text-sm">
              « Mille sources jaillissant de la falaise de Kesra et le vent pur des sommets de Bargou composent l'âme intacte de Siliana. »
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/activities" className="btn-primary text-xs px-6 py-3">
                Découvrir les Expériences
              </Link>
              <Link to="/heritage" className="btn-outline text-dark border-dark/30 hover:bg-dark/5 text-xs px-6 py-3">
                Explorer le Patrimoine
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-gold/30 aspect-video bg-dark">
              <iframe
                src="https://www.youtube.com/embed/Ii5_gicmLyQ?autoplay=0"
                title="Discover Siliana Tunisia Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Practical Travel Tips & Eco-Guide */}
      <section id="travel-guide" aria-label="Guide Pratique de l'Éco-Touriste" className="w-full bg-forest text-cream py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-2">
              Conseils de Voyage
            </span>
            <h2 className="text-cream font-display text-4xl font-light">
              Guide Pratique de l'Éco-Touriste
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <div key={index} className="bg-dark/40 border border-gold/30 rounded-2xl p-6 hover:border-gold transition-colors flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold mb-4 shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-cream font-bold text-lg mb-2">{tip.title}</h3>
                  <p className="text-cream/70 text-sm leading-relaxed flex-1">{tip.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section id="reservation-cta" aria-label="Planifiez Votre Visite" className="w-full py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-linear-to-r from-dark via-forest-dark to-dark rounded-3xl p-10 md:p-16 border border-gold/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <span className="badge-gold mb-4 inline-block">Planifiez Votre Visite</span>
              <h3 className="text-cream text-3xl md:text-5xl font-light mb-4 leading-tight">
                {t.sections.ctaTitle}
              </h3>
              <p className="text-cream/80 text-base leading-relaxed">
                {t.sections.ctaSub}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center shrink-0">
              <Link to="/activities" className="btn-gold text-sm px-8 py-4">
                {t.sections.ctaBtn1}
              </Link>
              <Link to="/stays" className="btn-outline text-sm px-8 py-4">
                {t.sections.ctaBtn2}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;