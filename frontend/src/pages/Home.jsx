import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import VantaBackground from '../components/VantaBackground';
import {
  GraduationCap,
  Network,
  Briefcase,
  Calendar,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Star
} from 'lucide-react';

/* ── 3D Tilt Card Component ── */
const TiltCard = ({ children, style = {} }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    card.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 40px rgba(99,102,241,0.4)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'box-shadow 0.5s ease',
        willChange: 'transform',
        cursor: 'default',
        ...style
      }}
    >
      {children}
    </div>
  );
};

/* ── Floating 3D Orb ── */
const FloatingOrb = ({ color, size, top, left, delay = 0 }) => (
  <div style={{
    position: 'absolute',
    top, left,
    width: size,
    height: size,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, ${color}, transparent)`,
    filter: 'blur(45px)',
    opacity: 0.5,
    animation: `floatOrb 6s ease-in-out ${delay}s infinite alternate`,
    pointerEvents: 'none',
    zIndex: 0,
  }} />
);

/* ── Counter animation ── */
const AnimatedCounter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const numTarget = parseInt(target.replace(/\D/g, ''));
        const duration = 2000;
        const step = numTarget / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= numTarget) {
            setCount(numTarget);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
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
      icon: <Network size={32} />,
      title: "Global Alumni Network",
      description: "Connect with graduates worldwide, build meaningful relationships, and expand your professional circle.",
      color: "#818cf8",
      bg: "rgba(99,102,241,0.2)",
      glow: "rgba(99,102,241,0.5)"
    },
    {
      icon: <Briefcase size={32} />,
      title: "Career Opportunities",
      description: "Access exclusive job postings, internships, and referral opportunities shared directly by alumni.",
      color: "#34d399",
      bg: "rgba(16,185,129,0.2)",
      glow: "rgba(16,185,129,0.5)"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Mentorship Programs",
      description: "Get guidance from experienced professionals or give back by mentoring the next generation of students.",
      color: "#fbbf24",
      bg: "rgba(245,158,11,0.2)",
      glow: "rgba(245,158,11,0.5)"
    },
    {
      icon: <Calendar size={32} />,
      title: "Events & Reunions",
      description: "Stay updated on batch reunions, technical workshops, and seminars happening on campus.",
      color: "#f472b6",
      bg: "rgba(236,72,153,0.2)",
      glow: "rgba(236,72,153,0.5)"
    }
  ];

  const stats = [
    { number: "10000", suffix: "+", label: "Active Alumni", icon: <Users size={24} /> },
    { number: "500", suffix: "+", label: "Mentorship Matches", icon: <Star size={24} /> },
    { number: "1000", suffix: "+", label: "Job Referrals", icon: <Briefcase size={24} /> },
    { number: "50", suffix: "+", label: "Yearly Events", icon: <Calendar size={24} /> },
  ];

  return (
    <div style={{ background: '#0f172a', color: '#ffffff', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <style>{`
        @keyframes floatOrb {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-30px) scale(1.1); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes gradientText {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse3d {
          0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.2); }
          50%       { box-shadow: 0 0 40px rgba(99,102,241,0.8), 0 0 80px rgba(99,102,241,0.4); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .feature-card-3d:hover .feature-glow {
          opacity: 1 !important;
        }
        .nav-btn-3d {
          transition: all 0.3s ease;
        }
        .nav-btn-3d:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.5);
        }
        .stat-card-3d {
          transition: all 0.3s ease;
        }
        .stat-card-3d:hover {
          transform: translateY(-8px) scale(1.04);
          box-shadow: 0 20px 60px rgba(99,102,241,0.4) !important;
        }
      `}</style>

      {/* ── HERO with NET 3D Background ── */}
      <VantaBackground effect="NET">
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Floating Orbs */}
          <FloatingOrb color="#6366f1" size="300px" top="10%" left="60%" delay={0} />
          <FloatingOrb color="#d97706" size="220px" top="55%" left="75%" delay={1.5} />
          <FloatingOrb color="#10B981" size="180px" top="15%" left="5%" delay={3} />

          {/* Navigation */}
          <nav style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(99,102,241,0.3)',
            padding: '1rem 2rem',
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1, #d97706)',
                  borderRadius: '12px', padding: '8px',
                  animation: 'pulse3d 3s ease-in-out infinite',
                }}>
                  <GraduationCap size={26} color="white" />
                </div>
                <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>Alumni Connect</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/login" className="nav-btn-3d" style={{
                  padding: '0.6rem 1.5rem', borderRadius: '10px', color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  background: 'rgba(255,255,255,0.1)',
                  fontWeight: 600, textDecoration: 'none',
                }}>Login</Link>
                <Link to="/register" className="nav-btn-3d" style={{
                  padding: '0.6rem 1.5rem', borderRadius: '10px', color: '#ffffff',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
                }}>Join Now</Link>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div style={{
            maxWidth: '1200px', margin: '0 auto',
            padding: '6rem 2rem 5rem',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '3.5rem', alignItems: 'center',
          }}>
            <div style={{ animation: 'slideInLeft 0.8s ease forwards' }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(245,158,11,0.2)',
                border: '1px solid rgba(245,158,11,0.4)',
                borderRadius: '999px', padding: '8px 18px',
                marginBottom: '1.75rem',
                animation: 'floatBadge 3s ease-in-out infinite',
              }}>
                <Award size={18} color="#fbbf24" />
                <span style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: 700 }}>The official platform for our graduates</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '1.5rem',
                letterSpacing: '-0.03em',
              }}>
                Your Lifelong Connection to{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #818cf8, #c084fc, #fbbf24, #818cf8)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientText 4s linear infinite',
                  display: 'inline-block'
                }}>
                  Excellence & Opportunity
                </span>
              </h1>

              <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2.5rem', fontWeight: 400 }}>
                Bridge the gap between campus life and the professional world.
                Join thousands of alumni and students networking, sharing opportunities, and growing together.
              </p>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                <Link to="/register" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '1.1rem 2.25rem', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: '#ffffff', fontWeight: 800, fontSize: '1.05rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 30px rgba(99,102,241,0.5)',
                  transition: 'all 0.3s ease',
                  animation: 'pulse3d 3s ease-in-out infinite',
                }}>
                  Get Started <ArrowRight size={20} />
                </Link>
                <Link to="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '1.1rem 2.25rem', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#ffffff', fontWeight: 700, fontSize: '1.05rem',
                  textDecoration: 'none',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}>
                  Sign In to Portal
                </Link>
              </div>
            </div>

            {/* 3D Floating Preview Card */}
            <div style={{ animation: 'slideInRight 0.8s ease 0.2s both', display: 'flex', justifyContent: 'center' }}>
              <TiltCard style={{
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                borderRadius: '24px',
                padding: '2.5rem',
                width: '100%', maxWidth: '440px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.75rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
                      <GraduationCap size={28} color="white" />
                    </div>
                    <div>
                      <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>Alumni Portal</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Connected Network</div>
                    </div>
                  </div>
                  {[
                    { label: 'New Job Referrals', value: '24', color: '#34d399' },
                    { label: 'Mentorship Requests', value: '8', color: '#818cf8' },
                    { label: 'Upcoming Events', value: '3', color: '#fbbf24' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '1rem 1.25rem', borderRadius: '14px',
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '0.875rem',
                    }}>
                      <span style={{ color: '#cbd5e1', fontSize: '0.925rem', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ color: item.color, fontWeight: 800, fontSize: '1.35rem' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  padding: '1rem', borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.35))',
                  border: '1px solid rgba(99,102,241,0.4)',
                  textAlign: 'center',
                }}>
                  <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>🎓 10,000+ alumni connected worldwide</div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </VantaBackground>

      {/* ── Stats Section ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 50%, #0b0f19 100%)',
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(99,102,241,0.2)',
        borderBottom: '1px solid rgba(99,102,241,0.2)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {stats.map((stat, idx) => (
            <TiltCard key={idx}>
              <div className="stat-card-3d" style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '22px', padding: '2.25rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                animation: `fadeInUp 0.6s ease ${idx * 0.1}s both`,
              }}>
                <div style={{ color: '#818cf8', marginBottom: '1rem' }}>{stat.icon}</div>
                <div style={{
                  fontSize: '2.75rem', fontWeight: 900, color: '#ffffff',
                  background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.5rem' }}>{stat.label}</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── Features Section with GLOBE background ── */}
      <VantaBackground effect="GLOBE" style={{ minHeight: 'auto' }}>
        <section style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 900, color: '#ffffff',
                marginBottom: '1rem', letterSpacing: '-0.02em',
              }}>Everything You Need to Succeed</h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', fontWeight: 400 }}>
                A comprehensive suite of tools designed specifically for our alumni and student community.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {features.map((feature, idx) => (
                <TiltCard key={idx}>
                  <div className="feature-card-3d" style={{
                    position: 'relative', overflow: 'hidden',
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${feature.color}44`,
                    borderRadius: '24px', padding: '2.5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                    animation: `fadeInUp 0.6s ease ${idx * 0.15}s both`,
                    transition: 'border-color 0.3s ease',
                  }}>
                    {/* Glow effect */}
                    <div className="feature-glow" style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: `radial-gradient(circle at 50% 0%, ${feature.glow} 0%, transparent 70%)`,
                      opacity: 0, transition: 'opacity 0.4s ease', pointerEvents: 'none',
                    }} />
                    <div style={{
                      display: 'inline-flex', padding: '1.1rem',
                      background: feature.bg, borderRadius: '18px',
                      color: feature.color, marginBottom: '1.5rem',
                      boxShadow: `0 4px 20px ${feature.glow}`
                    }}>
                      {feature.icon}
                    </div>
                    <h3 style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.875rem' }}>{feature.title}</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.975rem' }}>{feature.description}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      </VantaBackground>

      {/* ── CTA Section with WAVES ── */}
      <VantaBackground effect="WAVES" style={{ minHeight: 'auto' }}>
        <section style={{ padding: '7rem 2rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', fontWeight: 900, color: '#ffffff',
              marginBottom: '1.5rem', letterSpacing: '-0.02em',
            }}>Ready to Reconnect?</h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '3rem', fontWeight: 500 }}>
              Join the community today and unlock a world of possibilities.
            </p>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '1.25rem 2.75rem', borderRadius: '16px',
              background: '#ffffff', color: '#4f46e5',
              fontWeight: 800, fontSize: '1.15rem', textDecoration: 'none',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease',
            }}>
              Create Your Account <ArrowRight size={22} />
            </Link>
          </div>
        </section>
      </VantaBackground>

      {/* ── Footer ── */}
      <footer style={{
        background: '#020617',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '2.5rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.875rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #d97706)', borderRadius: '10px', padding: '7px' }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.1rem' }}>Alumni Connect</span>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} Alumni Management Portal. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
