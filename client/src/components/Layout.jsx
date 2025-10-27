import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';

export default function Layout({ children }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      <header className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link 
              to="/" 
              className="text-2xl font-serif font-bold text-emerald-800 hover:text-emerald-900 transition-colors duration-300"
            >
              JourneyStack
            </Link>
            
            <nav className="flex items-center gap-6">
              {user ? (
                <>
                  <Link
                    to="/"
                    className={`font-medium transition-colors duration-300 ${
                      isActiveRoute('/') 
                        ? 'text-sky-600' 
                        : 'text-zinc-600 hover:text-sky-600'
                    }`}
                  >
                    My Journals
                  </Link>
                  <Link
                    to="/trips"
                    className={`font-medium transition-colors duration-300 ${
                      isActiveRoute('/trips') 
                        ? 'text-sky-600' 
                        : 'text-zinc-600 hover:text-sky-600'
                    }`}
                  >
                    Trips
                  </Link>
                  <Button 
                    variant="secondary" 
                    onClick={logout}
                    className="ml-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="text" 
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/register')}
                  >
                    Start Your Journal
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
      
      <footer className="mt-auto py-6 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-zinc-600">
          <p>JourneyStack - Your Personal Travel Chronicle</p>
        </div>
      </footer>
    </div>
  );
}