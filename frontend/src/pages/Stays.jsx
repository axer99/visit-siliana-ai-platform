import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStays } from "../services/api";
import { useLanguage } from '../context/useLanguage';
import { useCurrency } from '../context/useCurrency';
import SkeletonCard from "../components/common/SkeletonCard";
import EmptyState from "../components/common/EmptyState";
import staysImg from '../assets/site-images/category-stays.avif';
import heritageImg from '../assets/site-images/category-heritage.jpg';
import gastronomyImg from '../assets/site-images/category-gastronomy.avif';
import { 
  UsersIcon, 
  ChevronRightIcon, 
  SearchIcon,
  SparklesIcon
} from "../components/common/Icons";

function imageForStay(s) {
  if (s.image_url) return s.image_url;
  const t = ((s.type || '') + (s.title || '')).toLowerCase();
  if (t.includes('kesra')) return staysImg;
  if (t.includes('makthar')) return heritageImg;
  return gastronomyImg;
}

const STAY_TAGS = [
  { id: 'all', label: 'Tous les Hébergements' },
  { id: 'traditional house', label: '🏡 Maisons d\'Hôtes de Kesra' },
  { id: 'eco-lodge', label: '🌿 Éco-Lodges Bioclimatiques' },
  { id: 'guesthouse', label: '🌾 Gîtes Ruraux & Vergers' },
  { id: 'camping', label: '⛺ Campements Nomades' },
];

function Stays() {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [stays, setStays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const fetchLiveStays = () => {
    setLoading(true);
    setError(null);
    getStays()
      .then((data) => {
        setStays(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching stays:", err);
        setError(err.message || 'Error loading stays');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    fetchLiveStays();
  }, []);

  const filtered = stays.filter((s) => {
    const text = `${s.title || ''} ${s.description || ''} ${s.type || ''} ${s.location || ''}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    
    const matchesType = 
      selectedType === 'all' || 
      (s.type || '').toLowerCase().includes(selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-cream min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Header with live count badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-2">
              <SparklesIcon className="w-4 h-4 text-gold" />
              Séjours &amp; Hospitalité
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-dark font-light mb-3">
              {t.nav.stays}
            </h1>
            <p className="font-body text-dark/70 text-base md:text-lg max-w-2xl leading-relaxed">
              Maisons d'hôtes perchées à Kesra, éco-lodges solaires face au Djebel Bargou et gîtes agrotouristiques au cœur des oliveraies.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 bg-forest/10 border border-forest/20 text-forest text-xs font-bold px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              {filtered.length} hébergement{filtered.length > 1 ? 's' : ''} d'exception
            </span>
          </div>
        </div>

        {/* Quick Category Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {STAY_TAGS.map((tag) => {
            const isTagActive = selectedType === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => setSelectedType(tag.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isTagActive
                    ? 'bg-forest text-cream shadow-md border border-gold/40'
                    : 'bg-white text-dark/75 hover:bg-cream-dark hover:text-dark border border-dark/10'
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-dark/10 mb-12">
          <div className="relative">
            <SearchIcon className="w-5 h-5 text-dark/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par village, nom de gîte, confort (ex: Kesra, Bargou, Makthar)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-cream rounded-xl pl-12 pr-4 py-3 text-sm text-dark placeholder-dark/40 focus:outline-none focus:ring-2 focus:ring-forest/30 border border-dark/10"
            />
          </div>
        </div>

        {/* Loading State with Shimmer Skeleton Cards */}
        {loading && <SkeletonCard count={6} />}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-3xl p-12 text-center border border-red-200 my-8 max-w-md mx-auto shadow-sm">
            <p className="text-red-600 font-semibold mb-4">Erreur lors du chargement : {error}</p>
            <button onClick={fetchLiveStays} className="btn-primary text-xs px-6 py-2.5">
              {t.common.retry}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="Aucun hébergement trouvé"
            message="Aucun gîte ou maison d'hôtes ne correspond à vos filtres actuels. Réinitialisez la recherche pour voir toutes les adresses de charme de Siliana."
            onReset={() => {
              setSearchTerm('');
              setSelectedType('all');
            }}
          />
        )}

        {/* Stays Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((s) => (
              <div key={s.id} className="card group flex flex-col bg-white h-full rounded-2xl overflow-hidden border border-black/5 hover:border-gold/40 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative h-60 overflow-hidden bg-forest">
                  <img
                    src={imageForStay(s)}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-dark/70 via-transparent to-transparent" />
                  
                  <span className="absolute top-4 left-4 badge-gold backdrop-blur-md bg-dark/75 text-gold border-gold/40 text-xs">
                    {s.type || "Hébergement"}
                  </span>
                  
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-dark font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-dark/10">
                    {formatPrice(s.price_per_night)} / nuit
                  </div>

                  <div className="absolute bottom-3 left-4 text-cream/90 text-xs flex items-center gap-1.5 font-medium drop-shadow-md">
                    <UsersIcon className="w-3.5 h-3.5 text-gold" />
                    <span>Capacité : jusqu'à {s.capacity || 4} personnes</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl text-dark font-light mb-2.5 group-hover:text-forest transition-colors leading-snug">
                    {s.title}
                  </h3>

                  <p className="font-body text-sm text-dark/70 flex-1 mb-6 leading-relaxed line-clamp-3">
                    {s.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-dark/10 mt-auto">
                    <Link
                      to={`/stays/${s.id}`}
                      className="font-body text-xs text-forest font-bold hover:underline flex items-center gap-1"
                    >
                      {t.common.viewDetails} <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/booking/stay/${s.id}`}
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

export default Stays;