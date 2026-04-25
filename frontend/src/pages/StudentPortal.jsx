import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  GraduationCap, Users, Briefcase, BookOpen, MessageSquare,
  LogOut, Search, Send, Filter, X, Star, CheckCircle, Home
} from 'lucide-react';
import axios from 'axios';

const api = (token) => axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
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
  const [filters, setFilters] = useState({ batch: '', department: '', company: '', role: '', location: '' });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchAlumni = async () => {
    const params = {};
    if (filters.batch) params.batch = filters.batch;
    if (filters.department) params.department = filters.department;
    const r = await api(token).get('/users/directory', { params });
    setAlumni(r.data);
  };

  useEffect(() => { fetchAlumni(); }, [filters.batch, filters.department, token]);

  const filtered = alumni.filter(a => {
    const matchName = a.name.toLowerCase().includes(search.toLowerCase());
    const matchCompany = !filters.company || (a.company || '').toLowerCase().includes(filters.company.toLowerCase());
    const matchRole = !filters.role || (a.jobTitle || '').toLowerCase().includes(filters.role.toLowerCase());
    const matchLocation = !filters.location || (a.location || '').toLowerCase().includes(filters.location.toLowerCase());
    return matchName && matchCompany && matchRole && matchLocation;
  });

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
          <button className="btn" style={{ background: showFilters ? 'var(--primary)' : 'var(--bg-color)', color: showFilters ? 'white' : 'var(--text-muted)' }} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} style={{ marginRight: 8 }} /> Filters
          </button>
        </div>
        
        {showFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <input className="form-input" placeholder="Batch (e.g. 2022)" value={filters.batch} onChange={e => setFilters({ ...filters, batch: e.target.value })} />
            <select className="form-input" value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })}>
              <option value="">All Departments</option>
              {depts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input className="form-input" placeholder="Company" value={filters.company} onChange={e => setFilters({ ...filters, company: e.target.value })} />
            <input className="form-input" placeholder="Role/Job Title" value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })} />
            <input className="form-input" placeholder="Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
          </div>
        )}
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
  const [studentSkills, setStudentSkills] = useState([]);

  useEffect(() => {
    api(token).get('/users/me').then(r => setStudentSkills(r.data.skills || [])).catch(console.error);
    api(token).get('/mentorship').then(r => setMentors(r.data)).catch(console.error);
  }, [token]);

  const request = async (id) => {
    await api(token).put(`/mentorship/${id}/request`);
    setRequested(r => ({ ...r, [id]: true }));
    setMentors(m => m.filter(x => x._id !== id));
  };

  const calculateMatch = (mentorSkills) => {
    if (!studentSkills.length || !mentorSkills || !mentorSkills.length) return 0;
    const overlap = mentorSkills.filter(s => studentSkills.some(ss => ss.toLowerCase() === s.toLowerCase()));
    return Math.round((overlap.length / studentSkills.length) * 100);
  };

  const sortedMentors = [...mentors].sort((a, b) => calculateMatch(b.mentor?.skills) - calculateMatch(a.mentor?.skills));

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Available Mentors</h3>
        <p style={{ color: 'var(--text-muted)' }}>Alumni who have offered to mentor current students for career guidance. Mentors are sorted by how well their skills match yours!</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {sortedMentors.map(m => {
          const matchScore = calculateMatch(m.mentor?.skills);
          return (
          <div key={m._id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700 }}>
                {m.mentorName?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{m.mentorName}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-alumni">Alumni</span>
                  {matchScore > 0 && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', background: '#d1fae5', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>{matchScore}% Match</span>}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ background: '#e0e7ff', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
                <Star size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{m.domain}
              </span>
            </div>
            {m.mentor?.skills && m.mentor.skills.length > 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}><strong>Skills:</strong> {m.mentor.skills.join(', ')}</p>
            )}
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
        )})}
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

// ─── Student Profile & Resume ───────────────────────────────────────────────────
const StudentProfile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api(token).get('/users/me').then(r => { setProfile(r.data); setForm(r.data); }).catch(console.error);
  }, [token]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, resumeBase64: reader.result, resumeFileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setUploading(true);
    try {
      const payload = { ...form };
      if (typeof payload.skills === 'string') {
        payload.skills = payload.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
      const r = await api(token).put('/users/me', payload);
      setProfile(r.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Resume file might be too large.');
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return <p style={{ color: 'var(--text-muted)' }}>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '700px' }}>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #3B82F6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{profile.name}</h2>
              <span className="badge badge-student" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Student • {profile.batch || 'N/A'} • {profile.department || 'N/A'}</span>
              {profile.location && <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>📍 {profile.location}</p>}
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="btn" style={{ background: editing ? '#fee2e2' : 'var(--bg-color)', color: editing ? '#EF4444' : 'var(--text-muted)' }}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Edit Details & Resume</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Batch (Year)</label>
              <input type="text" className="form-input" value={form.batch || ''} onChange={e => setForm({ ...form, batch: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" className="form-input" value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" className="form-input" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" className="form-input" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Skills (comma separated)</label>
              <input type="text" className="form-input" value={Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || ''} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, UI/UX" />
            </div>
          </div>
          
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Bio / Objective</label>
            <textarea className="form-input" rows={3} value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div className="form-group" style={{ marginTop: '1rem', padding: '1rem', border: '1px dashed var(--primary)', borderRadius: '0.5rem', background: 'var(--bg-color)' }}>
            <label className="form-label">Upload Resume (PDF Only)</label>
            <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: 'block', marginTop: '0.5rem' }} />
            {form.resumeFileName && <p style={{ fontSize: '0.8rem', color: '#10B981', marginTop: '0.5rem' }}>✓ Selected: {form.resumeFileName}</p>}
          </div>

          <button onClick={save} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={uploading}>
            {uploading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Profile Details</h3>
          <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: 600, width: '120px', color: 'var(--text-muted)' }}>Email</span>
            <span>{profile.email}</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: 600, width: '120px', color: 'var(--text-muted)' }}>Phone</span>
            <span>{profile.phone || 'Not set'}</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: 600, width: '120px', color: 'var(--text-muted)' }}>Bio</span>
            <span>{profile.bio || 'Not set'}</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, width: '120px', color: 'var(--text-muted)' }}>Resume</span>
            {profile.resumeBase64 ? (
              <a href={profile.resumeBase64} download={profile.resumeFileName || 'resume.pdf'} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                Download PDF
              </a>
            ) : (
              <span style={{ color: '#EF4444' }}>No resume uploaded</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Resource Hub ─────────────────────────────────────────────────────────────
const ResourceHub = ({ token }) => {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('all');
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    const params = filter !== 'all' ? { type: filter } : {};
    api(token).get('/resources', { params }).then(r => setResources(r.data)).catch(console.error);
  }, [token, filter]);

  const openPreview = (base64, title) => {
    try {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPreviewFile({ url, title });
    } catch (e) {
      setPreviewFile({ url: base64, title });
    }
  };

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

      {previewFile && (
        <Modal title={previewFile.title} onClose={() => setPreviewFile(null)}>
          <iframe src={previewFile.url} title="Preview" style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '0.5rem' }} />
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <a href={previewFile.url} download={previewFile.title} className="btn btn-primary">Download Copy</a>
          </div>
        </Modal>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {resources.map(r => (
          <div key={r._id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ background: typeColor[r.type] + '20', color: typeColor[r.type], padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>{r.type}</span>
              <h4 style={{ margin: 0 }}>{r.title}</h4>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{r.description}</p>
            {r.fileUrl && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={() => openPreview(r.fileUrl, r.title)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  👁️ Preview
                </button>
                <a href={r.fileUrl} download={r.title || 'file'} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--bg-color)', textDecoration: 'none' }}>
                  💾 Download
                </a>
              </div>
            )}
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
    { id: 'profile', icon: Users, label: 'My Profile & Resume' },
    { id: 'batch', icon: Users, label: 'Alumni Directory' },
    { id: 'mentorship', icon: Star, label: 'Mentorship Access' },
    { id: 'opportunities', icon: Briefcase, label: 'Opportunity Board' },
    { id: 'resources', icon: BookOpen, label: 'Resource Hub' },
  ];

  const tabTitles = {
    profile: 'My Profile & Resume',
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
            <h1 className="page-title">{tabTitles[tab]}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Student Level — Class & Career</p>
          </div>
          <span className="badge badge-student">Current Student</span>
        </div>

        <div className="animate-slide-up delay-100">
          {tab === 'profile' && <StudentProfile token={user.token} />}
          {tab === 'batch' && <BatchTracking token={user.token} />}
          {tab === 'mentorship' && <MentorshipAccess token={user.token} />}
          {tab === 'opportunities' && <OpportunityBoard token={user.token} />}
          {tab === 'resources' && <ResourceHub token={user.token} />}
        </div>
      </main>
    </div>
  );
};

export default StudentPortal;
