import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/api";
import { useLanguage } from '../context/useLanguage';
import SkeletonCard from "../components/common/SkeletonCard";
import EmptyState from "../components/common/EmptyState";
import eventsImg from '../assets/site-images/category-events.avif';
import heritageImg from '../assets/site-images/category-heritage.jpg';
import gastronomyImg from '../assets/site-images/category-gastronomy.avif';
import { 
  CalendarIcon, 
  MapPinIcon,
  ChevronRightIcon,
  SparklesIcon
} from "../components/common/Icons";

function imageForEvent(e) {
  if (e.image_url) return e.image_url;
  const t = ((e.title || '') + (e.category || '')).toLowerCase();
  if (t.includes('makthar') || t.includes('patrimoine')) return heritageImg;
  if (t.includes('olive') || t.includes('figue')) return gastronomyImg;
  return eventsImg;
}

function Events() {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiveEvents = () => {
    setLoading(true);
    setError(null);
    getEvents()
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError(err.message || 'Error loading events');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
    fetchLiveEvents();
  }, []);

  return (
    <div className="bg-cream min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-2">
              <SparklesIcon className="w-4 h-4 text-gold" />
              Agenda Culturel &amp; Saisonnier
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-dark font-light mb-3">
              {t.nav.events}
            </h1>
            <p className="font-body text-dark/70 text-base md:text-lg max-w-2xl leading-relaxed">
              Festivals de récolte, visites archéologiques aux flambeaux et compétitions de trail en montagne.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 bg-forest/10 border border-forest/20 text-forest text-xs font-bold px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
              {events.length} grand{events.length > 1 ? 's' : ''} rendez-vous
            </span>
          </div>
        </div>

        {/* Loading State with Shimmer Skeleton */}
        {loading && <SkeletonCard count={3} />}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white rounded-3xl p-12 text-center border border-red-200 my-8 max-w-md mx-auto shadow-sm">
            <p className="text-red-600 font-semibold mb-4">Erreur lors du chargement : {error}</p>
            <button onClick={fetchLiveEvents} className="btn-primary text-xs px-6 py-2.5">
              {t.common.retry}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <EmptyState
            title="Aucun événement à venir"
            message="Le calendrier des festivités est en cours d'actualisation par la délégation régionale du tourisme."
            onReset={fetchLiveEvents}
            resetLabel="Rafraîchir l'agenda"
          />
        )}

        {/* Grid of Events */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((e) => (
              <div key={e.id} className="card group flex flex-col bg-white h-full rounded-2xl overflow-hidden border border-black/5 hover:border-gold/40 shadow-sm hover:shadow-xl transition-all duration-300">
                <Link to={`/events/${e.id}`} className="relative h-60 overflow-hidden bg-forest block">
                  <img
                    src={imageForEvent(e)}
                    alt={e.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-dark/70 via-transparent to-transparent" />
                  
                  <span className="absolute top-4 left-4 badge-gold backdrop-blur-md bg-dark/75 text-gold border-gold/40 text-xs">
                    {e.type || 'Événement'}
                  </span>

                  {e.location && (
                    <span className="absolute bottom-3 left-4 text-cream/90 text-xs flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-medium">
                      <MapPinIcon className="w-3.5 h-3.5 text-gold" />
                      {e.location}
                    </span>
                  )}
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-forest font-bold mb-2.5">
                    <CalendarIcon className="w-4 h-4 text-gold" />
                    <span>{e.event_date ? new Date(e.event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Prochainement'}</span>
                  </div>

                  <Link to={`/events/${e.id}`}>
                    <h3 className="font-display text-xl text-dark font-light mb-2.5 group-hover:text-forest transition-colors leading-snug">
                      {e.title}
                    </h3>
                  </Link>

                  <p className="font-body text-sm text-dark/70 flex-1 mb-6 leading-relaxed line-clamp-3">
                    {e.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-dark/10 mt-auto">
                    <Link
                      to={`/events/${e.id}`}
                      className="font-body text-xs text-forest font-bold hover:underline flex items-center gap-1"
                    >
                      {t.common.viewDetails} <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/booking/event/${e.id}`}
                      className="btn-primary text-xs px-5 py-2.5"
                    >
                      Participer / Réserver
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

export default Events;