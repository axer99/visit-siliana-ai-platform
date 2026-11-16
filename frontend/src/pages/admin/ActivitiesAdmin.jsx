import { useEffect, useState, useRef } from 'react';
import { getActivities, createActivity, updateActivity, deleteActivity, uploadImage } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import Toast from '../../components/common/Toast';

function ActivitiesAdmin() {
  const { token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const emptyForm = { title: '', type: '', difficulty: '', duration_hours: '', price: '', description: '', image_url: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  function loadActivities() {
    setLoading(true);
    getActivities()
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err);
        setActivities([]);
      })
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount pattern
  useEffect(() => { loadActivities(); }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateActivity(editingId, formData, token);
        showToast(`L'activité « ${formData.title} » a été mise à jour !`, 'success');
      } else {
        await createActivity(formData, token);
        showToast(`L'activité « ${formData.title} » a été créée avec succès !`, 'success');
      }
      setFormData(emptyForm);
      setEditingId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadActivities();
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'enregistrement de l'activité.", 'danger');
    }
  }

  function startEdit(a) {
    setEditingId(a.id);
    setFormData({
      title: a.title || '',
      type: a.type || '',
      difficulty: a.difficulty || '',
      duration_hours: a.duration_hours || '',
      price: a.price || '',
      description: a.description || '',
      image_url: a.image_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(a) {
    if (!confirm(`Supprimer l'activité « ${a.title} » ?`)) return;
    try {
      await deleteActivity(a.id, token);
      showToast(`L'activité « ${a.title} » a été supprimée.`, 'danger');
      loadActivities();
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
      alert("Échec du téléversement de l'image.");
    } finally {
      setUploading(false);
    }
  }

  const inputClass = "w-full bg-dark/70 border border-white/15 rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="badge-gold mb-1 inline-block">Gestion des contenus</span>
          <h2 className="font-display text-3xl text-cream font-light">Gestion des Activités &amp; Aventures</h2>
        </div>
        <span className="text-xs text-gold bg-gold/10 border border-gold/30 px-4 py-2 rounded-full font-bold">
          Total: {activities.length} activités
        </span>
      </div>

      {/* Form Box */}
      <form onSubmit={handleSubmit} className="bg-dark-muted border border-gold/30 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-gold font-display text-lg border-b border-white/10 pb-3 flex items-center justify-between">
          <span>{editingId ? `Modifier « ${formData.title || `#${editingId}`} »` : "Ajouter une Nouvelle Activité"}</span>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setFormData(emptyForm); }}
              className="text-xs text-cream/50 hover:text-cream"
            >
              Annuler l'édition ✕
            </button>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="title"
            placeholder="Titre de l'activité *"
            value={formData.title}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            name="type"
            placeholder="Catégorie (ex: hiking, caving)"
            value={formData.type}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            name="difficulty"
            placeholder="Difficulté (ex: facile, modéré)"
            value={formData.difficulty}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="duration_hours"
            type="number"
            placeholder="Durée (heures)"
            value={formData.duration_hours}
            onChange={handleChange}
            className={inputClass}
          />
          <input
            name="price"
            type="number"
            placeholder="Prix (TND) *"
            value={formData.price}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-activity"
            />
            <label
              htmlFor="file-upload-activity"
              className="w-full bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl px-4 py-3 text-xs text-cream flex items-center justify-center gap-2 cursor-pointer font-semibold"
            >
              {uploading ? "Téléversement..." : "📷 Téléverser une Image"}
            </label>
          </div>
        </div>

        <input
          name="image_url"
          placeholder="Ou collez l'URL directe de l'image (https://...)"
          value={formData.image_url}
          onChange={handleChange}
          className={inputClass}
        />

        <textarea
          name="description"
          rows="3"
          placeholder="Description détaillée de l'activité..."
          value={formData.description}
          onChange={handleChange}
          className={inputClass}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button type="submit" className="btn-gold text-xs px-8 py-3 font-bold shadow-md cursor-pointer">
            {editingId ? 'Mettre à jour' : 'Ajouter l\'Activité'}
          </button>
        </div>
      </form>

      {/* Data Table */}
      <div className="bg-dark-muted border border-gold/20 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-cream/90">
            <thead className="bg-white/5 text-gold text-xs font-bold uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Visuel</th>
                <th className="px-6 py-4">Titre</th>
                <th className="px-6 py-4">Type / Difficulté</th>
                <th className="px-6 py-4">Durée</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-cream/50">Chargement...</td></tr>
              ) : activities.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-cream/50">Aucune activité enregistrée.</td></tr>
              ) : (
                activities.map((a) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      {a.image_url ? (
                        <img src={a.image_url} alt={a.title} className="w-12 h-12 object-cover rounded-lg border border-gold/30" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-cream/40">No img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-cream">{a.title}</td>
                    <td className="px-6 py-4 text-xs">
                      <span className="badge-gold">{a.difficulty || a.type || 'Standard'}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-cream/70">{a.duration_hours ? `${a.duration_hours}h` : '-'}</td>
                    <td className="px-6 py-4 font-bold text-forest">{a.price} TND</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => startEdit(a)} className="px-3 py-1.5 bg-gold/20 text-gold rounded-lg text-xs font-bold hover:bg-gold/40">
                        Éditer
                      </button>
                      <button onClick={() => handleDelete(a)} className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg text-xs font-bold hover:bg-red-500/40">
                        Supprimer
                      </button>
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

export default ActivitiesAdmin;