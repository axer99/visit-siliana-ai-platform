import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import logo from '../../assets/site-images/logo.avif';
import { 
  SparklesIcon, 
  HomeIcon, 
  CalendarIcon, 
  UsersIcon, 
  GlobeIcon,
  ChartBarIcon
} from '../../components/common/Icons';

function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  const adminNav = [
    { path: '/admin/activities', label: 'Activités', icon: SparklesIcon },
    { path: '/admin/stays', label: 'Hébergements', icon: HomeIcon },
    { path: '/admin/events', label: 'Événements', icon: CalendarIcon },
    { path: '/admin/bookings', label: 'Réservations', icon: UsersIcon },
    { path: '/admin/ai-insights', label: 'Intelligence IA', icon: ChartBarIcon },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-dark text-cream flex flex-col">
      {/* Admin Header */}
      <header className="glass-nav py-3.5 px-6 border-b border-gold/30 sticky top-0 z-50">
        <div className="max-w-350 mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-forest-light/30 border border-gold/40 flex items-center justify-center">
                <img src={logo} alt="Visit Siliana" className="h-6 w-auto object-contain" />
              </div>
              <span className="font-display text-lg text-cream font-bold whitespace-nowrap">
                Visit <span className="text-gold italic">Siliana</span> Admin
              </span>
            </Link>
            <span className="badge-gold text-[10px] hidden sm:inline-block">Tableau de Bord</span>
          </div>

          <nav className="flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-full">
            {adminNav.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive(item.path)
                      ? 'bg-gold text-dark font-bold shadow-md'
                      : 'text-cream/70 hover:text-cream hover:bg-white/10'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-cream/70 hover:text-gold flex items-center gap-1 whitespace-nowrap">
              <GlobeIcon className="w-4 h-4 text-gold" />
              <span className="hidden md:inline">Voir le site public</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn-outline text-xs px-3.5 py-1.5 border-red-400/40 text-red-300 hover:bg-red-500/20 cursor-pointer whitespace-nowrap"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-350 mx-auto w-full p-6">
        <Outlet />
      </main>

      <footer className="py-4 px-6 border-t border-white/10 text-center text-xs text-cream/50">
        Visit Siliana Admin Control Panel © 2026
      </footer>
    </div>
  );
}

export default AdminLayout;