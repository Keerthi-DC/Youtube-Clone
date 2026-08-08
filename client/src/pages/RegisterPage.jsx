import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, X, ShieldCheck } from 'lucide-react';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password Validation Checklist Rules
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@$!%*?&^#()_-]/.test(password);

  const isValidPassword = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPassword) {
      return setError('Please meet all password strength requirements below.');
    }

    try {
      setLoading(true);
      setError('');
      const data = await register(username, email, password, avatar);
      setSuccess(data.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ color: 'var(--accent-red)', fontSize: '2.5rem', marginBottom: '8px' }}>
            <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <h2>Create Your YouTube Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Sign up to upload videos, like content, and join discussions
          </p>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. JohnDoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Password Checklist UI */}
          <div
            style={{
              background: 'var(--bg-tertiary)',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Password Requirements:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: hasMinLength ? '#2ecc71' : 'var(--text-secondary)' }}>
                {hasMinLength ? <Check size={14} inline /> : <X size={14} inline />} At least 8 characters
              </span>
              <span style={{ color: hasUpper ? '#2ecc71' : 'var(--text-secondary)' }}>
                {hasUpper ? <Check size={14} inline /> : <X size={14} inline />} At least one uppercase letter (A-Z)
              </span>
              <span style={{ color: hasLower ? '#2ecc71' : 'var(--text-secondary)' }}>
                {hasLower ? <Check size={14} inline /> : <X size={14} inline />} At least one lowercase letter (a-z)
              </span>
              <span style={{ color: hasNumber ? '#2ecc71' : 'var(--text-secondary)' }}>
                {hasNumber ? <Check size={14} inline /> : <X size={14} inline />} At least one number (0-9)
              </span>
              <span style={{ color: hasSpecial ? '#2ecc71' : 'var(--text-secondary)' }}>
                {hasSpecial ? <Check size={14} inline /> : <X size={14} inline />} At least one special character (@$!%*?& etc.)
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL (Optional)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://images.unsplash.com/..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
