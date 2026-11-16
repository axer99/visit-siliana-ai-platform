import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStayById } from "../services/api";
import { useLanguage } from '../context/useLanguage';
import { useCurrency } from '../context/useCurrency';
import staysImg from '../assets/site-images/category-stays.avif';
import heritageImg from '../assets/site-images/category-heritage.jpg';
import { 
  MapPinIcon, 
  UsersIcon
} from '../components/common/Icons';

function imageForStay(s) {
  if (s.image_url) return s.image_url;
  const t = ((s.type || '') + (s.title || '')).toLowerCase();
  if (t.includes('kesra')) return staysImg;
  return heritageImg;
}

function StaysDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStayById(id)
      .then((data) => setStay(data))
      .catch((err) => setError(err.message || 'Stay not found'))
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

  if (error || !stay) {
    return (
      <div className="bg-cream min-h-screen pt-32 pb-20 px-6 text-center">
        <h2 className="text-3xl font-display text-dark mb-4">Hébergement non disponible</h2>
        <Link to="/stays" className="btn-primary text-xs px-6 py-2.5">
          Retour aux hébergements
        </Link>
      </div>
    );
  }

  const stayImage = imageForStay(stay);

  return (
    <div className="bg-cream min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-dark/60 mb-6 font-medium">
          <Link to="/" className="hover:text-forest">{t.nav.home}</Link>
          <span>/</span>
          <Link to="/stays" className="hover:text-forest">{t.nav.stays}</Link>
          <span>/</span>
          <span className="text-dark font-bold">{stay.title}</span>
        </div>

        <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl mb-10 bg-dark">
          <img
            src={stayImage}
            alt={stay.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-dark/80 via-dark/20 to-transparent" />
          <div className="absolute top-6 left-6">
            <span className="badge-gold backdrop-blur-md bg-dark/70 text-gold border-gold/40">
              {stay.type || "Maison d'Hôtes"}
            </span>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-gold text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPinIcon className="w-4 h-4 text-gold" />
                {stay.location || 'Siliana, Tunisie'}
              </span>
              <h1 className="text-cream text-3xl md:text-5xl font-light leading-tight">
                {stay.title}
              </h1>
            </div>

            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl text-dark shrink-0">
              <span className="text-xs text-dark/60 block font-medium">Tarif par nuit</span>
              <span className="text-2xl font-bold text-forest">{formatPrice(stay.price_per_night)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-dark/10 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-dark/10 mb-6 text-sm text-dark/70">
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4 text-forest" />
                  <span>Capacité : <strong>Jusqu'à {stay.capacity || 4} personnes</strong></span>
                </div>
              </div>

              <h3 className="font-display text-2xl text-dark mb-4">À Propos de ce Logement</h3>
              <p className="font-body text-dark/80 leading-relaxed text-base mb-8">
                {stay.description || 'Description non renseignée.'}
              </p>
            </div>
          </div>

          <div>
            <div className="bg-dark text-cream rounded-2xl p-8 border border-gold/40 shadow-xl sticky top-28">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs text-gold uppercase tracking-wider block">Nuitée</span>
                  <span className="text-3xl font-bold text-cream">{formatPrice(stay.price_per_night)}</span>
                </div>
              </div>

              <Link
                to={`/booking/stay/${stay.id}`}
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

export default StaysDetail;