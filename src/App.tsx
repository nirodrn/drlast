import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollRestoration from './components/scroll-restoration';

// Lazy load all pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const CosmeticServices = lazy(() => import('./pages/CosmeticServices'));
const MedicalServices = lazy(() => import('./pages/MedicalServices'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminTimeManagement = lazy(() => import('./pages/AdminTimeManagement'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const Gallery = lazy(() => import('./pages/Gallery'));
const ConcernsPage = lazy(() => import('./pages/ConcernsPage'));
const TreatmentPage = lazy(() => import('./components/TreatmentPage'));
const CalendarView = lazy(() => import('./pages/CalendarView'));

export default function App() {
  const location = useLocation();

  // Additional scroll restoration for route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <ScrollRestoration />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cosmetic-services" element={<CosmeticServices />} />
            <Route path="/medical-services" element={<MedicalServices />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/concerns" element={<ConcernsPage />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/time-management"
              element={
                <AdminRoute>
                  <AdminTimeManagement />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/calendar"
              element={
                <AdminRoute>
                  <CalendarView />
                </AdminRoute>
              }
            />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/treatments/:treatmentId" element={<TreatmentPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}