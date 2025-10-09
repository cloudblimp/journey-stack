import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #eee' }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: 'none' }}>Digital Travel Diary</Link>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <Link to="/">Dashboard</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>
      <main style={{ padding: '16px' }}>{children}</main>
    </div>
  );
}


