import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  GraduationCap,
  Network,
  Briefcase,
  Calendar,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Star,
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';

/* ── Counter animation ── */
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const numTarget = parseInt(target.replace(/\D/g, ''));
        const duration = 1800;
        const step = Math.max(1, Math.floor(numTarget / (duration / 16)));
        const timer = setInterval(() => {
          start += step;
          if (start >= numTarget) {
            setCount(numTarget);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  const { user, loading } = useContext(AuthContext);
  if (!loading && user) return <Navigate to={`/${user.role}-portal`} replace />;

  const features = [
    {
      icon: <Network size={28} />,
      title: "Global Alumni Network",
      description: "Connect with distinguished graduates across industries worldwide. Expand your professional network and stay linked to your alma mater.",
      badge: "Networking",
      color: "#1E3A8A",
      bgColor: "#EFF6FF"
    },
    {
      icon: <Briefcase size={28} />,
      title: "Career & Referral Board",
      description: "Access verified job opportunities, internships, and direct internal referrals posted exclusively by verified alumni.",
      badge: "Careers",
      color: "#059669",
      bgColor: "#ECFDF5"
    },
    {
      icon: <BookOpen size={28} />,
      title: "Institutional Mentorship",
      description: "Engage in structured one-on-one mentorship. Students receive guidance from senior alumni leaders in their fields.",
      badge: "Mentorship",
      color: "#D97706",
      bgColor: "#FFFBEB"
    },
    {
      icon: <Calendar size={28} />,
      title: "Reunions & Academic Events",
      description: "Participate in institutional seminars, alumni homecoming meets, webinars, and annual department conferences.",
      badge: "Events",
      color: "#7C3AED",
      bgColor: "#F5F3FF"
    }
  ];

  const stats = [
    { number: "10000", suffix: "+", label: "Registered Alumni", icon: <Users size={24} /> },
    { number: "500", suffix: "+", label: "Active Mentorship Matches", icon: <Star size={24} /> },
    { number: "1200", suffix: "+", label: "Job Referrals Shared", icon: <Briefcase size={24} /> },
    { number: "60", suffix: "+", label: "Annual Reunions & Events", icon: <Calendar size={24} /> },
  ];

  return (
    <div style={{ background: '#F8FAFC', color: '#0F172A', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Top University Announcement Strip ── */}
      <div style={{
        background: 'linear-gradient(90deg, #1E3A8A 0%, #0F172A 100%)',
        color: '#FEF3C7',
        padding: '0.5rem 1.5rem',
        fontSize: '0.85rem',
        fontWeight: 500,
        textAlign: 'center',
        borderBottom: '1px solid rgba(217, 119, 6, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        gap: '0.5rem'
      }}>
        <Award size={16} color="#F59E0B" />
        <span>Official University Alumni & Student Networking Portal</span>
        <span style={{ opacity: 0.5, margin: '0 0.5rem' }}>|</span>
        <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Empowering Lifelong Academic Connections</span>
      </div>

      {/* ── Header Navigation ── */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1E3A8A, #1E40AF)',
              color: 'white',
              borderRadius: '12px',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)'
            }}>
              <GraduationCap size={28} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.35rem', color: '#1E3A8A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                ALUMNI CONNECT
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.05em' }}>
                HIGHER EDUCATION INSTITUTION PORTAL
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/login" style={{
              padding: '0.65rem 1.5rem',
              borderRadius: '8px',
              color: '#1E3A8A',
              fontWeight: 600,
              textDecoration: 'none',
              border: '1.5px solid #CBD5E1',
              transition: 'all 0.2s ease',
              fontSize: '0.95rem'
            }}>
              Sign In
            </Link>
            <Link to="/register" style={{
              padding: '0.65rem 1.5rem',
              borderRadius: '8px',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #1E3A8A, #2563EB)',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)',
              fontSize: '0.95rem'
            }}>
              Join Network
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Banner Section ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #1E40AF 100%)',
        color: '#FFFFFF',
        padding: '5rem 2rem 6rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.6
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '4rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(217, 119, 6, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '999px',
              padding: '6px 16px',
              color: '#FBBF24',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1.75rem'
            }}>
              <Building2 size={16} />
              <span>Institutional Excellence & Alumni Engagement</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}>
              Bridging Campus Excellence with <span style={{ color: '#F59E0B' }}>Global Leadership</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              lineHeight: 1.7,
              color: '#E2E8F0',
              marginBottom: '2.5rem',
              maxWidth: '580px'
            }}>
              Welcome to the central gateway for alumni and current students. Reconnect with peers, access referral channels, engage in academic mentorship, and support institution initiatives.
            </p>

            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.9rem 2rem',
                borderRadius: '10px',
                background: '#D97706',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(217, 119, 6, 0.4)',
                transition: 'all 0.2s ease'
              }}>
                Register Account <ArrowRight size={18} />
              </Link>
              <Link to="/login" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.9rem 2rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)'
              }}>
                Access Portal
              </Link>
            </div>
          </div>

          {/* Academic Portal Showcase Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '2.25rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            color: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid #F1F5F9',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: '#1E3A8A',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '8px'
                }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1E3A8A' }}>Verified Network Portal</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Authenticated Access Only</div>
                </div>
              </div>
              <span style={{
                background: '#ECFDF5',
                color: '#059669',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '999px'
              }}>Active</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Verified Alumni Profiles', desc: 'Search directory by department & batch', color: '#1E3A8A' },
                { title: 'Moderated Mentorship', desc: 'Admin approved connection system', color: '#D97706' },
                { title: 'Direct Job Referrals', desc: 'Connect with alumni inside top companies', color: '#059669' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '36px',
                    borderRadius: '4px',
                    background: item.color
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1E293B' }}>{item.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{item.desc}</div>
                  </div>
                  <ChevronRight size={18} color="#94A3B8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Metrics Bar ── */}
      <section style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '3rem 2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '1rem',
              borderRadius: '12px',
              background: '#F8FAFC',
              border: '1px solid #F1F5F9'
            }}>
              <div style={{
                background: '#EEF2FF',
                color: '#1E3A8A',
                padding: '12px',
                borderRadius: '12px'
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1E3A8A', lineHeight: 1.1 }}>
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Core Institutional Features Grid ── */}
      <section style={{ padding: '5rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#D97706',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              Institutional Ecosystem
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Comprehensive Network Capabilities
            </h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
              Built specifically to facilitate meaningful interactions between students, alumni, and university administration.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, idx) => (
              <div key={idx} style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '2.25rem 2rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      background: feature.bgColor,
                      color: feature.color,
                      padding: '12px',
                      borderRadius: '12px'
                    }}>
                      {feature.icon}
                    </div>
                    <span style={{
                      background: '#F1F5F9',
                      color: '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px'
                    }}>
                      {feature.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action Banner ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
        color: '#FFFFFF',
        padding: '5rem 2rem',
        textAlign: 'center',
        borderTop: '4px solid #D97706'
      }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#FFFFFF' }}>
            Join Your Official Alumni Community
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Whether you are a current student seeking mentorship or an alumnus offering opportunities, create your account today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              padding: '1rem 2.25rem',
              borderRadius: '10px',
              background: '#D97706',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1.05rem',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(217, 119, 6, 0.4)'
            }}>
              Register Account Now
            </Link>
            <Link to="/login" style={{
              padding: '1rem 2.25rem',
              borderRadius: '10px',
              background: 'transparent',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1.05rem',
              textDecoration: 'none'
            }}>
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── Institutional Footer ── */}
      <footer style={{
        background: '#0F172A',
        color: '#94A3B8',
        padding: '3rem 2rem 2rem 2rem',
        borderTop: '1px solid #1E293B',
        fontSize: '0.9rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid #1E293B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#1E3A8A', color: 'white', padding: '6px', borderRadius: '8px' }}>
              <GraduationCap size={20} />
            </div>
            <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.1rem' }}>Alumni Connect Portal</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
            <Link to="/login" style={{ color: '#94A3B8', textDecoration: 'none' }}>Portal Login</Link>
            <Link to="/register" style={{ color: '#94A3B8', textDecoration: 'none' }}>Register</Link>
            <Link to="/forgot-password" style={{ color: '#94A3B8', textDecoration: 'none' }}>Forgot Password</Link>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '1.5rem auto 0 auto', textAlign: 'center', fontSize: '0.8rem', color: '#64748B' }}>
          © {new Date().getFullYear()} Higher Education Institution Alumni Portal. All rights reserved. Security & Privacy Enforced.
        </div>
      </footer>
    </div>
  );
};

export default Home;
