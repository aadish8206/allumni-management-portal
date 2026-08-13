import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, CheckCircle, KeyRound, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      setSuccess(true);
      setMessage(res.data.msg);
      // Start 60-second resend cooldown
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Forgot password error:', err.response?.data);
      setError(err.response?.data?.msg || 'Failed to send password reset email. Please verify your email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend. Please try again.');
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
      justifyContent: 'center',
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
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 8px 20px rgba(30, 58, 138, 0.25)'
          }}>
            <KeyRound size={36} />
          </div>
          <h2 style={{ color: '#0F172A', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Reset Password
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Enter your institutional email to receive a reset link
          </p>
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>Check Your Email</h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              We have dispatched a password reset link to <strong>{email}</strong>. The link remains valid for <strong>10 minutes</strong>.
            </p>
            {error && (
              <div style={{
                color: '#991B1B',
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                marginBottom: '1rem',
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
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                background: 'transparent',
                color: resendCooldown > 0 ? '#94A3B8' : '#1E3A8A',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: resendCooldown > 0 || loading ? 'not-allowed' : 'pointer',
                marginBottom: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Resending...' : resendCooldown > 0 ? `Resend Email (${resendCooldown}s)` : 'Resend Email'}
            </button>
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
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#334155', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Institutional Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="email"
                  required
                  placeholder="name@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              disabled={loading || !email}
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
              {loading ? 'Dispatching Reset Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link to="/login" style={{ color: '#64748B', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
