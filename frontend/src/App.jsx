import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from './pages/Home';
import Activities from "./pages/Activities";
import Stays from './pages/Stays';
import Booking from "./pages/Booking";
import ActivityDetail from "./pages/ActivityDetail";
import StaysDetail from "./pages/StaysDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Heritage from "./pages/Heritage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import ActivitiesAdmin from './pages/admin/ActivitiesAdmin';
import StaysAdmin from "./pages/admin/StaysAdmin";
import Login from "./pages/admin/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";
import EventsAdmin from "./pages/admin/EventsAdmin";
import BookingsAdmin from "./pages/admin/BookingsAdmin";
import AIAdminInsights from "./pages/admin/AIAdminInsights";
import AIConciergeModal from "./components/common/AIConciergeModal";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities/>} />
          <Route path="/stays" element={<Stays />} />
          <Route path="/booking/:type/:id" element={<Booking />} />
          <Route path="/activities/:id" element={<ActivityDetail/>}/>
          <Route path="/stays/:id" element={<StaysDetail/>} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="activities" replace />} />
            <Route path="activities" element={<ActivitiesAdmin />} />
            <Route path="stays" element={<StaysAdmin />} />
            <Route path="events" element={<EventsAdmin />} />
            <Route path="bookings" element={<BookingsAdmin />} />
            <Route path="ai-insights" element={<AIAdminInsights />} />
          </Route>
          {/* Wildcard 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <AIConciergeModal />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;