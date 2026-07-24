import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, CheckCircle, KeyRound, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return setError('Password must contain at least one letter and one number');
    }

    setLoading(true);

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to reset password. The link may have expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #0F172A 100%)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
            color: 'white',
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)'
          }}>
            <KeyRound size={36} />
          </div>
          <h2 style={{ color: '#0F172A', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Set New Password
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Enter and confirm your new account password</p>
        </div>

        {error && (
          <div style={{
            color: '#991B1B',
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            padding: '0.875rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 500
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <CheckCircle size={56} color="#059669" style={{ margin: '0 auto 1.25rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>Password Updated!</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Your password has been securely updated. Redirecting you to login...
            </p>
            <Link to="/login" style={{
              display: 'inline-block',
              width: '100%',
              padding: '0.875rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
              color: 'white',
              fontWeight: 700,
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)'
            }}>
              Sign In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', color: '#334155', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.75rem',
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    color: '#0F172A',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#334155', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.75rem',
                    background: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    color: '#0F172A',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '10px',
                border: 'none',
                background: loading ? '#CBD5E1' : 'linear-gradient(135deg, #1E3A8A, #2563EB)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
