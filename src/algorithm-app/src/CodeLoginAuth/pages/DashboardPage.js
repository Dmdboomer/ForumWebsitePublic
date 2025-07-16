import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getDashboardData } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <Header />
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.email}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {dashboardData && <p>{dashboardData.data}</p>}
      <button 
        className="btn btn-outline-info" 
        onClick={() => navigate('/')}
      >
        See the Topics!
      </button>
    </div>
  );
};

export default DashboardPage;