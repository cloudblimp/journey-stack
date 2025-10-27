import { useEffect, useState } from 'react';
import { authApi, setAuthToken } from '../api';
import { AuthContext } from './authContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.me().then(setUser).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await authApi.login({ email, password });
    // if server returns token and user, persist token and set user
    if (data?.token) setAuthToken(data.token);
    if (data?.user) setUser(data.user);
    return data;
  }

  async function register(username, email, password) {
    const data = await authApi.register({ username, email, password });
    if (data?.token) setAuthToken(data.token);
    if (data?.user) setUser(data.user);
    return data;
  }

  function logout() {
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Note: `useAuth` hook is implemented in `src/hooks/useAuth.js` to avoid
// exporting non-components from this module which can interfere with fast
// refresh during development.

