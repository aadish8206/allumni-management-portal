import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Shield, Users, Database, BarChart2, DollarSign, Megaphone,
  LogOut, CheckCircle, Trash2, Bell, BookOpen, TrendingUp, X
} from 'lucide-react';
import axios from 'axios';

const api = (token) => axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'x-auth-token': token }
});

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ background: color + '20', borderRadius: '0.75rem', padding: '1rem' }}>
      <Icon size={28} color={color} />
    </div>
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{label}</p>
      <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{value}</h2>
    </div>
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
    <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── User Management Tab ──────────────────────────────────────────────────────
const UserManagement = ({ token, stats }) => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api(token).get('/users/admin/users').then(r => setUsers(r.data)).catch(console.error);
  }, [token]);

  const verify = async (id) => {
    await api(token).put(`/users/admin/verify/${id}`);
    setUsers(u => u.map(x => x._id === id ? { ...x, isVerified: true } : x));
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api(token).delete(`/users/admin/users/${id}`);
    setUsers(u => u.filter(x => x._id !== id));
  };

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);
  const roleColor = { admin: '#EF4444', student: '#10B981', alumni: '#F59E0B' };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard icon={Users} label="Total Alumni" value={stats.totalAlumni || 0} color="#F59E0B" />
        <StatCard icon={BookOpen} label="Total Students" value={stats.totalStudents || 0} color="#10B981" />
        <StatCard icon={CheckCircle} label="Verified Alumni" value={stats.verifiedAlumni || 0} color="#4F46E5" />
        <StatCard icon={Bell} label="Pending Verification" value={stats.pendingVerification || 0} color="#EF4444" />
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'student', 'alumni', 'admin'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn" style={{
              padding: '0.5rem 1rem', fontSize: '0.875rem',
              background: filter === f ? 'var(--primary)' : 'var(--bg-color)',
              color: filter === f ? 'white' : 'var(--text-muted)'
            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                {['Name', 'Email', 'Role', 'Batch', 'Department', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{u.batch || '-'}</td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{u.department || '-'}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {u.isVerified
                      ? <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.875rem' }}>✓ Verified</span>
                      : <span style={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.875rem' }}>Pending</span>
                    }
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!u.isVerified && u.role !== 'admin' && (
                        <button onClick={() => verify(u._id)} style={{ background: '#d1fae5', color: '#10B981', border: 'none', borderRadius: '0.375rem', padding: '0.375rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                          Verify
                        </button>
                      )}
                      <button onClick={() => deleteUser(u._id)} style={{ background: '#fee2e2', color: '#EF4444', border: 'none', borderRadius: '0.375rem', padding: '0.375rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '1.5rem', textAlign: 'center' }}>No users found.</p>}
        </div>
      </div>
    </div>
  );
};

// ─── Fundraising Tab ──────────────────────────────────────────────────────────
const FundraisingTab = ({ token }) => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api(token).get('/donations').then(r => setDonations(r.data)).catch(console.error);
    api(token).get('/donations/stats').then(r => setStats(r.data)).catch(console.error);
  }, [token]);

  const total = donations.reduce((s, d) => s + d.amount, 0);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard icon={DollarSign} label="Total Donations Received" value={`₹${total.toLocaleString()}`} color="#10B981" />
        <StatCard icon={TrendingUp} label="Active Projects" value={stats.length} color="#4F46E5" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Project-wise Totals</h3>
          {stats.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No donation data yet.</p> : stats.map(s => (
            <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 600 }}>{s._id}</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>₹{s.total.toLocaleString()} ({s.count} donors)</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Donations</h3>
          {donations.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No donations yet.</p> : donations.slice(0, 8).map(d => (
            <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>{d.donorName}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{d.project}</p>
              </div>
              <span style={{ color: '#10B981', fontWeight: 700 }}>₹{d.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Resources/Accreditation Tab ──────────────────────────────────────────────
const ResourcesTab = ({ token, userName }) => {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'announcement' });

  useEffect(() => {
    api(token).get('/resources').then(r => setResources(r.data)).catch(console.error);
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await api(token).post('/resources', { ...form, uploadedByName: userName });
    setResources(r => [res.data, ...r]);
    setShowForm(false);
    setForm({ title: '', description: '', type: 'announcement' });
  };

  const del = async (id) => {
    await api(token).delete(`/resources/${id}`);
    setResources(r => r.filter(x => x._id !== id));
  };

  const typeColor = { note: '#4F46E5', announcement: '#F59E0B', update: '#10B981' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Campus Resources & Announcements</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Megaphone size={16} style={{ marginRight: 8 }} /> Post Announcement</button>
      </div>

      {showForm && (
        <Modal title="Post New Resource / Announcement" onClose={() => setShowForm(false)}>
          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="announcement">Announcement</option>
                <option value="note">Study Note</option>
                <option value="update">Campus Update</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description / Content</label>
              <textarea className="form-input" rows={4} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Post</button>
          </form>
        </Modal>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {resources.map(r => (
          <div key={r._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ background: typeColor[r.type] + '20', color: typeColor[r.type], borderRadius: '9999px', padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}>{r.type}</span>
                <p style={{ fontWeight: 700, margin: 0 }}>{r.title}</p>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{r.description}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Posted by {r.uploadedByName} • {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => del(r._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={18} /></button>
          </div>
        ))}
        {resources.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No resources posted yet.</p>}
      </div>
    </div>
  );
};

// ─── Main Admin Portal ────────────────────────────────────────────────────────
const AdminPortal = () => {
  const { user, logout } = useContext(AuthContext);
  const [tab, setTab] = useState('users');
  const [stats, setStats] = useState({});

  useEffect(() => {
    api(user.token).get('/users/admin/stats').then(r => setStats(r.data)).catch(console.error);
  }, [user.token]);

  const navItems = [
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'fundraising', icon: DollarSign, label: 'Fundraising Tools' },
    { id: 'resources', icon: Database, label: 'Resources & Accreditation' },
  ];

  return (
    <div className="portal-layout">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ background: '#fee2e2', borderRadius: '0.5rem', padding: '0.5rem' }}>
            <Shield size={24} color="var(--admin-color)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Admin Panel</h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.name}</p>
          </div>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
              <div className={`nav-item ${tab === item.id ? 'active' : ''}`}>
                <item.icon size={20} /> {item.label}
              </div>
            </button>
          ))}
        </nav>
        <button onClick={logout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
          <div className="nav-item" style={{ color: '#ef4444' }}><LogOut size={20} /> Logout</div>
        </button>
      </aside>

      <main className="main-content">
        <div className="header">
          <div>
            <h1 className="page-title">
              {tab === 'users' ? 'User Management' : tab === 'fundraising' ? 'Fundraising & Donations' : 'Resources & Accreditation'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Institute Level — Full Control</p>
          </div>
          <span className="badge badge-admin">Administrator</span>
        </div>

        {tab === 'users' && <UserManagement token={user.token} stats={stats} />}
        {tab === 'fundraising' && <FundraisingTab token={user.token} />}
        {tab === 'resources' && <ResourcesTab token={user.token} userName={user.name} />}
      </main>
    </div>
  );
};

export default AdminPortal;
