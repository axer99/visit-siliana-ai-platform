import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/useCurrency';
import { 
  SparklesIcon, 
  CompassIcon, 
  UsersIcon, 
  CalendarIcon, 
  ChevronRightIcon,
  CheckIcon
} from './Icons';

export default function AITripEstimator() {
  const { formatPrice } = useCurrency();
  const [days, setDays] = useState(2); // 1, 2, 5
  const [people, setPeople] = useState(2); // 1, 2, 4, 6
  const [theme, setTheme] = useState('adventure'); // 'adventure', 'relaxation', 'heritage'

  // Pricing models in TND
  const rates = {
    adventure: {
      activityPrice: 55, // Spéléo / Escalade
      stayPrice: 95, // Dar Kesra / Gîte
      title: "Expédition Aventure & Spéléologie",
      activityName: "Spéléologie Grotte de la Mine & Escalade Bargou",
      stayName: "Dar Kesra Perché (Maison d'Hôtes)",
      badge: "Sensations Fortes"
    },
    relaxation: {
      activityPrice: 35, // Gastronomie & cascades
      stayPrice: 130, // Éco-lodge Serj
      title: "Retraite Nature & Bien-Être",
      activityName: "Atelier Terroir Kesra & Balade des Sources",
      stayName: "Éco-Lodge Bioclimatique Serj & Bargou",
      badge: "Sérénité & Gastronomie"
    },
    heritage: {
      activityPrice: 30, // Visite Makthar + Mégalithes
      stayPrice: 85, // Domaine archéologique
      title: "Sur les Pas des Rois Numides",
      activityName: "Circuit Mactaris Antique & Mégalithes de Kesra",
      stayName: "Domaine Archéologique de Makthar",
      badge: "Histoire & Culture"
    }
  };

  const selectedRate = rates[theme];
  const activitiesTotal = selectedRate.activityPrice * people * (days > 1 ? 2 : 1);
  const stayNights = Math.max(0, days - 1);
  const stayTotal = (selectedRate.stayPrice * stayNights * Math.ceil(people / 2));
  const estimatedTotal = activitiesTotal + stayTotal;
  const perPerson = Math.round(estimatedTotal / people);

  const openConciergeWithTrip = () => {
    const prompt = `Je prévois un voyage à Siliana pour ${people} personne(s) durant ${days} jour(s) orienté « ${selectedRate.title} ». Mon budget estimé est d'environ ${estimatedTotal} TND. Peux-tu me recommander l'itinéraire journalier parfait et les bonnes adresses ?`;
    window.dispatchEvent(new CustomEvent('open-ai-concierge', { detail: { prompt } }));
  };

  return (
    <div className="bg-white rounded-3xl border border-dark/10 shadow-xl overflow-hidden p-6 md:p-10 my-16">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-gold-dark text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
            <SparklesIcon className="w-4 h-4 text-gold-dark" />
            Simulateur Intelligent
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-dark font-light mb-3">
            Estimez Votre Séjour sur-Mesure
          </h2>
          <p className="text-dark/70 text-sm md:text-base max-w-xl mx-auto">
            Ajustez la durée, le nombre de voyageurs et votre style de voyage pour calculer instantanément votre budget et obtenir le pack idéal.
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* 1. Duration */}
          <div className="bg-cream/50 rounded-2xl p-5 border border-dark/10">
            <label className="text-xs font-bold uppercase tracking-wider text-dark/70 block mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-forest" />
              1. Durée du Séjour
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '1 Jour', val: 1 },
                { label: 'Weekend (2j)', val: 2 },
                { label: '5 Jours', val: 5 },
              ].map(d => (
                <button
                  key={d.val}
                  onClick={() => setDays(d.val)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    days === d.val
                      ? 'bg-forest text-cream shadow-md'
                      : 'bg-white text-dark/80 hover:bg-white/80 border border-dark/10'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Travelers */}
          <div className="bg-cream/50 rounded-2xl p-5 border border-dark/10">
            <label className="text-xs font-bold uppercase tracking-wider text-dark/70 block mb-3 flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-forest" />
              2. Nombre de Voyageurs
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Solo', val: 1 },
                { label: 'Duo', val: 2 },
                { label: '4 Pers.', val: 4 },
                { label: '6+', val: 6 },
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => setPeople(p.val)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    people === p.val
                      ? 'bg-forest text-cream shadow-md'
                      : 'bg-white text-dark/80 hover:bg-white/80 border border-dark/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Style / Theme */}
          <div className="bg-cream/50 rounded-2xl p-5 border border-dark/10">
            <label className="text-xs font-bold uppercase tracking-wider text-dark/70 block mb-3 flex items-center gap-2">
              <CompassIcon className="w-4 h-4 text-forest" />
              3. Style d'Expérience
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Aventure', val: 'adventure' },
                { label: 'Sérénité', val: 'relaxation' },
                { label: 'Histoire', val: 'heritage' },
              ].map(t => (
                <button
                  key={t.val}
                  onClick={() => setTheme(t.val)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    theme === t.val
                      ? 'bg-forest text-cream shadow-md'
                      : 'bg-white text-dark/80 hover:bg-white/80 border border-dark/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Calculation Result Card */}
        <div className="bg-linear-to-r from-forest-dark via-forest to-dark-muted rounded-2xl p-6 md:p-8 text-cream shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <span className="badge-gold inline-block">
              {selectedRate.badge} • Formule Idéale
            </span>
            <h3 className="font-display text-2xl md:text-3xl text-cream font-light">
              {selectedRate.title}
            </h3>

            <div className="space-y-2 text-xs md:text-sm text-cream/90">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-gold shrink-0" />
                <span><strong>Activité :</strong> {selectedRate.activityName}</span>
              </div>
              {days > 1 && (
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-gold shrink-0" />
                  <span><strong>Hébergement :</strong> {selectedRate.stayName} ({days - 1} nuitée{days > 2 ? 's' : ''})</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-gold shrink-0" />
                <span>Guide local certifié &amp; petit-déjeuner du terroir inclus</span>
              </div>
            </div>
          </div>

          {/* Pricing & 1-Click Action */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-gold/30 text-center shrink-0 w-full lg:w-80">
            <span className="text-xs text-cream/70 uppercase tracking-widest block mb-1">
              Budget Global Estimé
            </span>
            <div className="text-4xl md:text-5xl font-light text-gold font-display mb-1">
              {formatPrice(estimatedTotal)}
            </div>
            <span className="text-xs text-cream/60 block mb-6">
              soit environ {formatPrice(perPerson)} / personne
            </span>

            <div className="flex flex-col gap-2.5">
              <Link
                to="/activities"
                className="btn-gold text-xs py-3 w-full justify-center shadow-lg"
              >
                Explorer ces Offres <ChevronRightIcon className="w-4 h-4 text-dark" />
              </Link>
              <button
                type="button"
                onClick={openConciergeWithTrip}
                className="bg-white/10 hover:bg-white/20 text-cream border border-white/20 text-xs py-2.5 px-4 rounded-full transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <SparklesIcon className="w-3.5 h-3.5 text-gold" />
                Personnaliser avec l'IA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
