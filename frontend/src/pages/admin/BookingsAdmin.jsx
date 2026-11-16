import { useCallback, useEffect, useState } from 'react';
import { getBookings, updateBookingStatus, deleteBooking, purgeOldCancelledBookings } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import Toast from '../../components/common/Toast';

function BookingsAdmin() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadBookings = useCallback(() => {
    setLoading(true);
    getBookings(token)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
  useEffect(() => { loadBookings(); }, [loadBookings]);

  async function handleCancel(id) {
    if (!confirm('Annuler cette réservation ?')) return;
    try {
      await updateBookingStatus(id, 'cancelled', token);
      showToast('Réservation annulée.', 'warning');
      loadBookings();
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'annulation.", 'danger');
    }
  }

  async function handleConfirm(id) {
    try {
      await updateBookingStatus(id, 'confirmed', token);
      showToast('Réservation confirmée avec succès !', 'success');
      loadBookings();
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la confirmation.", 'danger');
    }
  }

  async function handleUnconfirm(id) {
    try {
      await updateBookingStatus(id, 'pending', token);
      showToast('Réservation remise en attente.', 'info');
      loadBookings();
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la mise en attente.", 'danger');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer définitivement cette réservation ? Cette action est irréversible.')) return;
    try {
      await deleteBooking(id, token);
      showToast('Réservation supprimée définitivement.', 'danger');
      loadBookings();
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la suppression.", 'danger');
    }
  }

  async function handlePurge() {
    if (!confirm('Supprimer toutes les réservations annulées depuis plus de 24h ?')) return;
    try {
      const result = await purgeOldCancelledBookings(token);
      showToast(result.message || 'Purge des réservations annulées effectuée !', 'info');
      loadBookings();
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la purge.", 'danger');
    }
  }

  function bookedItemLabel(b) {
    return b.activity_title || b.stay_title || b.event_title || 'Élément réservé';
  }

  function displayTotalPrice(b) {
    if (b.total_price != null && Number(b.total_price) > 0) {
      return `${b.total_price} TND`;
    }
    if (b.calculated_total_price != null && Number(b.calculated_total_price) > 0) {
      return `${b.calculated_total_price} TND`;
    }
    const unitPrice = b.activity_price || b.stay_price;
    if (unitPrice != null && b.people_count) {
      const calc = Number(unitPrice) * Number(b.people_count);
      if (calc > 0) return `${calc} TND`;
    }
    if (b.total_price === 0 || b.total_price === '0' || b.calculated_total_price === 0) {
      return 'Gratuit';
    }
    return '-';
  }

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-cream/70 text-sm">Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="badge-gold mb-1 inline-block">Gestion des clients</span>
          <h2 className="font-display text-3xl text-cream font-light">Réservations Clients</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePurge}
            className="px-3 py-2 bg-red-900/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold hover:bg-red-900/60 transition-colors cursor-pointer whitespace-nowrap"
            title="Supprime toutes les réservations annulées depuis plus de 24h"
          >
            🗑 Purger les annulées
          </button>
          <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-gold text-dark font-bold' : 'text-cream/70 hover:text-cream'
              }`}
            >
              📊 Tableau
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-gold text-dark font-bold' : 'text-cream/70 hover:text-cream'
              }`}
            >
              🎴 Cartes
            </button>
          </div>
          <div className="text-xs text-gold bg-gold/10 border border-gold/30 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap">
            Total: {bookings.length} réservations
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-dark-muted border border-gold/20 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
          <table className="w-full text-left text-sm text-cream/90 min-w-[900px]">
            <thead className="bg-white/5 text-gold text-xs font-bold uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-4 py-3.5">Client</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5">Élément Réservé</th>
                <th className="px-4 py-3.5 text-center">Date</th>
                <th className="px-3 py-3.5 text-center">Pers.</th>
                <th className="px-4 py-3.5 text-right">Prix</th>
                <th className="px-4 py-3.5 text-center">Statut</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-cream/50">
                    Aucune réservation enregistrée.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-cream">{b.full_name}</td>
                    <td className="px-4 py-3.5 text-xs text-cream/70">
                      <div className="font-semibold text-cream/90">{b.phone}</div>
                      <div className="text-cream/50">{b.email}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gold">{bookedItemLabel(b)}</td>
                    <td className="px-4 py-3.5 text-center text-cream/80 text-xs whitespace-nowrap">
                      {b.booking_date ? new Date(b.booking_date).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-3 py-3.5 text-center font-bold text-cream">{b.people_count}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-gold whitespace-nowrap">
                      {displayTotalPrice(b)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : b.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {b.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleConfirm(b.id)}
                            className="px-3 py-1 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold hover:bg-emerald-600/60 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Confirmer
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => handleUnconfirm(b.id)}
                            className="px-3 py-1 bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold hover:bg-amber-600/60 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            En attente
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="px-3 py-1 bg-red-600/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-bold hover:bg-red-500/60 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Annuler
                          </button>
                        )}
                        {b.status === 'cancelled' && (
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="px-3 py-1 bg-red-900/50 text-red-200 border border-red-700/50 rounded-lg text-xs font-bold hover:bg-red-900/80 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            🗑 Supprimer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.length === 0 && (
            <p className="text-cream/50 col-span-full text-center py-12">Aucune réservation enregistrée.</p>
          )}
          {bookings.map((b) => (
            <div key={b.id} className="bg-dark-muted border border-gold/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                  <span className="font-bold text-cream text-base">{b.full_name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    b.status === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : b.status === 'cancelled'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {b.status || 'pending'}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-cream/80">
                  <div className="flex justify-between">
                    <span className="text-cream/50">Réservation:</span>
                    <span className="font-bold text-gold">{bookedItemLabel(b)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">Téléphone:</span>
                    <span className="font-mono">{b.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">Email:</span>
                    <span className="font-mono truncate">{b.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">Date:</span>
                    <span>{b.booking_date ? new Date(b.booking_date).toLocaleDateString('fr-FR') : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">Personnes:</span>
                    <span className="font-bold">{b.people_count} pers.</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold">
                    <span>Montant Total:</span>
                    <span className="text-gold">{displayTotalPrice(b)}</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                {b.status === 'pending' && (
                  <button
                    onClick={() => handleConfirm(b.id)}
                    className="px-3 py-1.5 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold hover:bg-emerald-600/60 transition-colors cursor-pointer"
                  >
                    Confirmer
                  </button>
                )}
                {b.status === 'confirmed' && (
                  <button
                    onClick={() => handleUnconfirm(b.id)}
                    className="px-3 py-1.5 bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold hover:bg-amber-600/60 transition-colors cursor-pointer"
                  >
                    En attente
                  </button>
                )}
                {b.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="px-3 py-1.5 bg-red-600/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-bold hover:bg-red-600/60 transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                )}
                {b.status === 'cancelled' && (
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="px-3 py-1.5 bg-red-900/50 text-red-200 border border-red-700/50 rounded-lg text-xs font-bold hover:bg-red-900/80 transition-colors cursor-pointer"
                  >
                    🗑 Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default BookingsAdmin;