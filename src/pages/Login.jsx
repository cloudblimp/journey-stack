import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [forgotMode, setForgotMode] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully! 🎉');
      navigate('/');
    } catch (err) {
      console.error('Login error', err);
      const errorMsg = err.message || 'Failed to log in';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google! 🚀');
      navigate('/');
    } catch (err) {
      console.error('Google sign-in error', err);
      const errorMsg = err.message || 'Google sign-in failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    setResetMessage(null);
    if (!email) {
      toast.error('Please enter your email to reset password');
      return setError('Please enter your email to reset password');
    }
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success('Password reset email sent! 📧');
      setResetMessage('Password reset email sent. Check your inbox.');
      setForgotMode(false);
    } catch (err) {
      console.error('Reset password error', err);
      const errorMsg = err.message || 'Failed to send reset email';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Log In</h2>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}

  <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setForgotMode(prev => !prev)}
              className="text-sm text-blue-600 hover:underline"
            >
              {forgotMode ? 'Back to login' : 'Forgot password?'}
            </button>
            {resetMessage && (
              <div className="text-sm text-green-600">{resetMessage}</div>
            )}
          </div>
          {!forgotMode ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 transition-all duration-75 font-medium min-h-[48px]"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 active:bg-yellow-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:bg-gray-400 transition-all duration-75 font-medium min-h-[48px]"
            >
              {loading ? 'Sending...' : 'Send reset email'}
            </button>
          )}
        </form>
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-2 border py-2 px-4 rounded-lg hover:bg-gray-100 disabled:opacity-60"
          >
            {/* Inline Google logo to avoid external asset dependency */}
            <svg className="h-5 w-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.4-34.1-4.1-50.3H272v95.3h147.5c-6.4 34.7-25 64.1-53.4 83.7v69.6h86.2c50.4-46.4 81.2-115 81.2-198.3z"/>
              <path fill="#34a853" d="M272 544.3c72.6 0 133.7-24 178.3-65.2l-86.2-69.6c-24 16.1-54.7 25.6-92.1 25.6-70.7 0-130.6-47.8-152-112.1H31.6v70.6C75.9 486 167.6 544.3 272 544.3z"/>
              <path fill="#fbbc04" d="M120 323.1c-10.7-31.5-10.7-65.6 0-97.1V155.4H31.6c-39.3 77.6-39.3 169.1 0 246.7L120 323.1z"/>
              <path fill="#ea4335" d="M272 107.7c39 0 74 13.4 101.6 39.6l76.1-76.1C401.1 24.3 342 0 272 0 167.6 0 75.9 58.3 31.6 145.6l88.4 70.4C141.4 155.5 201.3 107.7 272 107.7z"/>
            </svg>
            <span>{loading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>
        </div>
        
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account? 
          {/* Use Link instead of <a> for internal app navigation */}
          <Link to="/signup" className="text-blue-600 hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

