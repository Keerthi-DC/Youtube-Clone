import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Tv, Film, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const firstChannelId = user?.channels?.[0]?._id || user?.channels?.[0];

  const isHomeActive = location.pathname === '/' && !currentCategory;
  const isExploreActive = location.pathname === '/explore';
  const isCategoryActive = (cat) => location.pathname === '/' && currentCategory === cat;

  return (
    <aside className={`yt-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-section">
        <Link to="/" className={`sidebar-item ${isHomeActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link to="/explore" className={`sidebar-item ${isExploreActive ? 'active' : ''}`}>
          <Compass size={20} />
          <span>Explore</span>
        </Link>

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
          <Link to="/?category=React" className={`sidebar-item ${isCategoryActive('React') ? 'active' : ''}`}>
            <Radio size={20} />
            <span>React Tutorials</span>
          </Link>
          <Link to="/?category=Coding" className={`sidebar-item ${isCategoryActive('Coding') ? 'active' : ''}`}>
            <Film size={20} />
            <span>Coding</span>
          </Link>
          <Link to="/?category=Music" className={`sidebar-item ${isCategoryActive('Music') ? 'active' : ''}`}>
            <Radio size={20} />
            <span>Music Streams</span>
          </Link>
        </div>
      )}
    </aside>
  );
};


