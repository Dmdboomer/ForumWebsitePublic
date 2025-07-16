import React from 'react';

const ProfileTab = ({ profile, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-group">
        <label>Display Name</label>
        <input 
          type="text" 
          name="name"
          value={profile.name}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input 
          type="email" 
          name="email"
          value={profile.email}
          onChange={handleChange}
          className="form-control"
          disabled
        />
      </div>

      <div className="form-group">
        <label>Bio</label>
        <textarea 
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          className="form-control"
          rows="3"
        />
      </div>

      <div className="form-group checkbox-group">
        <input 
          type="checkbox" 
          id="notificationsEnabled" 
          name="notificationsEnabled"
          checked={profile.notificationsEnabled}
          onChange={handleChange}
        />
        <label htmlFor="notificationsEnabled">Email notifications</label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Save Changes</button>
        <button type="button" className="btn btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default ProfileTab;