import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VideoCard } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { PlaySquare, Tv, Lock } from 'lucide-react';

export const SubscriptionsPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('yt_token');
        const res = await axios.get('/api/videos/subscriptions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(res.data);
      } catch (err) {
        console.error('[Error fetching subscriptions feed]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
        <Lock size={56} style={{ marginBottom: '16px', color: 'var(--yt-red)' }} />
        <h2>Sign in to view your Subscriptions</h2>
        <p style={{ marginTop: '8px', marginBottom: '24px' }}>
          Don't miss new videos from your favorite channels.
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
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(255,0,0,0.15) 0%, rgba(20,20,30,0.8) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '32px'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--yt-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <PlaySquare size={32} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Subscriptions Feed</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
            Latest videos published by channels you follow.
          </p>
        </div>
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
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <Tv size={48} style={{ marginBottom: '16px', color: 'var(--bg-hover)' }} />
          <h3>No Subscriptions Feed Yet</h3>
          <p style={{ marginTop: '8px', fontSize: '0.9rem', marginBottom: '20px' }}>
            Subscribe to channels to see their latest video uploads right here.
          </p>
          <button
            className="filter-chip active"
            style={{ padding: '8px 20px', fontSize: '0.95rem' }}
            onClick={() => navigate('/explore')}
          >
            Explore Channels
          </button>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
