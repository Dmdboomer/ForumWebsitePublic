import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, loading } = useAuth(); // Correctly destructure logout
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Now properly defined
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) return <header />; // Loading state

  return (
    <header>
      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <div>
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Signup</button>
        </div>
      )}
    </header>
  );
};

export default Header;