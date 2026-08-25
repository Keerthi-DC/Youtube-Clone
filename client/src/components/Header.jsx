import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Video, User as UserIcon, LogOut, Tv, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = ({ onToggleSidebar, onSearchSubmit, initialSearch = '', onOpenCreateModal }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery);
    } else {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="yt-header">
      <div className="header-left">
        <button className="icon-btn" onClick={onToggleSidebar} title="Toggle menu">
          <Menu size={22} />
        </button>

        <Link to="/" className="logo-container">
          <svg className="logo-icon" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>YouTube</span>
          <span className="logo-badge">IN</span>
        </Link>
      </div>

      <div className="header-center">
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search videos by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn" title="Search">
            <Search size={18} />
          </button>
        </form>
      </div>

      <div className="header-right">
        {loading ? (
          <div style={{ width: '80px', height: '32px' }} />
        ) : user ? (
          <>
            {onOpenCreateModal && (
              <button className="btn-primary" onClick={onOpenCreateModal} style={{ fontSize: '0.85rem' }}>
                <Plus size={16} /> Create
              </button>
            )}

            <div style={{ position: 'relative' }}>
              <div
                className="user-profile-badge"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={user.username}
                  className="user-avatar"
                />
                <span className="user-name">{user.username}</span>
              </div>

              {showDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 0',
                    width: '200px',
                    boxShadow: 'var(--shadow-subtle)',
                    zIndex: 1000
                  }}
                >
                  {user.channels && user.channels.length > 0 ? (
                    <Link
                      to={`/channel/${user.channels[0]._id || user.channels[0]}`}
                      className="sidebar-item"
                      onClick={() => setShowDropdown(false)}
                      style={{ borderRadius: 0 }}
                    >
                      <Tv size={18} /> My Channel
                    </Link>
                  ) : (
                    <button
                      className="sidebar-item"
                      onClick={() => {
                        setShowDropdown(false);
                        if (onOpenCreateModal) onOpenCreateModal();
                      }}
                      style={{ borderRadius: 0, width: '100%', border: 'none', background: 'transparent' }}
                    >
                      <Plus size={18} /> Create Channel
                    </button>
                  )}

                  <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

                  <button
                    className="sidebar-item"
                    onClick={handleLogout}
                    style={{ borderRadius: 0, width: '100%', border: 'none', background: 'transparent', color: '#ff6b6b' }}
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link to="/login" className="btn-signin">
            <UserIcon size={18} /> Sign in
          </Link>
        )}
      </div>
    </header>
  );
};
