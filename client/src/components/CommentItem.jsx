import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'recently';
  const diffInSeconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export const CommentItem = ({ comment, onUpdateComment, onDeleteComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const { user } = useAuth();

  const author = comment.userId || {};
  const isAuthor = user && (author._id === user._id || author === user._id);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    await onUpdateComment(comment._id, editText);
    setIsEditing(false);
  };

  return (
    <div className="comment-card">
      <img
        src={author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
        alt={author.username || 'User'}
        className="uploader-avatar"
      />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="comment-author">@{author.username || 'Anonymous'}</span>
            <span className="comment-time">{formatTimeAgo(comment.timestamp || comment.createdAt)}</span>
          </div>

          {isAuthor && !isEditing && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="icon-btn"
                style={{ width: '28px', height: '28px' }}
                onClick={() => setIsEditing(true)}
                title="Edit comment"
              >
                <Edit2 size={14} />
              </button>
              <button
                className="icon-btn"
                style={{ width: '28px', height: '28px', color: '#ff6b6b' }}
                onClick={() => onDeleteComment(comment._id)}
                title="Delete comment"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div style={{ marginTop: '8px' }}>
            <input
              type="text"
              className="comment-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setIsEditing(false)}>
                <X size={14} /> Cancel
              </button>
              <button className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={handleSaveEdit}>
                <Check size={14} /> Save
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}
      </div>
    </div>
  );
};
