import React from 'react';
import { useAuth } from '../CodeLoginAuth/context/AuthContext';

const ProfileTab = ({ profile, handleChange, handleSubmit }) => {
  const {user} = useAuth()

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-group">
        <label>Display Name</label>
        <input 
          type="text" 
          name="name"
          value={user ? user.username || 'holdon' : 'please login'}
          onChange={handleChange}
          className="form-control"
          disabled
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input 
          type="email" 
          name="email"
          value={user ? user.email || 'holdon' : 'please login'}
          onChange={handleChange}
          className="form-control"
          disabled
        />
      </div>

      <div className="form-group">
        <label>Bio</label>
        <textarea 
          name="bio"
          value={user ? user.email || 'hold on' : 'please login'}
          onChange={handleChange}
          className="form-control"
          rows="3"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Save Changes</button>
        <button type="button" className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default ProfileTab;