import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  GraduationCap, 
  Network, 
  Briefcase, 
  Calendar, 
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';

const Home = () => {
  const { user, loading } = useContext(AuthContext);

  // If user is already logged in, redirect them to their portal
  if (!loading && user) {
    return <Navigate to={`/${user.role}-portal`} replace />;
  }

  const features = [
    {
      icon: <Network size={32} />,
      title: "Global Alumni Network",
      description: "Connect with graduates worldwide, build meaningful relationships, and expand your professional circle.",
      color: "#4F46E5",
      bg: "#EEF2FF"
    },
    {
      icon: <Briefcase size={32} />,
      title: "Career Opportunities",
      description: "Access exclusive job postings, internships, and referral opportunities shared directly by alumni.",
      color: "#10B981",
      bg: "#D1FAE5"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Mentorship Programs",
      description: "Get guidance from experienced professionals or give back by mentoring the next generation of students.",
      color: "#F59E0B",
      bg: "#FEF3C7"
    },
    {
      icon: <Calendar size={32} />,
      title: "Events & Reunions",
      description: "Stay updated on batch reunions, technical workshops, and seminars happening on campus.",
      color: "#EC4899",
      bg: "#FCE7F3"
    }
  ];

  const stats = [
    { number: "10k+", label: "Active Alumni" },
    { number: "500+", label: "Mentorship Matches" },
    { number: "1k+", label: "Job Referrals" },
    { number: "50+", label: "Yearly Events" }
  ];

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="home-nav-content">
          <div className="home-logo">
            <div className="logo-icon-wrapper">
              <GraduationCap size={28} color="white" />
            </div>
            <span className="logo-text">Alumni Connect</span>
          </div>
          <div className="home-nav-actions">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Join Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        
        <div className="hero-content animate-slide-up">
          <div className="hero-badge">
            <Award size={16} color="#F59E0B" style={{ marginRight: '6px' }} />
            <span>The official platform for our graduates</span>
          </div>
          <h1 className="hero-title" style={{ textAlign: 'left' }}>
            Your Lifelong Connection to <br />
            <span className="hero-highlight">Excellence and Opportunity</span>
          </h1>
          <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0 0 3rem' }}>
            Bridge the gap between campus life and the professional world. 
            Join thousands of alumni and students networking, sharing opportunities, and growing together.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg pulse-animation">
              Get Started <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In to Your Portal
            </Link>
          </div>
        </div>

        <div className="hero-image-container animate-fade-in delay-200">
          <img src="/images/hero.png" alt="Students and Alumni Networking" className="hero-image" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <h3 className="stat-number">{stat.number}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything you need to succeed</h2>
          <p>A comprehensive suite of tools designed specifically for our alumni and student community.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: feature.bg, color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to reconnect?</h2>
          <p>Join the community today and unlock a world of possibilities.</p>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ backgroundColor: 'white', color: 'var(--primary)' }}>
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="home-logo" style={{ marginBottom: '1rem' }}>
              <div className="logo-icon-wrapper" style={{ width: '32px', height: '32px' }}>
                <GraduationCap size={20} color="white" />
              </div>
              <span className="logo-text">Alumni Connect</span>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Empowering students and alumni to build a better future together.</p>
          </div>
          <div className="footer-links">
            <p>&copy; {new Date().getFullYear()} Alumni Management Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
