import { useState } from 'react';
import { authApi } from '../api';
import GoogleAuthButton from '../components/GoogleAuthButton.jsx';
import { Link } from 'react-router-dom';

export default function Register({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.register({ username, email, password });
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">Create Your Account</h2>
        <p className="text-center text-gray-500 mb-8">Start your travel diary today!</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded-lg">{error}</p>}
          <div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 ease-in-out font-semibold shadow-md disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="mt-6 flex justify-center">
          <GoogleAuthButton onSuccess={onSuccess} />
        </div>
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}