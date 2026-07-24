import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

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
    <div className="auth-container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <div className="auth-card card animate-slide-up" style={{ maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', width: '4rem', height: '4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <UserPlus size={32} />
          </div>
          <h2>Join the Network</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create your account</p>
        </div>

        {error && <div style={{ color: 'white', background: 'var(--admin-color)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" name="password" value={formData.password} onChange={handleChange} required minLength={8} />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Min 8 characters with at least 1 letter and 1 number</small>
          </div>

          <div className="form-group">
             <label className="form-label">Select Role</label>
             <select className="form-input" name="role" value={formData.role} onChange={handleChange}>
               <option value="student">Current Student</option>
               <option value="alumni">Alumni</option>
               {/* Admin accounts must be created directly in the database — not via public registration */}
             </select>
          </div>

          {(formData.role === 'student' || formData.role === 'alumni') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Batch (Year)</label>
                <input type="text" className="form-input" name="batch" value={formData.batch} onChange={handleChange} placeholder="e.g. 2024" />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input type="text" className="form-input" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. CSE" />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register Account</button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login here</Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            &larr; Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
