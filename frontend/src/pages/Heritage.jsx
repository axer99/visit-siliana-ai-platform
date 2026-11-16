import { Link } from 'react-router-dom';
import heritageHero from '../assets/site-images/category-heritage.jpg';
import activitiesImg from '../assets/site-images/category-activities.avif';
import gastronomyImg from '../assets/site-images/category-gastronomy.avif';
import staysImg from '../assets/site-images/category-stays.avif';
import { 
  LandmarkIcon, 
  MapPinIcon, 
  ChevronRightIcon, 
  CheckCircleIcon
} from '../components/common/Icons';

const heritageSites = [
  {
    id: 'makthar',
    title: 'Site Archéologique de Makthar (Mactaris)',
    location: 'Makthar',
    period: 'Numide, Romain & Byzantin (-IIIe au VIe siècle)',
    description: "L'un des sites les plus vastes du Nord-Ouest. Admirez l'Arc de Trajan, l'Amphithéâtre, les Grands Thermes et le Forum numido-romain remarquablement conservé.",
    highlights: ['Arc de Trajan', 'Grands Thermes du Sud', 'Schola des Juvenes', 'Musée Archéologique'],
    image: heritageHero,
    badge: 'Monument Historique'
  },
  {
    id: 'kesra',
    title: 'Kesra — Le Plus Haut Village Berbère de Tunisie',
    location: 'Kesra (1 000m d\'altitude)',
    period: 'Tradition Berbère Vivante',
    description: "Accroché à la falaise au-dessus de cascades et de sources vauclusiennes, Kesra offre une architecture en pierre sculptée, des vergers de figuiers étagés et un musée des traditions populaires.",
    highlights: ['Sources d\'eau naturelles (Aïn)', 'Musée des Arts & Traditions', 'Escaliers sculptés dans la roche', 'Forêt de pins de Kesra'],
    image: staysImg,
    badge: 'Incontournable'
  },
  {
    id: 'zama',
    title: 'La Plaine de Zama — Théâtre de la Bataille Historique',
    location: 'Région de Siliana',
    period: '202 av. J.-C. (Deuxième Guerre Punique)',
    description: "Lieu présumé du choc légendaire entre le général carthaginois Hannibal Barca et le général romain Scipion l'Africain qui scella le destin de la Méditerranée antique.",
    highlights: ['Paysages de plaines antiques', 'Panneaux explicatifs historiques', 'Sentiers de découverte'],
    image: activitiesImg,
    badge: 'Histoire Antique'
  },
  {
    id: 'terroir',
    title: 'Artisanat & Gastronomie Traditionnelle',
    location: 'À travers tout le Gouvernorat',
    period: 'Savoir-faire Ancestral',
    description: "Savourez la célèbrissime confiture de figues de Kesra, l'huile d'olive de montagne et découvrez les poteries modellées selon les méthodes numides vieilles de 3000 ans.",
    highlights: ['Huile d\'olive bio', 'Confiture de figues sèches', 'Poterie faite main', 'Tissage traditionnel'],
    image: gastronomyImg,
    badge: 'Gastronomie & Artisanat'
  }
];

const timelineEvents = [
  { year: '-300 av. J.-C.', title: 'Royaume Numide', desc: 'Fondation des premiers comptoirs et citadelles agricoles par les Numides.' },
  { year: '-202 av. J.-C.', title: 'Bataille de Zama', desc: 'Confrontation décisive entre Hannibal Barca et Scipion l\'Africain.' },
  { year: '117 apr. J.-C.', title: 'Âge d\'Or de Mactaris', desc: 'Érection des monuments impériaux romains sous le règne de Trajan et Marc Aurèle.' },
  { year: 'Aujourd\'hui', title: 'Patrimoine Éco-Responsable', desc: 'Valorisation du tourisme vert, du patrimoine immatériel et de la culture locale.' },
];

function Heritage() {


  return (
    <div className="bg-cream min-h-screen pt-24 pb-20">
      {/* Hero Banner */}
      <div className="relative py-24 px-6 overflow-hidden bg-dark text-cream mb-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${heritageHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest backdrop-blur-md">
            <LandmarkIcon className="w-4 h-4 text-gold" />
            Histoire &amp; Identité Numide
          </div>

          <h1 className="text-cream text-5xl md:text-7xl font-light leading-[1.08] mb-6 max-w-4xl">
            Un Voyage Dans le Temps<br />
            <em className="italic text-gold font-normal">À Travers les Millénaires</em>
          </h1>

          <p className="text-cream/80 text-lg md:text-xl max-w-2xl leading-relaxed mb-8">
            Des vestiges majestueux de la cité antique de Makthar au village perché de Kesra, explorez la richesse culturelle et historique de la province de Siliana.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#sites" className="btn-gold text-sm px-8 py-3.5">
              Explorer les Sites
            </a>
            <Link to="/activities" className="btn-outline text-sm px-8 py-3.5">
              Circuit Randonnée &amp; Culture
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sites Section */}
      <section id="sites" className="max-w-7xl mx-auto px-6 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-2">Trésors Culturels</span>
          <h2 className="text-dark text-4xl md:text-5xl font-light">Les Joyaux du Patrimoine</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {heritageSites.map((site) => (
            <div key={site.id} className="card group flex flex-col h-full bg-white">
              <div className="relative h-64 overflow-hidden bg-dark">
                <img
                  src={site.image}
                  alt={site.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 badge-gold backdrop-blur-md bg-dark/80 text-gold border-gold/40">
                  {site.badge}
                </span>
                <span className="absolute bottom-4 left-4 text-cream/90 text-xs flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <MapPinIcon className="w-3.5 h-3.5 text-gold" />
                  {site.location}
                </span>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">
                  {site.period}
                </div>
                <h3 className="text-dark text-2xl font-light mb-4 group-hover:text-forest transition-colors">
                  {site.title}
                </h3>
                <p className="text-dark/70 text-sm leading-relaxed mb-6 flex-1">
                  {site.description}
                </p>

                <div className="border-t border-dark/10 pt-4 mb-6">
                  <span className="text-xs font-bold text-dark uppercase tracking-wider block mb-2">Points Forts:</span>
                  <div className="flex flex-wrap gap-2">
                    {site.highlights.map((h) => (
                      <span key={h} className="text-xs bg-cream-dark text-dark/80 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-forest" />
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/booking/activity/1`}
                  className="btn-primary text-xs w-full justify-center py-3 mt-auto"
                >
                  Réserver un Guide Culturel
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Historical Timeline Section */}
      <section className="bg-forest text-cream py-24 px-6 relative overflow-hidden mb-24">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-2">Frise Chronologique</span>
            <h2 className="text-cream text-4xl md:text-5xl font-light">Siliana à Travers les Âges</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {timelineEvents.map((ev, index) => (
              <div key={ev.year} className="bg-dark/40 backdrop-blur-md border border-gold/30 rounded-2xl p-6 relative flex flex-col justify-between hover:border-gold transition-colors">
                <div className="text-3xl font-display text-gold mb-3 font-bold">{ev.year}</div>
                <h4 className="text-cream text-lg font-semibold mb-2">{ev.title}</h4>
                <p className="text-cream/70 text-sm leading-relaxed">{ev.desc}</p>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gold/80 flex items-center gap-1">
                  <span>Étape 0{index + 1}</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Tour Call-to-Action */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-dark via-forest-dark to-dark rounded-3xl p-10 md:p-16 border border-gold/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="badge-gold mb-4 inline-block">Visite Guidée Sur Mesure</span>
            <h3 className="text-cream text-3xl md:text-4xl font-light mb-4">
              Envie d'explorer le musée de Kesra et le site de Makthar ?
            </h3>
            <p className="text-cream/80 text-sm leading-relaxed">
              Nos guides locaux passionnés vous accompagnent à la découverte des secrets numides et des dégustations de produits locaux.
            </p>
          </div>
          <Link to="/activities" className="btn-gold text-sm px-8 py-4 shrink-0">
            Réserver un Circuit Culturel
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Heritage;
