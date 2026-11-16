import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getActivities } from "../services/api";
import { useLanguage } from '../context/useLanguage';
import { useCurrency } from '../context/useCurrency';
import SkeletonCard from "../components/common/SkeletonCard";
import EmptyState from "../components/common/EmptyState";
import hikingImg from '../assets/site-images/activity-hiking.avif';
import climbingImg from '../assets/site-images/activity-climbing.avif';
import cavingImg from '../assets/site-images/activity-caving.avif';
import heritageImg from '../assets/site-images/category-heritage.jpg';
import { 
  SearchIcon, 
  FilterIcon, 
  SparklesIcon, 
  ClockIcon,
  ChevronRightIcon
} from "../components/common/Icons";

function imageFor(a) {
  if (a.image_url) return a.image_url;
  const t = ((a.difficulty || '') + (a.type || '') + (a.title || '')).toLowerCase();
  if (t.includes('caving') || t.includes('grotte') || t.includes('speleo')) return cavingImg;
  if (t.includes('climb') || t.includes('escalade') || t.includes('tyrolienne')) return climbingImg;
  if (t.includes('heritage') || t.includes('makthar') || t.includes('patrimoine')) return heritageImg;
  return hikingImg;
}

const CATEGORY_TAGS = [
  { id: 'all', label: 'Toutes les Expériences' },
  { id: 'caving', label: '🕳️ Spéléologie' },
  { id: 'climbing', label: '🧗 Escalade' },
  { id: 'hiking', label: '🥾 Randonnée & Sommets' },
  { id: 'heritage walk', label: '🏛️ Patrimoine Numide' },
  { id: 'camping', label: '⛺ Camping & Bivouac' },
  { id: 'gastronomy', label: '🍯 Terroir & Gastronomie' },
];

function Activities() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(300);

  const fetchLiveActivities = () => {
    setLoading(true);
    setError(null);
    getActivities()
      .then((data) => {
        setActivities(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching activities:", err);
        setError(err.message || 'Error fetching data');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    fetchLiveActivities();
  }, []);

  const filtered = activities.filter((a) => {
    const textToSearch = `${a.title || ''} ${a.description || ''} ${a.type || ''} ${a.location || ''}`.toLowerCase();
    const matchesSearch = textToSearch.includes(searchTerm.toLowerCase());
    
    const matchesDiff = 
      selectedDifficulty === 'all' || 
      (a.difficulty || '').toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesCategory =
      selectedCategory === 'all' ||
      (a.type || '').toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesPrice = Number(a.price || 0) <= maxPrice;

    return matchesSearch && matchesDiff && matchesCategory && matchesPrice;
  });

  return (
    <div className="bg-cream min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Title with live count badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-2">
              <SparklesIcon className="w-4 h-4 text-gold" />
              Catalogue Officiel
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-dark font-light mb-3">
              {t.nav.activities}
            </h1>
            <p className="font-body text-dark/70 text-base md:text-lg max-w-2xl leading-relaxed">
              Trekking sur les crêtes de Bargou, spéléologie à la Grotte de la Mine, escalade et découvertes historiques guidées.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 bg-forest/10 border border-forest/20 text-forest text-xs font-bold px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              {filtered.length} expérience{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Quick Category Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {CATEGORY_TAGS.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isCatActive
                    ? 'bg-forest text-cream shadow-md border border-gold/40'
                    : 'bg-white text-dark/75 hover:bg-cream-dark hover:text-dark border border-dark/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-dark/10 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <SearchIcon className="w-5 h-5 text-dark/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.nav.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-cream rounded-xl pl-12 pr-4 py-3 text-sm text-dark placeholder-dark/40 focus:outline-none focus:ring-2 focus:ring-forest/30 border border-dark/10"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="md:col-span-4 flex items-center gap-2">
              <FilterIcon className="w-4 h-4 text-dark/60 shrink-0" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-cream rounded-xl px-4 py-3 text-sm text-dark focus:outline-none border border-dark/10 cursor-pointer"
              >
                <option value="all">Toutes les difficultés</option>
                <option value="easy">Facile / Famille</option>
                <option value="moderate">Modéré</option>
                <option value="hard">Sportif / Difficile</option>
                <option value="advanced">Expert / Avancé</option>
              </select>
            </div>

            {/* Price Filter Slider */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <div className="flex justify-between text-xs text-dark/70 mb-1 font-medium">
                <span>Budget Max:</span>
                <span className="font-bold text-forest">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-forest cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Loading State with Shimmer Skeleton Cards */}
        {loading && <SkeletonCard count={6} />}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-3xl p-12 text-center border border-red-200 my-8 max-w-md mx-auto shadow-sm">
            <p className="text-red-600 font-semibold mb-4">Impossible de charger les activités : {error}</p>
            <button onClick={fetchLiveActivities} className="btn-primary text-xs px-6 py-2.5">
              {t.common.retry}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="Aucune aventure trouvée"
            message="Aucune activité ne correspond à vos filtres actuels. Réinitialisez la recherche pour découvrir toutes les offres de Siliana."
            onReset={() => {
              setSearchTerm('');
              setSelectedDifficulty('all');
              setSelectedCategory('all');
              setMaxPrice(300);
            }}
          />
        )}

        {/* Activity Cards Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((a) => (
              <div key={a.id} className="card group flex flex-col bg-white h-full rounded-2xl overflow-hidden border border-black/5 hover:border-gold/40 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-60 overflow-hidden bg-forest">
                  <img
                    src={imageFor(a)}
                    alt={a.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-dark/70 via-transparent to-transparent" />
                  
                  <span className="absolute top-4 left-4 badge-gold backdrop-blur-md bg-dark/75 text-gold border-gold/40 text-xs">
                    {a.difficulty || a.type || 'Aventure'}
                  </span>
                  
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-dark font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-dark/10">
                    {formatPrice(a.price)}
                  </div>

                  {a.duration_hours && (
                    <div className="absolute bottom-3 left-4 text-cream/90 text-xs flex items-center gap-1.5 font-medium drop-shadow-md">
                      <ClockIcon className="w-3.5 h-3.5 text-gold" />
                      <span>{a.duration_hours}h d'activité</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl text-dark font-light mb-2.5 group-hover:text-forest transition-colors leading-snug">
                    {a.title}
                  </h3>

                  <p className="font-body text-sm text-dark/70 flex-1 mb-6 leading-relaxed line-clamp-3">
                    {a.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-dark/10 mt-auto">
                    <Link
                      to={`/activities/${a.id}`}
                      className="font-body text-xs text-forest font-bold hover:underline flex items-center gap-1"
                    >
                      {t.common.viewDetails} <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/booking/activity/${a.id}`}
                      className="btn-primary text-xs px-5 py-2.5"
                    >
                      {t.common.bookThis}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Activities;