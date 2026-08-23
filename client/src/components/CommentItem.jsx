import React, { useState } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Check, X, ThumbsUp, MessageSquare, Send } from 'lucide-react';
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
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [likesCount, setLikesCount] = useState(comment.likes ? comment.likes.length : 0);
  const [isLiked, setIsLiked] = useState(
    user && comment.likes ? comment.likes.some((uId) => (uId._id || uId) === user._id) : false
  );
  const [replies, setReplies] = useState(comment.replies || []);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const author = comment.userId || {};
  const isAuthor = user && (author._id === user._id || author === user._id);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    await onUpdateComment(comment._id, editText);
    setIsEditing(false);
  };

  const handleToggleLikeComment = async () => {
    if (!user) return alert('Please sign in to like comments');
    try {
      const token = localStorage.getItem('yt_token');
      const res = await axios.post(
        `/api/comments/${comment._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLikesCount(res.data.likesCount);
      setIsLiked(res.data.isLiked);
    } catch (err) {
      console.error('[Like Comment Error]:', err);
    }
  };

  const handlePostReply = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please sign in to reply');
    if (!replyText.trim()) return;

    try {
      const token = localStorage.getItem('yt_token');
      const res = await axios.post(
        `/api/comments/${comment._id}/reply`,
        { text: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplies(res.data.replies || []);
      setReplyText('');
      setIsReplying(false);
    } catch (err) {
      console.error('[Add Reply Error]:', err);
    }
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
          <>
            <p className="comment-text">{comment.text}</p>

            {/* Comment Action Controls (Like & Reply) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: isLiked ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
                onClick={handleToggleLikeComment}
              >
                <ThumbsUp size={14} />
                <span>{likesCount > 0 ? likesCount : ''}</span>
              </button>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
                onClick={() => setIsReplying(!isReplying)}
              >
                <MessageSquare size={14} />
                <span>Reply</span>
              </button>
            </div>

            {/* Inline Reply Input Form */}
            {isReplying && (
              <form onSubmit={handlePostReply} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="comment-textarea"
                  style={{ fontSize: '0.85rem' }}
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                  <Send size={12} /> Reply
                </button>
              </form>
            )}

            {/* Nested Reply Threads */}
            {replies.length > 0 && (
              <div style={{ marginTop: '12px', paddingLeft: '16px', borderLeft: '2px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {replies.map((reply, idx) => {
                  const replyAuthor = reply.userId || {};
                  return (
                    <div key={reply._id || idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <img
                        src={replyAuthor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={replyAuthor.username || 'User'}
                        style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.8rem' }}>
                          <span style={{ fontWeight: 600 }}>@{replyAuthor.username || 'User'}</span>
                          <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>{formatTimeAgo(reply.createdAt)}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', marginTop: '2px', color: 'var(--text-primary)' }}>{reply.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
