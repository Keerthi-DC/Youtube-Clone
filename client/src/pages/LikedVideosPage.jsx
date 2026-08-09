import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VideoCard } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, Lock, Film } from 'lucide-react';

export const LikedVideosPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchLikedVideos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('yt_token');
        const res = await axios.get('/api/videos/liked', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(res.data);
      } catch (err) {
        console.error('[Error fetching liked videos]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
        <Lock size={56} style={{ marginBottom: '16px', color: 'var(--yt-red)' }} />
        <h2>Sign in to see your Liked Videos</h2>
        <p style={{ marginTop: '8px', marginBottom: '24px' }}>
          Save videos you enjoy in your personal liked playlist.
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
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(20,20,30,0.8) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '32px'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}
        >
          <ThumbsUp size={32} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Liked Videos</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
            {videos.length} {videos.length === 1 ? 'video' : 'videos'} liked
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
          <Film size={48} style={{ marginBottom: '16px', color: 'var(--bg-hover)' }} />
          <h3>No Liked Videos Yet</h3>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            Tap the thumbs up icon on any video to save it here.
          </p>
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
