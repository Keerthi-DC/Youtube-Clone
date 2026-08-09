import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { VideoCard } from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';
import { Film, Clock, ThumbsUp, ChevronRight, Lock } from 'lucide-react';

export const LibraryPage = () => {
  const { user } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchLibraryData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('yt_token');
        const headers = { Authorization: `Bearer ${token}` };

        const [historyRes, likedRes] = await Promise.all([
          axios.get('/api/users/history', { headers }).catch(() => ({ data: [] })),
          axios.get('/api/videos/liked', { headers }).catch(() => ({ data: [] }))
        ]);

        setHistoryItems(historyRes.data.slice(0, 4));
        setLikedVideos(likedRes.data.slice(0, 4));
      } catch (err) {
        console.error('[Error fetching library data]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-secondary)' }}>
        <Lock size={56} style={{ marginBottom: '16px', color: 'var(--yt-red)' }} />
        <h2>Enjoy your favorite videos</h2>
        <p style={{ marginTop: '8px', marginBottom: '24px' }}>
          Sign in to access videos that you've liked or saved.
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
      {/* Library Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(20,20,30,0.8) 100%)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '32px'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Film size={32} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Library</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
            Your personal hub for watch history and saved liked videos.
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
      ) : (
        <>
          {/* Recent History Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={22} color="var(--yt-red)" /> History
              </h2>
              <Link
                to="/history"
                style={{
                  color: 'var(--accent-blue)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                See all <ChevronRight size={16} />
              </Link>
            </div>

            {historyItems.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recently watched videos.</p>
            ) : (
              <div className="video-grid">
                {historyItems.map((item) => (
                  <VideoCard key={item._id || item.video._id} video={item.video} />
                ))}
              </div>
            )}
          </div>

          {/* Liked Videos Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ThumbsUp size={22} color="#3b82f6" /> Liked Videos
              </h2>
              <Link
                to="/liked"
                style={{
                  color: 'var(--accent-blue)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                See all <ChevronRight size={16} />
              </Link>
            </div>

            {likedVideos.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No liked videos yet.</p>
            ) : (
              <div className="video-grid">
                {likedVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
