import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { createBooking, getActivityById, getStayById, getEventById } from "../services/api";
import { useCurrency } from "../context/useCurrency";
import { 
  CheckCircleIcon, 
  SparklesIcon, 
  ShieldIcon
} from "../components/common/Icons";

const itemPricingDefaults = {
  activity: 65,
  stay: 140,
  event: 35
};

function Booking() {
  const { type, id } = useParams(); // type: 'activity', 'stay', or 'event'
  const { formatPrice } = useCurrency();

  const [itemDetails, setItemDetails] = useState(null);
  const [formData, setFormData] = useState({
    [`${type}_id`]: Number(id),
    full_name: '',
    email: '',
    phone: '',
    people_count: 1,
    booking_date: new Date().toISOString().split('T')[0],
    special_requests: ''
  });

  const [status, setStatus] = useState(null); // 'success', 'error'
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const unitPrice = itemDetails?.price || itemDetails?.price_per_night || itemPricingDefaults[type] || 50;
  const totalPrice = unitPrice * (formData.people_count || 1);

  useEffect(() => {
    let fetcher = null;
    if (type === 'activity') fetcher = getActivityById(id);
    else if (type === 'stay') fetcher = getStayById(id);
    else if (type === 'event') fetcher = getEventById(id);

    if (fetcher) {
      fetcher
        .then((data) => setItemDetails(data))
        .catch(() => {
          // Fallback title
          setItemDetails({
            title: `Réservation ${type === 'activity' ? 'Activité' : type === 'stay' ? 'Hébergement' : 'Événement'} #${id}`,
            price: itemPricingDefaults[type]
          });
        });
    }
  }, [type, id]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function adjustPeople(delta) {
    const next = Math.max(1, (formData.people_count || 1) + delta);
    setFormData({ ...formData, people_count: next });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const bookingPayload = {
      ...formData,
      total_price: totalPrice,
    };

    try {
      const result = await createBooking(bookingPayload);
      setConfirmedBooking(result);
      setStatus("success");
    } catch (err) {
      console.error("Booking failed:", err);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  // Success Confirmation Receipt View
  if (status === "success") {
    const bookingRef = `SIL-${confirmedBooking.id}`;

    return (
      <div className="bg-cream min-h-screen pt-32 pb-24 px-6 flex justify-center items-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 max-w-xl w-full border border-gold/40 shadow-2xl text-center relative overflow-hidden animate-fadeIn">
          <div className="w-20 h-20 bg-forest/10 border-2 border-forest rounded-full flex items-center justify-center text-forest mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10" />
          </div>

          <span className="badge-gold mb-3 inline-block">Confirmation de Réservation</span>
          <h1 className="font-display text-3xl md:text-4xl text-dark mb-2">
            Réservation Confirmée !
          </h1>
          <p className="text-dark/70 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Merci <strong>{formData.full_name}</strong>. Votre demande de réservation a été enregistrée avec succès. Un SMS et un email de confirmation vous ont été envoyés.
          </p>

          {/* Ticket Receipt Box */}
          <div className="bg-cream-dark rounded-2xl p-6 mb-8 text-left space-y-3 border border-dark/10">
            <div className="flex justify-between text-xs text-dark/60 pb-3 border-b border-dark/10">
              <span>Code de Référence:</span>
              <strong className="text-dark font-mono">{bookingRef}</strong>
            </div>

            <div className="flex justify-between text-sm text-dark font-medium">
              <span>Réservation:</span>
              <span className="text-forest font-bold">{itemDetails?.title || `Visite ${type}`}</span>
            </div>

            <div className="flex justify-between text-xs text-dark/70">
              <span>Date sélectionnée:</span>
              <span>{formData.booking_date}</span>
            </div>

            <div className="flex justify-between text-xs text-dark/70">
              <span>Nombre de personnes:</span>
              <span>{formData.people_count} personne(s)</span>
            </div>

            <div className="flex justify-between text-base font-bold text-dark pt-3 border-t border-dark/10">
              <span>Montant Total:</span>
              <span className="text-forest">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.print()}
              className="btn-outline text-dark border-dark/30 hover:bg-dark/5 text-xs py-3.5 flex-1 justify-center"
            >
              Imprimer le Reçu
            </button>
            <Link to="/" className="btn-primary text-xs py-3.5 flex-1 justify-center">
              Retour à l'Accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full bg-cream border border-dark/15 rounded-xl px-4 py-3.5 text-sm text-dark placeholder-dark/40 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest transition-colors";

  return (
    <div className="bg-cream min-h-screen pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge-gold mb-3 inline-block">Étape Finale</span>
          <h1 className="font-display text-4xl md:text-5xl text-dark font-light mb-3">
            Finalisez Votre Réservation
          </h1>
          <p className="text-dark/70 text-sm">
            Remplissez vos coordonnées pour garantir votre place à Siliana.
          </p>
        </div>

        {status === "error" && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-4 text-center">
            Une erreur est survenue lors de la réservation. Veuillez vérifier votre connexion et réessayer.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Summary Card */}
          <div className="lg:col-span-5 bg-dark text-cream rounded-3xl p-8 border border-gold/40 shadow-xl">
            <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-4">
              <SparklesIcon className="w-4 h-4 text-gold" />
              Récapitulatif
            </div>

            <h3 className="font-display text-2xl text-cream font-light mb-2">
              {itemDetails?.title || `Expérience à Siliana`}
            </h3>

            <p className="text-cream/70 text-xs mb-6">
              Gouvernorat de Siliana, Tunisie
            </p>

            <div className="space-y-4 py-6 border-y border-white/10 text-sm">
              <div className="flex justify-between items-center text-cream/80">
                <span>Tarif unitaire</span>
                <span className="font-semibold text-cream">{formatPrice(unitPrice)}</span>
              </div>

              <div className="flex justify-between items-center text-cream/80">
                <span>Nombre de participants</span>
                <div className="flex items-center gap-3 bg-white/10 px-3 py-1 rounded-full">
                  <button
                    type="button"
                    onClick={() => adjustPeople(-1)}
                    className="text-gold font-bold text-base hover:text-cream px-1"
                  >
                    -
                  </button>
                  <span className="font-bold text-cream">{formData.people_count}</span>
                  <button
                    type="button"
                    onClick={() => adjustPeople(1)}
                    className="text-gold font-bold text-base hover:text-cream px-1"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-cream/80">
                <span>Date de l'excursion</span>
                <span className="font-semibold text-cream">{formData.booking_date}</span>
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center">
              <div>
                <span className="text-xs text-cream/60 block">Total estimé</span>
                <span className="text-3xl font-bold text-gold">{formatPrice(totalPrice)}</span>
              </div>
              <span className="text-[11px] text-cream/50">Paiement sur place</span>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-dark/10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2">
                  Nom &amp; Prénom <span className="text-gold">*</span>
                </label>
                <input
                  name="full_name"
                  type="text"
                  placeholder="Ex: Mohamed Ben Ali"
                  autoComplete="name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2">
                    Adresse Email <span className="text-gold">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="exemple@email.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2">
                    Téléphone (Tunisie) <span className="text-gold">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+216 -- --- ---"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2">
                    Date Souhaitée <span className="text-gold">*</span>
                  </label>
                  <input
                    name="booking_date"
                    type="date"
                    value={formData.booking_date}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2">
                    Nombre de Personnes <span className="text-gold">*</span>
                  </label>
                  <input
                    name="people_count"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.people_count}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark uppercase tracking-wider mb-2">
                  Demandes Spéciales ou Remarques
                </label>
                <textarea
                  name="special_requests"
                  rows="3"
                  placeholder="Régime alimentaire, besoin de matériel spécifique, etc..."
                  value={formData.special_requests}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full py-4 text-center justify-center text-sm font-bold shadow-lg disabled:opacity-50 mt-4"
              >
                {submitting ? "Traitement de votre réservation..." : "Confirmer La Réservation"}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-dark/50 pt-2">
                <ShieldIcon className="w-4 h-4 text-forest" />
                <span>Vos informations sont sécurisées &amp; protégées.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;