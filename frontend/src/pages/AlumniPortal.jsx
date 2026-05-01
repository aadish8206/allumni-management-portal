import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Network, MessageSquare, User, Briefcase, Calendar,
  IndianRupee, LogOut, Send, Star, Plus, X, Edit, Check, Inbox, Trash2, Home
} from 'lucide-react';
import axios from 'axios';
import { ensureProtocol, getLinkedInVanity } from '../utils/url';

const api = (token) => axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { 'x-auth-token': token }
});

const LinkedInBadge = ({ url }) => {
  const vanity = getLinkedInVanity(url);
  useEffect(() => {
    if (window.LIRenderAll) {
      window.LIRenderAll();
    }
  }, [url]);

  if (!vanity) return null;
  return (
    <div style={{ marginTop: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', background: '#f9f9f9', display: 'flex', justifyContent: 'center' }}>
      <div className="LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="light" data-type="vertical" data-vanity={vanity} data-version="v1">
        <a className="LI-simple-link" href={`https://in.linkedin.com/in/${vanity}?trk=profile-badge`}>{vanity} Profile</a>
      </div>
    </div>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
    <div className="card" style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>{title}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Direct Contact ───────────────────────────────────────────────────────────
const DirectContact = ({ token }) => {
  const [tab, setTab] = useState('inbox');
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ receiverId: '', content: '' });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api(token).get('/messages/inbox').then(r => setInbox(r.data)).catch(console.error);
    api(token).get('/messages/sent').then(r => setSent(r.data)).catch(console.error);
    // Get alumni (for alumni-to-alumni)
    api(token).get('/users/directory').then(r => setContacts(c => [...c, ...r.data])).catch(console.error);
    // Get students
    api(token).get('/users/students').then(r => setContacts(c => [...c, ...r.data])).catch(console.error);
  }, [token]);

  const sendMessage = async () => {
    try {
      await api(token).post('/messages', composeData);
      setSuccess(true);
      setTimeout(() => { setShowCompose(false); setSuccess(false); setComposeData({ receiverId: '', content: '' }); }, 1500);
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Permission Denied: Mentorship must be approved by admin before contacting students.');
      } else {
        alert('Failed to send message.');
      }
    }
  };

  const MessageItem = ({ msg, isSent }) => {
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(msg.content);

    const handleDownload = async () => {
      try {
        const r = await api(token).get(`/users/resume/${msg.attachedResumeId}`);
        const link = document.createElement('a');
        link.href = r.data.resumeBase64;
        link.download = r.data.resumeFileName || 'resume.pdf';
        link.click();
      } catch (err) {
        alert('Resume could not be downloaded or was removed.');
      }
    };

    const handleEdit = async () => {
      try {
        const r = await api(token).put(`/messages/${msg._id}`, { content: editContent });
        if (isSent) setSent(sent.map(m => m._id === msg._id ? r.data : m));
        else setInbox(inbox.map(m => m._id === msg._id ? r.data : m));
        setEditing(false);
      } catch (err) {
        alert('Could not edit message.');
      }
    };

    const handleDelete = async () => {
      if (!confirm('Delete this message?')) return;
      try {
        await api(token).delete(`/messages/${msg._id}`);
        if (isSent) setSent(sent.filter(m => m._id !== msg._id));
        else setInbox(inbox.filter(m => m._id !== msg._id));
      } catch (err) {
        alert('Could not delete message.');
      }
    };

    return (
      <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', marginBottom: '0.75rem', background: msg.read ? 'white' : '#f0f4ff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontWeight: 700 }}>{isSent ? `To: ${msg.receiverName || 'User'}` : `From: ${msg.senderName}`}</span>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(msg.createdAt).toLocaleString()}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {isSent && (
                <button onClick={() => setEditing(!editing)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }} title="Edit"><Edit size={14} /></button>
              )}
              <button onClick={handleDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }} title="Delete"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
        
        {editing ? (
          <div style={{ marginTop: '0.5rem' }}>
            <textarea className="form-input" rows={3} value={editContent} onChange={e => setEditContent(e.target.value)} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={handleEdit}>Save</button>
              <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>{msg.content}</p>
        )}

        {msg.attachedResumeId && !editing && (
          <button className="btn btn-primary" onClick={handleDownload} style={{ marginTop: '1rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            📄 Download Attached Resume
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setTab('inbox')} className="btn" style={{ padding: '0.5rem 1.25rem', background: tab === 'inbox' ? 'var(--primary)' : 'var(--bg-color)', color: tab === 'inbox' ? 'white' : 'var(--text-muted)', fontWeight: 600 }}>
            <Inbox size={16} style={{ marginRight: '0.5rem' }} /> Inbox ({inbox.filter(m => !m.read).length})
          </button>
          <button onClick={() => setTab('sent')} className="btn" style={{ padding: '0.5rem 1.25rem', background: tab === 'sent' ? 'var(--primary)' : 'var(--bg-color)', color: tab === 'sent' ? 'white' : 'var(--text-muted)', fontWeight: 600 }}>
            <Send size={16} style={{ marginRight: '0.5rem' }} /> Sent
          </button>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCompose(true)}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} /> Compose
        </button>
      </div>

      {tab === 'inbox' && (
        <div>
          {inbox.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Your inbox is empty.</p>
            : inbox.map(msg => <MessageItem key={msg._id} msg={msg} isSent={false} />)}
        </div>
      )}
      {tab === 'sent' && (
        <div>
          {sent.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No sent messages.</p>
            : sent.map(msg => <MessageItem key={msg._id} msg={msg} isSent />)}
        </div>
      )}

      {showCompose && (
        <Modal title="Compose Message" onClose={() => setShowCompose(false)}>
          {success ? (
            <div style={{ textAlign: 'center', color: '#10B981', padding: '1rem' }}>
              <Check size={48} color="#10B981" />
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>Message sent!</p>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Send To</label>
                <select className="form-input" value={composeData.receiverId} onChange={e => setComposeData({ ...composeData, receiverId: e.target.value })}>
                  <option value="">Select recipient...</option>
                  {contacts.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.role})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={5} value={composeData.content} onChange={e => setComposeData({ ...composeData, content: e.target.value })} placeholder="Write your message..." />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={sendMessage} disabled={!composeData.receiverId || !composeData.content.trim()}>
                <Send size={16} style={{ marginRight: '0.5rem' }} /> Send Message
              </button>
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

// ─── Professional Profile ─────────────────────────────────────────────────────
const ProfessionalProfile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    api(token).get('/users/me').then(r => { setProfile(r.data); setForm(r.data); }).catch(console.error);
  }, [token]);

  const save = async () => {
    const payload = { ...form };
    if (typeof payload.skills === 'string') {
      payload.skills = payload.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    const r = await api(token).put('/users/me', payload);
    setProfile(r.data);
    setEditing(false);
  };

  if (!profile) return <p style={{ color: 'var(--text-muted)' }}>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '700px' }}>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{profile.name}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{profile.jobTitle || 'No job title set'} {profile.company ? `at ${profile.company}` : ''} {profile.location ? `• ${profile.location}` : ''}</p>
              <span className="badge badge-alumni" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Alumni • {profile.batch || 'N/A'} • {profile.department || 'N/A'}</span>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="btn" style={{ background: editing ? '#fee2e2' : 'var(--bg-color)', color: editing ? '#EF4444' : 'var(--text-muted)' }}>
            {editing ? <><X size={16} style={{ marginRight: 4 }} /> Cancel</> : <><Edit size={16} style={{ marginRight: 4 }} /> Edit Profile</>}
          </button>
        </div>
      </div>

      {editing ? (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Edit Professional Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              ['Full Name', 'name', 'text'],
              ['Job Title', 'jobTitle', 'text'],
              ['Company', 'company', 'text'],
              ['Location', 'location', 'text'],
              ['Phone', 'phone', 'tel'],
              ['Batch (Year)', 'batch', 'text'],
              ['Department', 'department', 'text'],
            ].map(([label, key, type]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input type={type} className="form-input" value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn URL</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="url" className="form-input" style={{ flex: 1 }} value={form.linkedin || ''} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
              <button 
                type="button" 
                className="btn" 
                style={{ background: '#0077b5', color: 'white' }}
                onClick={() => {
                  if (!form.linkedin) return alert('Please enter your LinkedIn URL first.');
                  window.open(ensureProtocol(form.linkedin), '_blank');
                  const role = prompt('Enter your current Job Title (e.g. Senior Developer):');
                  const company = prompt('Enter your current Company (e.g. Google):');
                  if (role) setForm(prev => ({ ...prev, jobTitle: role }));
                  if (company) setForm(prev => ({ ...prev, company: company }));
                }}
              >
                Sync (Manual)
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Skills (comma separated)</label>
            <input type="text" className="form-input" value={Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || ''} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Node.js, Project Management" />
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-input" rows={4} value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell your story..." />
          </div>
          <button onClick={save} className="btn btn-primary" style={{ width: '100%' }}>
            <Check size={16} style={{ marginRight: 8 }} /> Save Profile
          </button>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Profile Details</h3>
          {[
            ['Email', profile.email],
            ['Phone', profile.phone || 'N/A'],
            ['LinkedIn', profile.linkedin ? <a href={ensureProtocol(profile.linkedin)} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{profile.linkedin}</a> : 'N/A'],
            ['Bio', profile.bio || 'No bio.'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 600, width: '120px', flexShrink: 0, color: 'var(--text-muted)' }}>{label}</span>
              <span>{value}</span>
            </div>
          ))}
          <LinkedInBadge url={profile.linkedin} />
        </div>
      )}
    </div>
  );
};

// ─── Giving Back ──────────────────────────────────────────────────────────────
const GivingBack = ({ token, userName }) => {
  const [showJob, setShowJob] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', company: '', description: '', type: 'internship', location: '', applyLink: '' });
  const [mentorForm, setMentorForm] = useState({ domain: '', description: '' });
  const [donateForm, setDonateForm] = useState({ amount: '', project: '', message: '' });
  const [myJobs, setMyJobs] = useState([]);
  const [myMentorships, setMyMentorships] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api(token).get('/jobs').then(r => setMyJobs(r.data)).catch(console.error);
    api(token).get('/mentorship/me').then(r => setMyMentorships(r.data)).catch(console.error);
    api(token).get('/campaigns').then(r => setCampaigns(r.data)).catch(console.error);
  }, [token]);

  const submitJob = async () => {
    const r = await api(token).post('/jobs', { ...jobForm, postedByName: userName });
    setMyJobs(j => [r.data, ...j]);
    setSuccess('job'); setShowJob(false); setJobForm({ title: '', company: '', description: '', type: 'internship', location: '', applyLink: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  const submitMentor = async () => {
    const r = await api(token).post('/mentorship', mentorForm);
    setMyMentorships(m => [r.data, ...m]);
    setSuccess('mentor'); setShowMentor(false); setMentorForm({ domain: '', description: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  const submitDonate = async () => {
    await api(token).post('/donations', { ...donateForm, amount: parseFloat(donateForm.amount) });
    setSuccess('donation'); setShowDonate(false); setDonateForm({ amount: '', project: '', message: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  const deleteJob = async (id) => {
    await api(token).delete(`/jobs/${id}`);
    setMyJobs(j => j.filter(x => x._id !== id));
  };

  return (
    <div>
      {success && (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem 1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontWeight: 600 }}>
          ✓ {success === 'job' ? 'Job posted!' : success === 'mentor' ? 'Mentorship offer posted!' : 'Donation submitted! Thank you!'}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ background: '#e0e7ff', borderRadius: '0.75rem', padding: '1rem', width: 'fit-content', margin: '0 auto 1rem' }}>
            <Briefcase size={32} color="var(--primary)" />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Post Job Opening</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Share exclusive internships or job referrals with current students.</p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowJob(true)}>
            <Plus size={16} style={{ marginRight: 8 }} /> Post an Opening
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ background: '#fef3c7', borderRadius: '0.75rem', padding: '1rem', width: 'fit-content', margin: '0 auto 1rem' }}>
            <Star size={32} color="#F59E0B" />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Offer Mentorship</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Offer your time to guide current students in your domain of expertise.</p>
          <button className="btn btn-primary" style={{ width: '100%', background: '#F59E0B' }} onClick={() => setShowMentor(true)}>
            <Plus size={16} style={{ marginRight: 8 }} /> Offer to Mentor
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ background: '#d1fae5', borderRadius: '0.75rem', padding: '1rem', width: 'fit-content', margin: '0 auto 1rem' }}>
            <IndianRupee size={32} color="#10B981" />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Donate to Projects</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Support institutional scholarships and campus improvement projects.</p>
          <button className="btn btn-primary" style={{ width: '100%', background: '#10B981' }} onClick={() => setShowDonate(true)}>
            <IndianRupee size={16} style={{ marginRight: 8 }} /> Make a Donation
          </button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>My Mentees & Mentorship Slots</h3>
        {myMentorships.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>You haven't offered mentorship yet.</p> :
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {myMentorships.map(m => (
              <div key={m._id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.75rem', background: m.status === 'occupied' ? '#f0f9ff' : 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: m.status === 'occupied' ? '#0284c7' : '#64748b', background: m.status === 'occupied' ? '#e0f2fe' : '#f1f5f9', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                    {m.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{m.domain}</span>
                </div>
                {m.status === 'occupied' ? (
                  <div>
                    <p style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '0.875rem' }}>Mentee: <strong>{m.mentee?.name || m.menteeName}</strong></p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.mentee?.email}</p>
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e0f2fe', fontSize: '0.75rem' }}>
                      {m.mentee?.department} • Class of {m.mentee?.batch}
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Waiting for student request...</p>
                )}
              </div>
            ))}
          </div>
        }
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Active Fundraising Campaigns</h3>
        {campaigns.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No active campaigns right now.</p> : campaigns.map(c => {
          const progress = Math.min(100, Math.round((c.raisedAmount / c.targetAmount) * 100));
          return (
            <div key={c._id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>{c.title}</span>
                <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: '#10B981', color: 'white' }} onClick={() => { setDonateForm({...donateForm, project: c.title}); setShowDonate(true); }}>Donate Now</button>
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
        <h3 style={{ marginBottom: '1.5rem' }}>Your Posted Opportunities</h3>
        {myJobs.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>You haven't posted any opportunities yet.</p> :
          myJobs.map(job => (
            <div key={job._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className={`badge badge-${job.type === 'internship' ? 'student' : 'alumni'}`} style={{ marginRight: '0.5rem' }}>{job.type}</span>
                <strong>{job.title}</strong> at {job.company}
              </div>
              <button onClick={() => deleteJob(job._id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><X size={18} /></button>
            </div>
          ))
        }
      </div>

      {showJob && (
        <Modal title="Post a Job / Internship" onClose={() => setShowJob(false)}>
          <div className="form-group"><label className="form-label">Job Title</label><input className="form-input" required value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Company</label><input className="form-input" required value={jobForm.company} onChange={e => setJobForm({ ...jobForm, company: e.target.value })} /></div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value })}>
              <option value="internship">Internship</option>
              <option value="job">Full-time Job</option>
              <option value="referral">Job Referral</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Apply Link</label><input className="form-input" value={jobForm.applyLink} onChange={e => setJobForm({ ...jobForm, applyLink: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={4} value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} /></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={submitJob}>Post Opportunity</button>
        </Modal>
      )}

      {showMentor && (
        <Modal title="Offer Mentorship" onClose={() => setShowMentor(false)}>
          <div className="form-group"><label className="form-label">Domain / Expertise Area</label><input className="form-input" placeholder="e.g. Web Development, Data Science..." value={mentorForm.domain} onChange={e => setMentorForm({ ...mentorForm, domain: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={4} placeholder="Describe how you can help students..." value={mentorForm.description} onChange={e => setMentorForm({ ...mentorForm, description: e.target.value })} /></div>
          <button className="btn btn-primary" style={{ width: '100%', background: '#F59E0B' }} onClick={submitMentor}>Offer Mentorship</button>
        </Modal>
      )}

      {showDonate && (
        <Modal title="Donate to Project" onClose={() => setShowDonate(false)}>
          <div className="form-group">
            <label className="form-label">Select Campaign</label>
            {campaigns.length > 0 ? (
              <select className="form-input" value={donateForm.project} onChange={e => setDonateForm({ ...donateForm, project: e.target.value })}>
                <option value="">-- Choose a Campaign --</option>
                {campaigns.filter(c => c.status === 'active').map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                <option value="General Fund">General Fund</option>
              </select>
            ) : (
              <input className="form-input" placeholder="e.g. Computer Lab Upgrade, Scholarship Fund..." value={donateForm.project} onChange={e => setDonateForm({ ...donateForm, project: e.target.value })} />
            )}
          </div>
          <div className="form-group"><label className="form-label">Amount (₹)</label><input type="number" className="form-input" min="1" value={donateForm.amount} onChange={e => setDonateForm({ ...donateForm, amount: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Message (optional)</label><textarea className="form-input" rows={3} value={donateForm.message} onChange={e => setDonateForm({ ...donateForm, message: e.target.value })} /></div>
          <button className="btn btn-primary" style={{ width: '100%', background: '#10B981' }} onClick={submitDonate}>Confirm Donation</button>
        </Modal>
      )}
    </div>
  );
};

// ─── Event Manager ─────────────────────────────────────────────────────────────
const EventManager = ({ token, userName }) => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', type: 'reunion' });
  const [attended, setAttended] = useState({});

  useEffect(() => {
    api(token).get('/events').then(r => setEvents(r.data)).catch(console.error);
  }, [token]);

  const create = async () => {
    const r = await api(token).post('/events', { ...form, organizedByName: userName });
    setEvents(e => [r.data, ...e]);
    setShowForm(false);
    setForm({ title: '', description: '', date: '', location: '', type: 'reunion' });
  };

  const attend = async (id) => {
    await api(token).put(`/events/${id}/attend`);
    setAttended(a => ({ ...a, [id]: true }));
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    await api(token).delete(`/events/${id}`);
    setEvents(events.filter(e => e._id !== id));
  };

  const typeColor = { reunion: '#4F46E5', seminar: '#10B981', workshop: '#F59E0B', other: '#6B7280' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3>Event Manager</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Organize batch reunions or RSVP to upcoming events.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} style={{ marginRight: 8 }} /> Organize Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {events.map(event => (
          <div key={event._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ background: typeColor[event.type] + '20', color: typeColor[event.type], padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>{event.type}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {event.attendees?.length || 0} attending
              </span>
              {(event.organizedBy === user._id || user.role === 'admin') && (
                <button onClick={() => deleteEvent(event._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }} title="Delete Event">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{event.description}</p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <p style={{ margin: 0 }}>📅 {new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
              {event.location && <p style={{ margin: 0 }}>📍 {event.location}</p>}
              <p style={{ margin: 0 }}>Organized by {event.organizedByName}</p>
            </div>
            <button
              onClick={() => attend(event._id)}
              disabled={attended[event._id]}
              className="btn btn-primary"
              style={{ width: '100%', background: attended[event._id] ? '#10B981' : 'var(--primary)' }}
            >
              {attended[event._id] ? '✓ RSVP Confirmed' : 'Attend this Event'}
            </button>
          </div>
        ))}
        {events.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>No events scheduled. Be the first to organize one!</p>}
      </div>

      {showForm && (
        <Modal title="Organize New Event" onClose={() => setShowForm(false)}>
          <div className="form-group"><label className="form-label">Event Title</label><input className="form-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
          <div className="form-group">
            <label className="form-label">Event Type</label>
            <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="reunion">Batch Reunion</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={create}>Create Event</button>
        </Modal>
      )}
    </div>
  );
};

// ─── Main Alumni Portal ────────────────────────────────────────────────────────
const AlumniPortal = () => {
  const { user, logout } = useContext(AuthContext);
  const [tab, setTab] = useState('contact');

  const navItems = [
    { id: 'contact', icon: MessageSquare, label: 'Direct Contact' },
    { id: 'profile', icon: User, label: 'Professional Profile' },
    { id: 'giving', icon: Star, label: 'Giving Back' },
    { id: 'events', icon: Calendar, label: 'Event Manager' },
  ];

  const tabTitles = {
    contact: 'Direct Contact & Networking',
    profile: 'Professional Profile',
    giving: 'Giving Back to Community',
    events: 'Event Manager',
  };

  return (
    <div className="portal-layout">
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ background: '#fef3c7', borderRadius: '0.5rem', padding: '0.5rem' }}>
            <Network size={24} color="var(--alumni-color)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Alumni Portal</h3>
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
            <p style={{ color: 'var(--text-muted)' }}>Alumni Level — Engagement</p>
          </div>
          <span className="badge badge-alumni">Alumni</span>
        </div>

        <div className="animate-slide-up delay-100">
          {tab === 'contact' && <DirectContact token={user.token} />}
          {tab === 'profile' && <ProfessionalProfile token={user.token} />}
          {tab === 'giving' && <GivingBack token={user.token} userName={user.name} />}
          {tab === 'events' && <EventManager token={user.token} userName={user.name} />}
        </div>
      </main>
    </div>
  );
};

export default AlumniPortal;
