import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../services/api';
import { useAuth } from '../../context/useAuth';
import logo from '../../assets/site-images/logo.avif';
import { ShieldIcon, MailIcon } from '../../components/common/Icons';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await loginAdmin(email, password);
      login(token);
      navigate('/admin/activities');
    } catch (err) {
      console.error(err);
      setError('Identifiants invalides. Veuillez vérifier votre email et mot de passe.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark text-cream flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-forest/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-dark-muted border border-gold/30 rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-forest/40 border border-gold/50 flex items-center justify-center mx-auto mb-4">
            <img src={logo} alt="Visit Siliana" className="h-9 w-auto object-contain" />
          </div>
          <span className="badge-gold mb-2 inline-block">Portail Sécurisé</span>
          <h1 className="font-display text-3xl text-cream font-light">Espace Administration</h1>
          <p className="text-cream/60 text-xs mt-1">Connectez-vous pour gérer les activités, hébergements et réservations.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3.5 mb-6 text-xs text-red-300 flex items-center gap-2">
            <ShieldIcon className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cream/80 mb-2">
              Email Administrateur
            </label>
            <div className="relative">
              <MailIcon className="w-5 h-5 text-cream/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="admin@visit-siliana.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-dark/70 border border-white/15 rounded-xl pl-12 pr-4 py-3.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-cream/80 mb-2">
              Mot de Passe
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-dark/70 border border-white/15 rounded-xl px-4 py-3.5 text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-4 text-center justify-center text-sm font-bold shadow-lg disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? "Connexion en cours..." : "Se Connecter"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-cream/50">
          <span>Visit Siliana Administration System © 2026</span>
        </div>
      </div>
    </div>
  );
}

export default Login;