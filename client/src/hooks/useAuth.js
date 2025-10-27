// Re-export the canonical hook from the context implementation.
// This avoids duplicating logic and keeps a single source of truth.
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined || context === null) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
