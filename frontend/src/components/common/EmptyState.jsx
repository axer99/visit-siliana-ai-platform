import { SearchIcon } from './Icons';

export default function EmptyState({ 
  title = "Aucun résultat trouvé", 
  message = "Nous n'avons trouvé aucun élément correspondant à vos critères de recherche. Essayez d'ajuster vos filtres.",
  onReset = null,
  resetLabel = "Réinitialiser les filtres"
}) {
  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-dark/10 max-w-lg mx-auto shadow-sm my-12">
      <div className="w-16 h-16 bg-gold/15 border border-gold/40 rounded-full flex items-center justify-center text-gold mx-auto mb-5">
        <SearchIcon className="w-8 h-8 text-gold-dark" />
      </div>

      <h3 className="font-display text-2xl text-dark font-light mb-2">
        {title}
      </h3>
      <p className="text-dark/70 text-sm leading-relaxed mb-6">
        {message}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="btn-primary text-xs px-6 py-2.5 shadow-md"
        >
          {resetLabel}
        </button>
      )}
    </div>
  );
}
