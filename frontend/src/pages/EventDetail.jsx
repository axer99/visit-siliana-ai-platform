import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById } from "../services/api";
import { useLanguage } from '../context/useLanguage';
import eventsImg from '../assets/site-images/category-events.avif';
import { 
  CalendarIcon, 
  MapPinIcon
} from '../components/common/Icons';

function imageForEvent(e) {
  if (e.image_url) return e.image_url;
  return eventsImg;
}

function EventDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEventById(id)
      .then((data) => setEvent(data))
      .catch((err) => setError(err.message || 'Event not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen pt-32 pb-20 px-6 text-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-dark/70 text-sm">{t.common.loading}</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-cream min-h-screen pt-32 pb-20 px-6 text-center">
        <h2 className="text-3xl font-display text-dark mb-4">Événement non disponible</h2>
        <Link to="/events" className="btn-primary text-xs px-6 py-2.5">
          Retour à l'agenda
        </Link>
      </div>
    );
  }

  const eventImage = imageForEvent(event);

  return (
    <div className="bg-cream min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-dark/60 mb-6 font-medium">
          <Link to="/" className="hover:text-forest">{t.nav.home}</Link>
          <span>/</span>
          <Link to="/events" className="hover:text-forest">{t.nav.events}</Link>
          <span>/</span>
          <span className="text-dark font-bold">{event.title}</span>
        </div>

        <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl mb-10 bg-dark">
          <img
            src={eventImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
          <div className="absolute top-6 left-6">
            <span className="badge-gold backdrop-blur-md bg-dark/70 text-gold border-gold/40">
              {event.type || 'Événement'}
            </span>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <MapPinIcon className="w-4 h-4 text-gold" />
                {event.location || 'Siliana'}
              </span>
              <h1 className="text-cream text-3xl md:text-5xl font-light leading-tight">
                {event.title}
              </h1>
            </div>

            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl text-dark shrink-0">
              <span className="text-xs text-dark/60 block font-medium">Tarif</span>
              <span className="text-2xl font-bold text-forest">{event.price ? `${event.price} TND` : 'Entrée libre'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-dark/10 shadow-sm">
              <div className="flex items-center gap-3 text-forest font-bold text-base pb-6 border-b border-dark/10 mb-6">
                <CalendarIcon className="w-5 h-5" />
                <span>Date : {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'Non précisée'}</span>
              </div>

              <h3 className="font-display text-2xl text-dark mb-4">Programme de l'Événement</h3>
              <p className="font-body text-dark/80 leading-relaxed text-base mb-8">
                {event.description || 'Pas de description fournie.'}
              </p>
            </div>
          </div>

          <div>
            <div className="bg-dark text-cream rounded-2xl p-8 border border-gold/40 shadow-xl sticky top-28">
              <div className="mb-6 pb-4 border-b border-white/10">
                <span className="text-xs text-gold uppercase tracking-wider block mb-1">Accès</span>
                <span className="text-2xl font-bold text-cream">{event.price ? `${event.price} TND` : 'Entrée libre'}</span>
              </div>

              <Link
                to={`/booking/event/${event.id}`}
                className="btn-gold w-full text-center py-4 justify-center text-sm font-bold shadow-lg"
              >
                {t.common.bookThis}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;