import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Tv, Film, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isCollapsed }) => {
  const { user } = useAuth();
  const firstChannelId = user?.channels?.[0]?._id || user?.channels?.[0];

  return (
    <aside className={`yt-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-section">
        <NavLink to="/" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/?category=Coding" className="sidebar-item">
          <Compass size={20} />
          <span>Explore</span>
        </NavLink>

        <div className="sidebar-item" onClick={() => alert('Subscriptions feature demo')}>
          <PlaySquare size={20} />
          <span>Subscriptions</span>
        </div>
      </div>

      <div className="sidebar-section">
        {!isCollapsed && <div className="sidebar-title">You</div>}

        <div className="sidebar-item" onClick={() => alert('Library feature demo')}>
          <Film size={20} />
          <span>Library</span>
        </div>

        <div className="sidebar-item" onClick={() => alert('History feature demo')}>
          <Clock size={20} />
          <span>History</span>
        </div>

        {firstChannelId && (
          <NavLink to={`/channel/${firstChannelId}`} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Tv size={20} />
            <span>My Channel</span>
          </NavLink>
        )}

        <div className="sidebar-item" onClick={() => alert('Liked videos page')}>
          <ThumbsUp size={20} />
          <span>Liked Videos</span>
        </div>
      </div>

      {!isCollapsed && (
        <div className="sidebar-section">
          <div className="sidebar-title">Categories</div>
          <NavLink to="/?category=React" className="sidebar-item">
            <Radio size={20} />
            <span>React Tutorials</span>
          </NavLink>
          <NavLink to="/?category=Coding" className="sidebar-item">
            <Film size={20} />
            <span>Coding</span>
          </NavLink>
          <NavLink to="/?category=Music" className="sidebar-item">
            <Radio size={20} />
            <span>Music Streams</span>
          </NavLink>
        </div>
      )}
    </aside>
  );
};
