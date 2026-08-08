import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

export const VideoModal = ({ isOpen, onClose, onVideoSaved, initialData = null, channelId }) => {
  const [title, setTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setThumbnailUrl(initialData.thumbnailUrl || '');
      setVideoUrl(initialData.videoUrl || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Coding');
    } else {
      setTitle('');
      setThumbnailUrl('');
      setVideoUrl('');
      setDescription('');
      setCategory('Coding');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !thumbnailUrl || !videoUrl) {
      return setError('Title, Thumbnail URL, and Video URL are required');
    }

    try {
      setLoading(true);
      setError('');
      let res;
      if (initialData) {
        // Edit video
        res = await axios.put(`/api/videos/${initialData._id}`, {
          title,
          thumbnailUrl,
          videoUrl,
          description,
          category
        });
      } else {
        // Create video
        res = await axios.post('/api/videos', {
          title,
          thumbnailUrl,
          videoUrl,
          description,
          category,
          channelId
        });
      }
      setLoading(false);
      onVideoSaved(res.data);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error saving video');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Video Details' : 'Upload New Video'}</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Video Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Learn React 19 in 30 Minutes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Thumbnail Image URL *</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Video Stream/MP4 URL *</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://commondatastorage.googleapis.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Coding">Coding</option>
              <option value="React">React</option>
              <option value="Music">Music</option>
              <option value="Gaming">Gaming</option>
              <option value="News">News</option>
              <option value="Podcasts">Podcasts</option>
              <option value="Tech">Tech</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Describe your video content..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : initialData ? 'Update Video' : 'Publish Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
