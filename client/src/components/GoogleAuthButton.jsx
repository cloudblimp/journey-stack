import { useEffect, useRef } from 'react';
import { authApi, setAuthToken } from '../api';
import { useAuth } from '../hooks/useAuth';

export default function GoogleAuthButton({ onSuccess }) {
  const btnRef = useRef(null);
  const { setUser } = useAuth();

  useEffect(() => {
    if (!window.google || !btnRef.current) return;
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const idToken = response.credential;
        const data = await authApi.google(idToken);
        setAuthToken(data.token);
        setUser(data.user);
        onSuccess?.(data.user);
      },
    });
    window.google.accounts.id.renderButton(btnRef.current, { theme: 'outline', size: 'large', width: 250 });
  }, [onSuccess, setUser]);

  return <div ref={btnRef}></div>;
}


