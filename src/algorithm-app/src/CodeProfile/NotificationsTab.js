import React from 'react';

const NotificationsTab = ({ 
  notifications, 
  markAsRead, 
  notificationsEnabled, 
  setNotificationsEnabled 
}) => {
  return (
    <div className="notifications">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications.map(notification => (
            <li 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <span className="notification-text">{notification.text}</span>
              {!notification.read && (
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="notification-settings">
        <label>
          <input 
            type="checkbox" 
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
          />
          Enable email notifications
        </label>
      </div>
    </div>
  );
};

export default NotificationsTab;