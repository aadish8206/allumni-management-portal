import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Shield, Users, Database, BarChart2, IndianRupee, Megaphone,
  LogOut, CheckCircle, Trash2, Bell, BookOpen, TrendingUp, X, Home, Send
} from 'lucide-react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const api = (token) => axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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

  const pieData = [
    { name: 'Students', value: stats.totalStudents || 0 },
    { name: 'Verified Alumni', value: stats.verifiedAlumni || 0 },
    { name: 'Pending Alumni', value: (stats.totalAlumni || 0) - (stats.verifiedAlumni || 0) },
  ];
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard icon={Users} label="Total Alumni" value={stats.totalAlumni || 0} color="#F59E0B" />
        <StatCard icon={BookOpen} label="Total Students" value={stats.totalStudents || 0} color="#10B981" />
        <StatCard icon={CheckCircle} label="Verified Alumni" value={stats.verifiedAlumni || 0} color="#4F46E5" />
        <StatCard icon={Bell} label="Pending Verification" value={stats.pendingVerification || 0} color="#EF4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '1rem', width: '100%', textAlign: 'left' }}>User Distribution</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
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
                    {u.role === 'admin' ? '-' : (u.isVerified
                      ? <span style={{ color: '#10B981', fontWeight: 600, fontSize: '0.875rem' }}>✓ Verified</span>
                      : <span style={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.875rem' }}>Pending</span>
                    )}
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
    </div>
  );
};

// ─── Fundraising Tab ──────────────────────────────────────────────────────────
const FundraisingTab = ({ token }) => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({ title: '', description: '', targetAmount: '', deadline: '' });

  useEffect(() => {
    api(token).get('/donations').then(r => setDonations(r.data)).catch(console.error);
    api(token).get('/donations/stats').then(r => setStats(r.data)).catch(console.error);
    api(token).get('/campaigns').then(r => setCampaigns(r.data)).catch(console.error);
  }, [token]);

  const total = donations.reduce((s, d) => s + d.amount, 0);

  const createCampaign = async () => {
    if (!newCampaign.title || !newCampaign.targetAmount) return alert('Title and Target Amount are required');
    try {
      const r = await api(token).post('/campaigns', newCampaign);
      setCampaigns([r.data, ...campaigns]);
      setNewCampaign({ title: '', description: '', targetAmount: '', deadline: '' });
    } catch (err) {
      console.error(err);
      alert('Error creating campaign');
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard icon={IndianRupee} label="Total Donations Received" value={`₹${total.toLocaleString()}`} color="#10B981" />
        <StatCard icon={TrendingUp} label="Active Campaigns" value={campaigns.filter(c => c.status === 'active').length} color="#4F46E5" />
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Create New Campaign</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Campaign Title</label>
            <input className="form-input" value={newCampaign.title} onChange={e => setNewCampaign({...newCampaign, title: e.target.value})} placeholder="e.g. Library Fund" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Target Amount (₹)</label>
            <input type="number" className="form-input" value={newCampaign.targetAmount} onChange={e => setNewCampaign({...newCampaign, targetAmount: e.target.value})} placeholder="50000" />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Deadline</label>
            <input type="date" className="form-input" value={newCampaign.deadline} onChange={e => setNewCampaign({...newCampaign, deadline: e.target.value})} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description</label>
            <input className="form-input" value={newCampaign.description} onChange={e => setNewCampaign({...newCampaign, description: e.target.value})} placeholder="Short description..." />
          </div>
          <button className="btn btn-primary" onClick={createCampaign}>Create</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Active Campaigns</h3>
          {campaigns.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No campaigns created yet.</p> : campaigns.map(c => {
            const progress = Math.min(100, Math.round((c.raisedAmount / c.targetAmount) * 100));
            return (
              <div key={c._id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>{c.title}</span>
                  <span style={{ fontSize: '0.875rem', color: c.status === 'active' ? '#10B981' : 'var(--text-muted)' }}>{c.status.toUpperCase()}</span>
                </div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{c.description}</p>
                <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #10B981, #34D399)' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <span>Raised: <strong>₹{c.raisedAmount.toLocaleString()}</strong></span>
                  <span>Goal: <strong>₹{c.targetAmount.toLocaleString()}</strong></span>
                </div>
              </div>
            );
          })}
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
  const [form, setForm] = useState({ title: '', description: '', type: 'announcement', fileUrl: '', fileName: '' });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, fileUrl: reader.result, fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    api(token).get('/resources').then(r => setResources(r.data)).catch(console.error);
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    const res = await api(token).post('/resources', { ...form, uploadedByName: userName });
    setResources(r => [res.data, ...r]);
    setShowForm(false);
    setForm({ title: '', description: '', type: 'announcement', fileUrl: '', fileName: '' });
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
            <div className="form-group" style={{ padding: '1rem', border: '1px dashed var(--primary)', borderRadius: '0.5rem', background: 'var(--bg-color)' }}>
              <label className="form-label">Attach File (Optional PDF/Image)</label>
              <input type="file" onChange={handleFileUpload} style={{ display: 'block', marginTop: '0.5rem' }} />
              {form.fileName && <p style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.5rem' }}>✓ {form.fileName} selected</p>}
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
              {r.fileUrl && (
                <a href={r.fileUrl} download={r.title || 'file'} className="btn btn-primary" style={{ marginTop: '0.75rem', padding: '0.3rem 0.75rem', fontSize: '0.75rem', display: 'inline-block', textDecoration: 'none' }}>
                  📄 View Attached File
                </a>
              )}
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

// ─── Student Resumes Tab ──────────────────────────────────────────────────────
const StudentResumes = ({ token }) => {
  const [students, setStudents] = useState([]);
  const [alumniList, setAlumniList] = useState([]);
  const [forwarding, setForwarding] = useState(null);
  const [msg, setMsg] = useState('');
  const [receiverId, setReceiverId] = useState('');

  useEffect(() => {
    api(token).get('/users/admin/users').then(r => {
      setStudents(r.data.filter(u => u.role === 'student' && u.resumeBase64));
    }).catch(console.error);
    api(token).get('/users/directory').then(r => setAlumniList(r.data)).catch(console.error);
  }, [token]);

  const forward = async () => {
    await api(token).post('/messages', {
      receiverId,
      content: msg || `Please review the attached resume for ${forwarding.name}.`,
      attachedResumeId: forwarding._id
    });
    setForwarding(null);
    setMsg('');
    setReceiverId('');
    alert('Resume forwarded successfully!');
  };

  const deleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api(token).delete(`/users/admin/resume/${id}`);
      setStudents(students.filter(s => s._id !== id));
      alert('Resume deleted successfully.');
    } catch (err) {
      alert('Could not delete resume.');
    }
  };

  return (
    <div>
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Student Resumes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Student Name</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Department</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Resume</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{s.name}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{s.department || '-'}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <a href={s.resumeBase64} download={s.resumeFileName || 'resume.pdf'} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View PDF</a>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginRight: '0.5rem' }} onClick={() => setForwarding(s)}>
                    Forward to Alumni
                  </button>
                  <button onClick={() => deleteResume(s._id)} style={{ background: '#fee2e2', color: '#EF4444', border: 'none', borderRadius: '0.375rem', padding: '0.4rem 0.6rem', cursor: 'pointer', fontSize: '0.8rem' }} title="Delete Resume">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No student resumes uploaded yet.</p>}
      </div>

      {forwarding && (
        <Modal title={`Forward ${forwarding.name}'s Resume`} onClose={() => setForwarding(null)}>
          <div className="form-group">
            <label className="form-label">Select Alumni</label>
            <select className="form-input" value={receiverId} onChange={e => setReceiverId(e.target.value)}>
              <option value="">Choose an Alumni...</option>
              {alumniList.map(a => <option key={a._id} value={a._id}>{a.name} ({a.jobTitle || a.department})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Message (Optional)</label>
            <textarea className="form-input" rows={3} value={msg} onChange={e => setMsg(e.target.value)} placeholder="Take a look at this candidate..." />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={!receiverId} onClick={forward}>
            <Send size={16} style={{ marginRight: 8 }} /> Send Resume
          </button>
        </Modal>
      )}
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
    { id: 'resumes', icon: BookOpen, label: 'Student Resumes' },
    { id: 'fundraising', icon: IndianRupee, label: 'Fundraising Tools' },
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
        <button onClick={() => window.location.href = '/'} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '0.5rem' }}>
          <div className="nav-item"><Home size={20} /> Back to Home</div>
        </button>
        <button onClick={logout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
          <div className="nav-item" style={{ color: '#ef4444' }}><LogOut size={20} /> Logout</div>
        </button>
      </aside>

      <main className="main-content animate-fade-in">
        <div className="header">
          <div>
            <h1 className="page-title">
              {tab === 'users' ? 'User Management' : tab === 'resumes' ? 'Student Resumes' : tab === 'fundraising' ? 'Fundraising & Donations' : 'Resources & Accreditation'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Institute Level — Full Control</p>
          </div>
          <span className="badge badge-admin">Administrator</span>
        </div>

        <div className="animate-slide-up delay-100">
          {tab === 'users' && <UserManagement token={user.token} stats={stats} />}
          {tab === 'resumes' && <StudentResumes token={user.token} />}
          {tab === 'fundraising' && <FundraisingTab token={user.token} />}
          {tab === 'resources' && <ResourcesTab token={user.token} userName={user.name} />}
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
