import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-300">
              JourneyStack
            </Link>
            <nav className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 duration-300 ease-in-out font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 ease-in-out font-semibold"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="py-8">{children}</main>
    </div>
  );
}