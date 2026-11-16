import { useEffect, useState, useRef } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent, uploadImage } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import Toast from '../../components/common/Toast';

function EventsAdmin() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const emptyForm = { title: '', description: '', event_date: '', location: '', image_url: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  function loadEvents() {
    setLoading(true);
    getEvents()
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
  useEffect(() => { loadEvents(); }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEvent(editingId, formData, token);
        showToast(`L'événement « ${formData.title} » a été mis à jour !`, 'success');
      } else {
        await createEvent(formData, token);
        showToast(`L'événement « ${formData.title} » a été créé avec succès !`, 'success');
      }
      setFormData(emptyForm);
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadEvents();
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'enregistrement de l'événement.", 'danger');
    }
  }

  function startEdit(ev) {
    setEditingId(ev.id);
    setFormData({
      title: ev.title || '',
      description: ev.description || '',
      event_date: ev.event_date ? ev.event_date.slice(0, 10) : '',
      location: ev.location || '',
      image_url: ev.image_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(ev) {
    if (!confirm(`Supprimer l'événement « ${ev.title} » ?`)) return;
    try {
      await deleteEvent(ev.id, token);
      showToast(`L'événement « ${ev.title} » a été supprimé.`, 'danger');
      loadEvents();
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la suppression.", 'danger');
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadImage(file, token);
      setFormData({ ...formData, image_url: result.image_url });
    } catch (err) {
      console.error(err);
      alert("Échec du téléversement.");
    } finally {
      setUploading(false);
    }
  }

  const inputClass = "w-full bg-dark/70 border border-white/15 rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-gold mb-1 inline-block">Agenda &amp; Festivals</span>
          <h2 className="font-display text-3xl text-cream font-light">Gestion des Événements</h2>
        </div>
        <span className="text-xs text-gold bg-gold/10 border border-gold/30 px-4 py-2 rounded-full font-bold">
          Total: {events.length} événements
        </span>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-muted border border-gold/30 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-gold font-display text-lg border-b border-white/10 pb-3 flex items-center justify-between">
          <span>{editingId ? `Modifier « ${formData.title || `#${editingId}`} »` : "Ajouter un Nouvel Événement"}</span>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setFormData(emptyForm); }}
              className="text-xs text-cream/50 hover:text-cream"
            >
              Annuler ✕
            </button>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="title" placeholder="Titre de l'événement *" value={formData.title} onChange={handleChange} required className={inputClass} />
          <input name="event_date" type="date" value={formData.event_date} onChange={handleChange} required className={inputClass} />
          <input name="location" placeholder="Lieu (ex: Kesra Village)" value={formData.location} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="image_url" placeholder="URL d'image d'affiche..." value={formData.image_url} onChange={handleChange} className={inputClass} />
          <div className="relative">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="file-upload-event" />
            <label htmlFor="file-upload-event" className="w-full bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl px-4 py-3 text-xs text-cream flex items-center justify-center gap-2 cursor-pointer font-semibold">
              {uploading ? "Téléversement..." : "📷 Téléverser l'Affiche"}
            </label>
          </div>
        </div>

        <textarea name="description" rows="3" placeholder="Programme et description..." value={formData.description} onChange={handleChange} className={inputClass} />

        <div className="flex justify-end gap-3 pt-2">
          <button type="submit" className="btn-gold text-xs px-8 py-3 font-bold shadow-md cursor-pointer">
            {editingId ? 'Mettre à jour' : 'Ajouter l\'Événement'}
          </button>
        </div>
      </form>

      <div className="bg-dark-muted border border-gold/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cream/90">
            <thead className="bg-white/5 text-gold text-xs font-bold uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Affiche</th>
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Lieu</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-cream/50">Chargement...</td></tr>
              ) : events.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-cream/50">Aucun événement enregistré.</td></tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      {ev.image_url ? (
                        <img src={ev.image_url} alt={ev.title} className="w-12 h-12 object-cover rounded-lg border border-gold/30" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-cream/40">No img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-cream">{ev.title}</td>
                    <td className="px-6 py-4 text-xs font-mono text-gold">
                      {ev.event_date ? new Date(ev.event_date).toLocaleDateString('fr-FR') : '-'}
                    </td>
                    <td className="px-6 py-4 text-xs text-cream/70">{ev.location}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => startEdit(ev)} className="px-3 py-1.5 bg-gold/20 text-gold rounded-lg text-xs font-bold hover:bg-gold/40">Éditer</button>
                      <button onClick={() => handleDelete(ev)} className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg text-xs font-bold hover:bg-red-500/40">Supprimer</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default EventsAdmin;