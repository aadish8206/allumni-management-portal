import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}-portal`, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate(`/${result.role}-portal`);
    } else {
      setError(result.msg);
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
        {/* Header Branding */}
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
            <GraduationCap size={36} />
          </div>
          <h2 style={{ color: '#0F172A', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Portal Sign In
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Alumni & Student Network Access</p>
        </div>

        {error && (
          <div style={{
            color: '#991B1B',
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            padding: '0.875rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#334155', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Institutional Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@institution.edu"
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
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Link to="/forgot-password" style={{ color: '#1E3A8A', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)',
            transition: 'all 0.2s ease'
          }}>
            Sign In to Portal
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '0.75rem',
          marginTop: '1.75rem',
          fontSize: '0.8rem',
          color: '#64748B'
        }}>
          <ShieldCheck size={16} color="#059669" />
          <span>Protected by Institutional JWT Authentication</span>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748B', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#1E3A8A', fontWeight: 700, textDecoration: 'none' }}>Register Network Account</Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: '#64748B', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
