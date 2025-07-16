import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileTab from './ProfileTab';
import SavedNodesTab from './SavedNodesTab';
import NotificationsTab from './NotificationsTab';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Knowledge enthusiast',
    notificationsEnabled: true,
  });

  const [notifications] = useState([
    { id: 1, text: 'Your article was approved', read: true },
    { id: 2, text: 'New comment on your post', read: false },
    { id: 3, text: 'Weekly newsletter', read: false },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const markAsRead = (id) => {
    alert(`Marked notification ${id} as read`);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-large">👤</div>
        <h2>User Profile</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}>
          Profile
        </button>
        <button 
          className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}>
          Saved Nodes
        </button>
        <button 
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}>
          Notifications
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'profile' && (
          <ProfileTab 
            profile={profile}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}

        {activeTab === 'saved' && <SavedNodesTab />}

        {activeTab === 'notifications' && (
          <NotificationsTab 
            notifications={notifications}
            markAsRead={markAsRead}
            notificationsEnabled={profile.notificationsEnabled}
            setNotificationsEnabled={(enabled) => setProfile(prev => ({
              ...prev, 
              notificationsEnabled: enabled
            }))}
          />
        )}
      </div>

      <Link to="/" className="dashboard-link">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default UserProfilePage;