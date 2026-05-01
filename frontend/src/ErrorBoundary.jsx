import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '2rem', 
          textAlign: 'center',
          background: '#F8FAFC'
        }}>
          <h1 style={{ color: '#1E3A8A', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: '#475569', marginBottom: '2rem' }}>The application encountered an unexpected error.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.href = '/'}
            style={{ padding: '0.75rem 2rem' }}
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
