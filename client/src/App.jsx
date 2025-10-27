import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TripView from './pages/TripView.jsx';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './hooks/useAuth';

function AppShell() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // rudimentary check; user will be loaded by AuthProvider via /auth/me
  }, [user]);

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }

  return (
    <Layout>
      {/* auth loading skeleton */}
      {/* we keep UI simple: could add a global spinner if needed */}
      <Routes>
        <Route element={<ProtectedRoute />}> 
          <Route path="/" element={<Dashboard />} />
          <Route path="/trips/:id" element={<TripView />} />
        </Route>
        <Route path="/login" element={<Login onSuccess={() => navigate('/')} />} />
        <Route path="/register" element={<Register onSuccess={() => navigate('/login')} />} />
      </Routes>
      
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
