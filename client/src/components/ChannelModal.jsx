import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

export const ChannelModal = ({ isOpen, onClose, onChannelCreated }) => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelBanner, setChannelBanner] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelName.trim()) {
      return setError('Channel name is required');
    }

    try {
      setLoading(true);
      setError('');
      const res = await axios.post('/api/channels', {
        channelName,
        description,
        channelBanner: channelBanner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
      });
      setLoading(false);
      onChannelCreated(res.data);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error creating channel');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Your Channel</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Channel Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Code With Alex"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Tell viewers about your channel..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Channel Banner URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/banner.png"
              value={channelBanner}
              onChange={(e) => setChannelBanner(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
