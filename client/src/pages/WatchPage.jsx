import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, ThumbsDown, Share2, Download, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CommentItem } from '../components/CommentItem';
import { VideoCard } from '../components/VideoCard';
import { ShareModal } from '../components/ShareModal';

const formatViews = (views = 0) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

export const WatchPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [video, setVideo] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const [videoRes, commentsRes, allVideosRes] = await Promise.all([
          axios.get(`/api/videos/${id}`),
          axios.get(`/api/comments/video/${id}`),
          axios.get('/api/videos')
        ]);

        const v = videoRes.data;
        setVideo(v);
        setComments(commentsRes.data);
        setRecommendedVideos(allVideosRes.data.filter((item) => item._id !== id));

        setLikesCount(v.likes ? v.likes.length : 0);
        setDislikesCount(v.dislikes ? v.dislikes.length : 0);

        const channelObj = v.channelId || {};
        const subList = Array.isArray(channelObj.subscribers)
          ? channelObj.subscribers
          : typeof channelObj.subscribers === 'number'
          ? []
          : [];
        setSubscribersCount(subList.length || (typeof channelObj.subscribers === 'number' ? channelObj.subscribers : 0));

        if (user && v.likes) {
          setIsLiked(v.likes.some((uId) => (uId._id || uId) === user._id));
        }
        if (user && v.dislikes) {
          setIsDisliked(v.dislikes.some((uId) => (uId._id || uId) === user._id));
        }
        if (user && channelObj._id) {
          const userSubs = user.subscribedChannels || [];
          setIsSubscribed(userSubs.some((chId) => (chId._id || chId).toString() === channelObj._id.toString()));
          // Log watch history
          const token = localStorage.getItem('yt_token');
          axios.post(`/api/users/history/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch((err) => console.error('[Log History Error]:', err));
        }
      } catch (err) {
        console.error('[WatchPage Fetch Error]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id, user]);

  const handleToggleSubscribe = async () => {
    if (!user) return alert('Please sign in to subscribe');
    const channelObj = video?.channelId || {};
    if (!channelObj._id) return;

    try {
      const token = localStorage.getItem('yt_token');
      const res = await axios.post(
        `/api/channels/${channelObj._id}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSubscribed(res.data.isSubscribed);
      setSubscribersCount(res.data.subscribersCount);
    } catch (err) {
      console.error('[Subscribe Error]:', err);
    }
  };

  const handleToggleLike = async () => {
    if (!user) return alert('Please sign in to like videos');
    try {
      const res = await axios.post(`/api/videos/${id}/like`);
      setLikesCount(res.data.likesCount);
      setDislikesCount(res.data.dislikesCount);
      setIsLiked(res.data.isLiked);
      setIsDisliked(res.data.isDisliked);
    } catch (err) {
      console.error('[Like Error]:', err);
    }
  };

  const handleToggleDislike = async () => {
    if (!user) return alert('Please sign in to dislike videos');
    try {
      const res = await axios.post(`/api/videos/${id}/dislike`);
      setLikesCount(res.data.likesCount);
      setDislikesCount(res.data.dislikesCount);
      setIsLiked(res.data.isLiked);
      setIsDisliked(res.data.isDisliked);
    } catch (err) {
      console.error('[Dislike Error]:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please sign in to post comments');
    if (!newCommentText.trim()) return;

    try {
      const res = await axios.post('/api/comments', {
        videoId: id,
        text: newCommentText
      });
      setComments([res.data, ...comments]);
      setNewCommentText('');
    } catch (err) {
      console.error('[Add Comment Error]:', err);
    }
  };

  const handleUpdateComment = async (commentId, newText) => {
    try {
      const res = await axios.put(`/api/comments/${commentId}`, { text: newText });
      setComments(comments.map((c) => (c._id === commentId ? res.data : c)));
    } catch (err) {
      console.error('[Update Comment Error]:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('[Delete Comment Error]:', err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading video stream...</div>;
  }

  if (!video) {
    return <div style={{ textAlign: 'center', padding: '100px 0' }}>Video not found.</div>;
  }

  const channel = video.channelId || {};
  const uploader = video.uploader || {};

  return (
    <div className="watch-container">
      <div className="player-section">
        {/* Video Player */}
        <div className="video-player-frame">
          <video
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            controls
            autoPlay
            style={{ width: '100%', height: '100%' }}
          >
            Your browser does not support video playback.
          </video>
        </div>

        {/* Video Title & Actions */}
        <h1 className="watch-title">{video.title}</h1>

        <div className="watch-header-actions">
          <div className="channel-header-info">
            <Link to={`/channel/${channel._id}`}>
              <img
                src={uploader.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={channel.channelName || 'Channel'}
                className="channel-avatar-lg"
              />
            </Link>
            <div>
              <Link to={`/channel/${channel._id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
                {channel.channelName || uploader.username || 'Channel Name'}
              </Link>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {formatViews(subscribersCount)} subscribers
              </div>
            </div>
            <button
              className={isSubscribed ? 'btn-secondary' : 'btn-primary'}
              style={{ marginLeft: '12px' }}
              onClick={handleToggleSubscribe}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="watch-like-bar">
              <button className={`like-btn ${isLiked ? 'active' : ''}`} onClick={handleToggleLike}>
                <ThumbsUp size={18} />
                <span>{likesCount}</span>
              </button>
              <div className="divider-vert" />
              <button className={`dislike-btn ${isDisliked ? 'active' : ''}`} onClick={handleToggleDislike}>
                <ThumbsDown size={18} />
                <span>{dislikesCount > 0 ? dislikesCount : ''}</span>
              </button>
            </div>

            <button className="btn-secondary" style={{ display: 'flex', gap: '6px', alignItems: 'center' }} onClick={() => setIsShareModalOpen(true)}>
              <Share2 size={18} /> Share
            </button>
            <button className="btn-secondary" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Download size={18} /> Download
            </button>
          </div>
        </div>

        {/* Video Description Box */}
        <div className="watch-description-box">
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>
            {formatViews(video.views)} views • Uploaded {new Date(video.uploadDate || video.createdAt).toLocaleDateString()}
          </div>
          <p>{video.description || 'No description provided for this video.'}</p>
        </div>

        {/* Comment Section */}
        <div className="comment-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 600 }}>
            <MessageSquare size={20} />
            <span>{comments.length} Comments</span>
          </div>

          {/* Add Comment Input Form */}
          {user ? (
            <form className="comment-input-box" onSubmit={handleAddComment}>
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={user.username}
                className="uploader-avatar"
              />
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  className="comment-textarea"
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                />
                <div className="comment-actions">
                  <button type="button" className="btn-secondary" onClick={() => setNewCommentText('')}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={!newCommentText.trim()}>
                    <Send size={14} /> Comment
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
              Please <Link to="/login" style={{ color: 'var(--accent-blue)' }}>Sign In</Link> to post comments.
            </div>
          )}

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Up Next Videos */}
      <div className="recommended-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Up next</h3>
        {recommendedVideos.map((rec) => (
          <VideoCard key={rec._id} video={rec} />
        ))}
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        videoTitle={video.title}
      />
    </div>
  );
};
