import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  GraduationCap, Users, Briefcase, BookOpen, MessageSquare,
  LogOut, Search, Send, Filter, X, Star, CheckCircle
} from 'lucide-react';
import axios from 'axios';

const api = (token) => axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'x-auth-token': token }
});

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

// ─── Batch Tracking / Alumni Directory ───────────────────────────────────────
const BatchTracking = ({ token }) => {
  const [alumni, setAlumni] = useState([]);
  const [filters, setFilters] = useState({ batch: '', department: '' });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  const fetchAlumni = async () => {
    const params = {};
    if (filters.batch) params.batch = filters.batch;
    if (filters.department) params.department = filters.department;
    const r = await api(token).get('/users/directory', { params });
    setAlumni(r.data);
  };

  useEffect(() => { fetchAlumni(); }, [filters, token]);

  const filtered = alumni.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  const sendMsg = async () => {
    await api(token).post('/messages', { receiverId: selected._id, content: msgContent });
    setMsgSent(true);
    setTimeout(() => { setSelected(null); setMsgSent(false); setMsgContent(''); }, 1500);
  };

  const depts = [...new Set(alumni.map(a => a.department).filter(Boolean))];

  return (
    <div>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="Search alumni by name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <input className="form-input" style={{ width: '150px' }} placeholder="Batch (e.g. 2022)" value={filters.batch} onChange={e => setFilters({ ...filters, batch: e.target.value })} />
          <select className="form-input" style={{ width: '180px' }} value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })}>
            <option value="">All Departments</option>
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(alum => (
          <div key={alum._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #7C3AED)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, flexShrink: 0 }}>
                {alum.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: 0 }}>{alum.name}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {alum.jobTitle ? `${alum.jobTitle} at ${alum.company || 'N/A'}` : alum.department}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {alum.batch && <span className="badge badge-alumni">Class of {alum.batch}</span>}
              {alum.department && <span className="badge badge-student">{alum.department}</span>}
            </div>
            <button onClick={() => setSelected(alum)} className="btn" style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', fontSize: '0.875rem' }}>
              <MessageSquare size={14} style={{ marginRight: '0.5rem' }} /> Contact for Guidance
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>No alumni found for the selected filters.</p>
        )}
      </div>

      {selected && (
        <Modal title={`Message ${selected.name}`} onClose={() => setSelected(null)}>
          {msgSent ? (
            <div style={{ textAlign: 'center', color: '#10B981', padding: '1rem' }}>
              <CheckCircle size={48} color="#10B981" />
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>Message sent successfully!</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Send a message to {selected.name} for career guidance or mentorship.</p>
              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea className="form-input" rows={5} placeholder="Hi, I'm a student looking for guidance in..." value={msgContent} onChange={e => setMsgContent(e.target.value)} />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={sendMsg} disabled={!msgContent.trim()}>
                <Send size={16} style={{ marginRight: '0.5rem' }} /> Send Message
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

// ─── Mentorship Access ────────────────────────────────────────────────────────
const MentorshipAccess = ({ token }) => {
  const [mentors, setMentors] = useState([]);
  const [requested, setRequested] = useState({});

  useEffect(() => {
    api(token).get('/mentorship').then(r => setMentors(r.data)).catch(console.error);
  }, [token]);

  const request = async (id) => {
    await api(token).put(`/mentorship/${id}/request`);
    setRequested(r => ({ ...r, [id]: true }));
    setMentors(m => m.filter(x => x._id !== id));
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Available Mentors</h3>
        <p style={{ color: 'var(--text-muted)' }}>Alumni who have offered to mentor current students for career guidance.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {mentors.map(m => (
          <div key={m._id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700 }}>
                {m.mentorName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: 0 }}>{m.mentorName}</h4>
                <span className="badge badge-alumni">Alumni</span>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ background: '#e0e7ff', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                <Star size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{m.domain}
              </span>
            </div>
            {m.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{m.description}</p>}
            <button
              onClick={() => request(m._id)}
              disabled={requested[m._id]}
              className="btn btn-primary"
              style={{ width: '100%', background: requested[m._id] ? '#10B981' : 'var(--primary)' }}
            >
              {requested[m._id] ? '✓ Request Sent' : 'Request Mentorship'}
            </button>
          </div>
        ))}
        {mentors.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>No mentors available right now. Check back later.</p>}
      </div>
    </div>
  );
};

// ─── Opportunity Board ────────────────────────────────────────────────────────
const OpportunityBoard = ({ token }) => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const params = filter !== 'all' ? { type: filter } : {};
    api(token).get('/jobs', { params }).then(r => setJobs(r.data)).catch(console.error);
  }, [token, filter]);

  const typeColor = { internship: '#10B981', job: '#4F46E5', referral: '#F59E0B' };
  const typeBg = { internship: '#d1fae5', job: '#e0e7ff', referral: '#fef3c7' };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {['all', 'internship', 'job', 'referral'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn" style={{
            padding: '0.5rem 1.25rem',
            background: filter === f ? 'var(--primary)' : 'var(--bg-color)',
            color: filter === f ? 'white' : 'var(--text-muted)',
            textTransform: 'capitalize', fontWeight: 600
          }}>{f === 'all' ? 'All' : f + 's'}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {jobs.map(job => (
          <div key={job._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ background: typeBg[job.type], color: typeColor[job.type], padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
                  {job.type}
                </span>
                <h4 style={{ margin: 0 }}>{job.title}</h4>
              </div>
              <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{job.company}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{job.description}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {job.location && `📍 ${job.location} • `}Posted by {job.postedByName} • {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
            {job.applyLink && (
              <a href={job.applyLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', marginLeft: '1rem', flexShrink: 0 }}>
                Apply →
              </a>
            )}
          </div>
        ))}
        {jobs.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No opportunities posted yet. Check back soon!</p>}
      </div>
    </div>
  );
};

// ─── Resource Hub ─────────────────────────────────────────────────────────────
const ResourceHub = ({ token }) => {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const params = filter !== 'all' ? { type: filter } : {};
    api(token).get('/resources', { params }).then(r => setResources(r.data)).catch(console.error);
  }, [token, filter]);

  const typeColor = { note: '#4F46E5', announcement: '#F59E0B', update: '#10B981' };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {['all', 'note', 'announcement', 'update'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn" style={{
            padding: '0.5rem 1.25rem',
            background: filter === f ? 'var(--primary)' : 'var(--bg-color)',
            color: filter === f ? 'white' : 'var(--text-muted)', fontWeight: 600
          }}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {resources.map(r => (
          <div key={r._id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ background: typeColor[r.type] + '20', color: typeColor[r.type], padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>{r.type}</span>
              <h4 style={{ margin: 0 }}>{r.title}</h4>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{r.description}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              Posted by {r.uploadedByName} • {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {resources.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No resources available yet.</p>}
      </div>
    </div>
  );
};

// ─── Main Student Portal ───────────────────────────────────────────────────────
const StudentPortal = () => {
  const { user, logout } = useContext(AuthContext);
  const [tab, setTab] = useState('batch');

  const navItems = [
    { id: 'batch', icon: Users, label: 'Alumni Directory' },
    { id: 'mentorship', icon: Star, label: 'Mentorship Access' },
    { id: 'opportunities', icon: Briefcase, label: 'Opportunity Board' },
    { id: 'resources', icon: BookOpen, label: 'Resource Hub' },
  ];

  const tabTitles = {
    batch: 'Alumni Directory & Batch Tracking',
    mentorship: 'Mentorship Access',
    opportunities: 'Opportunity Board',
    resources: 'Resource Hub',
  };

  return (
    <div className="portal-layout">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ background: '#d1fae5', borderRadius: '0.5rem', padding: '0.5rem' }}>
            <GraduationCap size={24} color="var(--student-color)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Student Portal</h3>
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
            <h1 className="page-title">{tabTitles[tab]}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Student Level — Class & Career</p>
          </div>
          <span className="badge badge-student">Current Student</span>
        </div>

        {tab === 'batch' && <BatchTracking token={user.token} />}
        {tab === 'mentorship' && <MentorshipAccess token={user.token} />}
        {tab === 'opportunities' && <OpportunityBoard token={user.token} />}
        {tab === 'resources' && <ResourceHub token={user.token} />}
      </main>
    </div>
  );
};

export default StudentPortal;
