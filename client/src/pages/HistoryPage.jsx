import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VideoCard } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { Clock, Trash2, Lock, Film } from 'lucide-react';

export const HistoryPage = () => {
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('yt_token');
      const res = await axios.get('/api/users/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryItems(res.data);
    } catch (err) {
      console.error('[Error fetching watch history]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your watch history?')) return;
    try {
      const token = localStorage.getItem('yt_token');
      await axios.delete('/api/users/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryItems([]);
    } catch (err) {
      console.error('[Error clearing history]:', err);
      alert('Failed to clear watch history');
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
        <Lock size={56} style={{ marginBottom: '16px', color: 'var(--yt-red)' }} />
        <h2>Keep track of what you watch</h2>
        <p style={{ marginTop: '8px', marginBottom: '24px' }}>
          Watch history isn't viewable when signed out.
        </p>
        <button
          className="auth-submit-btn"
          style={{ width: 'auto', padding: '10px 24px' }}
          onClick={() => navigate('/login')}
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 16px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(20,20,30,0.8) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Clock size={32} color="var(--text-primary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Watch History</h1>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
              Videos you have recently watched.
            </p>
          </div>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={handleClearHistory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
          >
            <Trash2 size={18} /> Clear Watch History
          </button>
        )}
      </div>

      {loading ? (
        <div className="video-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{ opacity: 0.6 }}>
              <div className="thumbnail-wrapper" style={{ background: 'var(--bg-tertiary)' }} />
              <div style={{ height: '20px', background: 'var(--bg-tertiary)', marginTop: '8px', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      ) : historyItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <Film size={48} style={{ marginBottom: '16px', color: 'var(--bg-hover)' }} />
          <h3>No Watch History Found</h3>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            Videos you watch while signed in will appear here.
          </p>
        </div>
      ) : (
        <div className="video-grid">
          {historyItems.map((item) => (
            <VideoCard key={item._id || item.video._id} video={item.video} />
          ))}
        </div>
      )}
    </div>
  );
};
