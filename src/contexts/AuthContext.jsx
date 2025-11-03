import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config.js';

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook to make it easy to use the context
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To show a loading state while we check for a user

  useEffect(() => {
    // This function listens for changes in auth state (login/logout)
    // onAuthStateChanged returns an "unsubscribe" function
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // We're done loading the user status
      console.log("Auth state checked. User:", currentUser ? currentUser.email : 'null');
    });

    // Cleanup: We unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []); // The empty array [] means this effect runs only once

  // The "value" is what we pass down to all child components
  const value = {
    currentUser: user,
    loading
  };

  // We don't render the rest of the app until we've finished checking the auth state
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
