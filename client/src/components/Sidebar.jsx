import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Tv, Film, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isCollapsed, isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const firstChannelId = user?.channels?.[0]?._id || user?.channels?.[0];

  const isHomeActive = location.pathname === '/' && !currentCategory;
  const isExploreActive = location.pathname === '/explore';
  const isSubscriptionsActive = location.pathname === '/subscriptions';
  const isLibraryActive = location.pathname === '/library';
  const isHistoryActive = location.pathname === '/history';
  const isLikedActive = location.pathname === '/liked';
  const isCategoryActive = (cat) => location.pathname === '/' && currentCategory === cat;

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 899
          }}
        />
      )}

      <aside className={`yt-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-section">
          <Link to="/" className={`sidebar-item ${isHomeActive ? 'active' : ''}`} onClick={handleLinkClick}>
            <Home size={20} />
            <span>Home</span>
          </Link>

          <Link to="/explore" className={`sidebar-item ${isExploreActive ? 'active' : ''}`} onClick={handleLinkClick}>
            <Compass size={20} />
            <span>Explore</span>
          </Link>

          <Link to="/subscriptions" className={`sidebar-item ${isSubscriptionsActive ? 'active' : ''}`} onClick={handleLinkClick}>
            <PlaySquare size={20} />
            <span>Subscriptions</span>
          </Link>
        </div>

        <div className="sidebar-section">
          {!isCollapsed && <div className="sidebar-title">You</div>}

          <Link to="/library" className={`sidebar-item ${isLibraryActive ? 'active' : ''}`} onClick={handleLinkClick}>
            <Film size={20} />
            <span>Library</span>
          </Link>

          <Link to="/history" className={`sidebar-item ${isHistoryActive ? 'active' : ''}`} onClick={handleLinkClick}>
            <Clock size={20} />
            <span>History</span>
          </Link>

          {firstChannelId && (
            <NavLink to={`/channel/${firstChannelId}`} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
              <Tv size={20} />
              <span>My Channel</span>
            </NavLink>
          )}

          <Link to="/liked" className={`sidebar-item ${isLikedActive ? 'active' : ''}`} onClick={handleLinkClick}>
            <ThumbsUp size={20} />
            <span>Liked Videos</span>
          </Link>
        </div>

        {!isCollapsed && (
          <div className="sidebar-section">
            <div className="sidebar-title">Categories</div>
            <Link to="/?category=React" className={`sidebar-item ${isCategoryActive('React') ? 'active' : ''}`} onClick={handleLinkClick}>
              <Radio size={20} />
              <span>React Tutorials</span>
            </Link>
            <Link to="/?category=Coding" className={`sidebar-item ${isCategoryActive('Coding') ? 'active' : ''}`} onClick={handleLinkClick}>
              <Film size={20} />
              <span>Coding</span>
            </Link>
            <Link to="/?category=Music" className={`sidebar-item ${isCategoryActive('Music') ? 'active' : ''}`} onClick={handleLinkClick}>
              <Radio size={20} />
              <span>Music Streams</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};


