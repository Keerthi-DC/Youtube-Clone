import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit3, Trash2, Video as VideoIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { VideoModal } from '../components/VideoModal';

const formatViews = (views = 0) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

export const ChannelPage = ({ onOpenCreateChannelModal }) => {
  const { id } = useParams();
  const { user } = useAuth();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  const fetchChannel = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/channels/${id}`);
      const chData = res.data;
      setChannel(chData);
      setVideos(chData.videos || []);

      const subList = Array.isArray(chData.subscribers)
        ? chData.subscribers
        : typeof chData.subscribers === 'number'
        ? []
        : [];
      setSubscribersCount(subList.length || (typeof chData.subscribers === 'number' ? chData.subscribers : 0));

      if (user && chData._id) {
        const userSubs = user.subscribedChannels || [];
        setIsSubscribed(userSubs.some((subId) => (subId._id || subId).toString() === chData._id.toString()));
      }
    } catch (err) {
      console.error('[Fetch Channel Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [id, user]);

  const owner = channel?.owner || {};
  const isOwner = user && (owner._id === user._id || owner === user._id);

  const handleToggleSubscribe = async () => {
    if (!user) return alert('Please sign in to subscribe');
    if (!channel?._id) return;

    try {
      const token = localStorage.getItem('yt_token');
      const res = await axios.post(
        `/api/channels/${channel._id}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSubscribed(res.data.isSubscribed);
      setSubscribersCount(res.data.subscribersCount);
    } catch (err) {
      console.error('[Subscribe Error]:', err);
    }
  };

  const handleVideoSaved = (savedVideo) => {
    if (editingVideo) {
      setVideos(videos.map((v) => (v._id === savedVideo._id ? savedVideo : v)));
    } else {
      setVideos([savedVideo, ...videos]);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      await axios.delete(`/api/videos/${videoId}`);
      setVideos(videos.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error('[Delete Video Error]:', err);
      alert('Error deleting video');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading channel details...</div>;
  }

  if (!channel) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}>Channel not found.</div>;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Channel Banner */}
      <div
        style={{
          width: '100%',
          height: '200px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-secondary)'
        }}
      >
        <img
          src={channel.channelBanner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
          alt={channel.channelName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Channel Header Information */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '24px 0',
          borderBottom: '1px solid var(--border-color)'
        }}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <img
            src={owner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={channel.channelName}
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{channel.channelName}</h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              @{owner.username || 'user'} • {formatViews(subscribersCount)} subscribers • {videos.length} videos
            </div>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '8px' }}>
              {channel.description || 'Welcome to my official YouTube channel!'}
            </p>
          </div>
        </div>

        {isOwner ? (
          <button
            className="btn-primary"
            onClick={() => {
              setEditingVideo(null);
              setIsVideoModalOpen(true);
            }}
          >
            <Plus size={18} /> Upload Video
          </button>
        ) : (
          <button
            className={isSubscribed ? 'btn-secondary' : 'btn-primary'}
            onClick={handleToggleSubscribe}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        )}
      </div>

      {/* Videos Section */}
      <div style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <VideoIcon size={20} /> Videos ({videos.length})
        </h2>

        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            <p>No videos uploaded yet to this channel.</p>
            {isOwner && (
              <button
                className="btn-primary"
                style={{ marginTop: '12px' }}
                onClick={() => {
                  setEditingVideo(null);
                  setIsVideoModalOpen(true);
                }}
              >
                Upload your first video
              </button>
            )}
          </div>
        ) : (
          <div className="video-grid">
            {videos.map((v) => (
              <div key={v._id} style={{ position: 'relative' }}>
                <Link to={`/watch/${v._id}`} className="video-card">
                  <div className="thumbnail-wrapper">
                    <img src={v.thumbnailUrl} alt={v.title} className="thumbnail-img" />
                  </div>
                  <div className="video-details" style={{ padding: '0 4px' }}>
                    <h3 className="video-title">{v.title}</h3>
                    <div className="video-meta">
                      {formatViews(v.views)} views • {new Date(v.uploadDate || v.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>

                {/* Owner Control Overlay Buttons */}
                {isOwner && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '8px',
                      padding: '0 4px',
                      justify: 'flex-end'
                    }}
                  >
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', gap: '4px', alignItems: 'center' }}
                      onClick={() => {
                        setEditingVideo(v);
                        setIsVideoModalOpen(true);
                      }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', color: '#ff6b6b', display: 'flex', gap: '4px', alignItems: 'center' }}
                      onClick={() => handleDeleteVideo(v._id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Create/Edit Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onVideoSaved={handleVideoSaved}
        initialData={editingVideo}
        channelId={channel._id}
      />
    </div>
  );
};
