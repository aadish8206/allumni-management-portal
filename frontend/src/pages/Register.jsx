import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, ArrowLeft, Mail, Lock, User, GraduationCap, Building } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    batch: '',
    department: ''
  });
  const [error, setError] = useState('');
  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}-portal`, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend password strength validation
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }
    if (!/[a-zA-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      return setError('Password must contain at least one letter and one number');
    }

    const result = await register(formData);
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
      justify: 'center',
      padding: '2.5rem 1rem',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #E2E8F0'
      }}>
        {/* Branding Header */}
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
            <UserPlus size={36} />
          </div>
          <h2 style={{ color: '#0F172A', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Join Alumni Network
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Create your institutional portal account</p>
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
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
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

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#334155', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Institutional Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#334155', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
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
            <small style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.4rem', display: 'block' }}>
              Min 8 characters with at least 1 letter and 1 number
            </small>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#334155', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: '10px',
                color: '#0F172A',
                fontSize: '0.95rem',
                outline: 'none',
                fontWeight: 500
              }}
            >
              <option value="student">Current Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          {(formData.role === 'student' || formData.role === 'alumni') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: '#334155', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Batch (Year)
                </label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="e.g. 2024"
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

              <div>
                <label style={{ display: 'block', color: '#334155', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Department
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. CSE"
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
            </div>
          )}

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
            Register Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748B', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#1E3A8A', fontWeight: 700, textDecoration: 'none' }}>Sign In here</Link>
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

export default Register;
