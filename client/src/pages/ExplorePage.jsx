import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { VideoCard } from '../components/VideoCard';
import { Compass, Code, Music, Gamepad2, Newspaper, Mic, Cpu, Flame } from 'lucide-react';

const EXPLORE_CATEGORIES = [
  { name: 'React', icon: Code, color: '#61dafb', desc: 'React, Hooks, & Modern Frontend' },
  { name: 'Coding', icon: Code, color: '#38bdf8', desc: 'Web Dev, Algorithms, & Clean Code' },
  { name: 'Music', icon: Music, color: '#f43f5e', desc: 'Trending Music, Lo-Fi, & Live Streams' },
  { name: 'Gaming', icon: Gamepad2, color: '#a855f7', desc: 'Live Streamers, Esports, & Reviews' },
  { name: 'News', icon: Newspaper, color: '#eab308', desc: 'Latest Tech & World News' },
  { name: 'Podcasts', icon: Mic, color: '#10b981', desc: 'Deep Dives & Tech Interviews' },
  { name: 'Tech', icon: Cpu, color: '#ec4899', desc: 'Gadgets, Hardware, & Innovation' },
];

export const ExplorePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/videos');
        setVideos(res.data);
      } catch (err) {
        console.error('[Error fetching explore videos]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div style={{ padding: '24px 16px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Explore Banner Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(255,0,0,0.15) 0%, rgba(30,30,40,0.8) 100%)',
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
          <Compass size={32} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Explore</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
            Discover trending topics, popular categories, and top creators.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Flame size={20} color="var(--yt-red)" /> Browse Categories
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '16px',
          marginBottom: '40px'
        }}
      >
        {EXPLORE_CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          return (
            <div
              key={cat.name}
              onClick={() => navigate(`/?category=${cat.name}`)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 16px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-tertiary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = cat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: `${cat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconComp size={24} color={cat.color} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{cat.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {cat.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trending Videos */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '16px' }}>Trending Videos</h2>

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
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
