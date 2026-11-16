import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MountainIcon, 
  MapPinIcon, 
  ChevronRightIcon, 
  SparklesIcon
} from './Icons';

const JEWELS = [
  {
    id: 'bargou',
    title: 'Djebel Bargou & Jebel Serj',
    subtitle: 'Royaume de la Haute Montagne & Spéléologie',
    altitude: '1,266 m',
    distance: '120 km de Tunis (1h35)',
    tag: 'Montagne & Nature Sauvage',
    bgImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    description: "Sommet emblématique dominant tout le nord-ouest tunisien. Forêts denses de chênes et pins d'Alep, réserve nationale réintroduisant le cerf de Berbérie, et la grandiose Grotte de la Mine.",
    highlights: ['Grotte de la Mine (Spéléo)', 'Parc National de Serj', 'Escalade sur calcaire (voies 5b-7c)', 'Bivouac étoilé sans pollution'],
    searchQuery: 'bargou'
  },
  {
    id: 'kesra',
    title: 'Kesra le Perché',
    subtitle: 'Le Plus Haut Village Habité de Tunisie (1100m)',
    altitude: '1,100 m',
    distance: '140 km de Tunis (1h50)',
    tag: 'Village Berbère Millénaire',
    bgImage: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    description: "Joyau d'architecture vernaculaire accroché à flanc de falaise. Sources naturelles d'eau pure jaillissant de la roche, escaliers byzantins, sépultures mégalithiques et vergers de figues réputés.",
    highlights: ['Cascades et sources d\'eau vive', 'Maison d\'hôtes Dar Kesra', 'Confiture de figues AOP', 'Nécropole mégalithique'],
    searchQuery: 'kesra'
  },
  {
    id: 'makthar',
    title: 'Mactaris Antique (Makthar)',
    subtitle: 'Prestigieuse Cité Numido-Romaine',
    altitude: '900 m',
    distance: '155 km de Tunis (2h00)',
    tag: 'Patrimoine Mondial & Histoire',
    bgImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    description: "L'un des sites archéologiques les plus vastes et préservés du Maghreb. Coexistence unique entre civilisations numide et romaine : thermes d'hiver monumentaux, arc de Trajan et schola des juvenes.",
    highlights: ['Grands thermes du Sud', 'Arc triomphal de Trajan', 'Musée archéologique national', 'Nuit des flambeaux'],
    searchQuery: 'makthar'
  },
  {
    id: 'zama',
    title: 'Plaines de Zama & Gaâfour',
    subtitle: 'Terre de la Bataille Historique & Agrotourisme',
    altitude: '450 m',
    distance: '105 km de Tunis (1h20)',
    tag: 'Histoire Punique & Terroir',
    bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    description: "Théâtre de la confrontation légendaire entre Hannibal Barca et Scipion l'Africain en 202 av. J.-C. Aujourd'hui, un havre de paix agrotouristique parsemé d'oliveraies séculaires et de gîtes ruraux.",
    highlights: ['Mémoire de la bataille de Zama', 'Gîtes agrotouristiques El Henchir', 'Huile d\'olive pressée à froid', 'Randonnées équestres'],
    searchQuery: 'siliana'
  }
];

export default function RegionalExplorer3D() {
  const [activeJewelId, setActiveJewelId] = useState('bargou');
  const activeJewel = JEWELS.find(j => j.id === activeJewelId) || JEWELS[0];

  return (
    <section id="regional-treasures" aria-label="Les 4 Trésors du Gouvernorat de Siliana" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-2">
          Territoires &amp; Joyaux Régionaux
        </span>
        <h2 className="text-dark font-display text-4xl md:text-6xl font-light mb-4">
          Les 4 Trésors du Gouvernorat de Siliana
        </h2>
        <p className="text-dark/70 text-base max-w-xl mx-auto">
          Explorez chaque région en profondeur pour découvrir ses sommets, son histoire antique et ses expériences signatures.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
        {JEWELS.map((j) => {
          const isSelected = j.id === activeJewelId;
          return (
            <button
              key={j.id}
              onClick={() => setActiveJewelId(j.id)}
              className={`px-5 py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-forest text-cream shadow-xl border border-gold/40 scale-105'
                  : 'bg-white hover:bg-cream-dark text-dark/80 border border-dark/10'
              }`}
            >
              <span>{j.title.split(' ')[0]}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-gold text-dark' : 'bg-dark/10 text-dark/70'}`}>
                {j.altitude}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hero Showcase Card for Selected Region */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-dark/10 min-h-[500px] flex flex-col justify-end p-8 md:p-14 group">
        {/* Background Image with smooth transition */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform group-hover:scale-105"
          style={{ backgroundImage: `url(${activeJewel.bgImage})` }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-linear-to-t from-dark via-dark/75 to-dark/30" />

        <div className="relative z-10 max-w-3xl text-cream">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="badge-gold bg-gold/20 text-gold border-gold/50 backdrop-blur-md">
              {activeJewel.tag}
            </span>
            <span className="bg-white/10 backdrop-blur-md text-cream/90 text-xs px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
              <MountainIcon className="w-3.5 h-3.5 text-gold" />
              Altitude : {activeJewel.altitude}
            </span>
            <span className="bg-white/10 backdrop-blur-md text-cream/90 text-xs px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
              <MapPinIcon className="w-3.5 h-3.5 text-gold" />
              {activeJewel.distance}
            </span>
          </div>

          <h3 className="font-display text-3xl md:text-5xl font-light text-cream mb-2 leading-tight">
            {activeJewel.title}
          </h3>
          <p className="text-gold text-base md:text-lg italic font-light mb-4">
            « {activeJewel.subtitle} »
          </p>

          <p className="text-cream/90 text-sm md:text-base leading-relaxed mb-6 font-light max-w-2xl">
            {activeJewel.description}
          </p>

          {/* Highlights checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 max-w-xl">
            {activeJewel.highlights.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-xs text-cream/90">
                <SparklesIcon className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={`/activities?search=${activeJewel.searchQuery}`}
              className="btn-gold text-xs px-6 py-3.5"
            >
              Voir les Activités à {activeJewel.title.split(' ')[0]} <ChevronRightIcon className="w-4 h-4 text-dark" />
            </Link>
            <Link
              to="/stays"
              className="btn-outline text-cream border-cream/40 hover:bg-white/10 text-xs px-6 py-3.5"
            >
              Hébergements Proches
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
