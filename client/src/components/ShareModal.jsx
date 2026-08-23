import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

export const ShareModal = ({ isOpen, onClose, videoTitle, videoUrl }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const link = videoUrl || window.location.href;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 600 }}>
            <Share2 size={20} color="var(--yt-red)" /> Share Video
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          {videoTitle || 'Share this video with friends and social networks:'}
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            readOnly
            value={videoUrl || window.location.href}
            className="auth-input"
            style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)' }}
          />
          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 16px', whiteSpace: 'nowrap' }}
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <Check size={16} /> Copied!
              </>
            ) : (
              <>
                <Copy size={16} /> Copy
              </>
            )}
          </button>
        </div>

        {copied && (
          <div
            style={{
              marginTop: '16px',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#22c55e',
              fontSize: '0.85rem',
              textAlign: 'center',
              fontWeight: 500
            }}
          >
            Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};
