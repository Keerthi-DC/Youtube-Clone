import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Settings, Image, Edit3 } from 'lucide-react';

export const ChannelEditModal = ({ isOpen, onClose, channel, onChannelUpdated }) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelBanner, setChannelBanner] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (channel) {
      setChannelName(channel.channelName || '');
      setDescription(channel.description || '');
      setChannelBanner(channel.channelBanner || '');
    }
  }, [channel]);

  if (!isOpen || !channel) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelName.trim()) {
      setError('Channel name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('yt_token');
      const res = await axios.put(
        `/api/channels/${channel._id}`,
        {
          channelName,
          description,
          channelBanner
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onChannelUpdated(res.data);
      onClose();
    } catch (err) {
      console.error('[Update Channel Error]:', err);
      setError(err.response?.data?.message || 'Error updating channel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 600 }}>
            <Settings size={20} color="var(--accent-blue)" /> Customize Channel Settings
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ color: 'var(--yt-red)', fontSize: '0.85rem', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="auth-label">Channel Name</label>
            <input
              type="text"
              className="auth-input"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="e.g. Code with John"
              required
            />
          </div>

          <div>
            <label className="auth-label">Description / Channel Bio</label>
            <textarea
              className="comment-textarea"
              style={{ width: '100%', minHeight: '80px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your channel..."
            />
          </div>

          <div>
            <label className="auth-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Image size={14} /> Channel Banner Image URL
            </label>
            <input
              type="url"
              className="auth-input"
              value={channelBanner}
              onChange={(e) => setChannelBanner(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {channelBanner && (
            <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', height: '90px' }}>
              <img src={channelBanner} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
