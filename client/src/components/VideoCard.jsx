import React from 'react';
import { Link } from 'react-router-dom';

const formatViews = (views = 0) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'recently';
  const diffInSeconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

export const VideoCard = ({ video }) => {
  const channel = video.channelId || {};
  const uploader = video.uploader || {};

  return (
    <Link to={`/watch/${video._id}`} className="video-card">
      <div className="thumbnail-wrapper">
        <img
          src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'}
          alt={video.title}
          className="thumbnail-img"
          loading="lazy"
        />
      </div>

      <div className="video-info">
        <img
          src={uploader.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
          alt={channel.channelName || 'Uploader'}
          className="uploader-avatar"
        />
        <div className="video-details">
          <h3 className="video-title" title={video.title}>
            {video.title}
          </h3>
          <div className="channel-name">
            {channel.channelName || uploader.username || 'Channel'}
          </div>
          <div className="video-meta">
            {formatViews(video.views)} views • {formatTimeAgo(video.uploadDate || video.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
};
