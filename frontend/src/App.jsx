import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch submissions on load
  const loadSubmissions = async () => {
    try {
      setFetching(true);
      const res = await fetch(`${API_BASE}/api/submissions`);
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (err) {
      console.warn('Backend currently offline or unreachable:', err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStatusMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form.');
      }

      setStatusMessage('🎉 Submission received and stored in Neon PostgreSQL!');
      setFormData({ name: '', email: '', message: '' });
      loadSubmissions();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="badge">Cloudflare + Render + Neon Architecture</div>
        <h1>Simple Contact & Info Form</h1>
        <p className="subtitle">
          Frontend hosted on <strong>Cloudflare Pages</strong>, backend on <strong>Render</strong>, and database on <strong>Neon Serverless Postgres</strong>.
        </p>
      </header>

      <div className="card form-card">
        <h2>Submit Your Details</h2>

        {statusMessage && <div className="alert success">{statusMessage}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              required
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message / Notes</label>
            <textarea
              id="message"
              name="message"
              rows="3"
              placeholder="Write a message or test comment..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit to Neon Database'}
          </button>
        </form>
      </div>

      <div className="card list-card">
        <div className="list-header">
          <h2>Stored Submissions ({submissions.length})</h2>
          <button className="refresh-btn" onClick={loadSubmissions} disabled={fetching}>
            {fetching ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>

        {fetching && submissions.length === 0 ? (
          <p className="empty-text">Loading submissions from Neon...</p>
        ) : submissions.length === 0 ? (
          <p className="empty-text">No submissions yet. Fill out the form above to submit your first entry!</p>
        ) : (
          <ul className="submissions-list">
            {submissions.map((item) => (
              <li key={item.id} className="submission-item">
                <div className="submission-top">
                  <strong>{item.name}</strong>
                  <span className="email-tag">{item.email}</span>
                </div>
                {item.message && <p className="submission-msg">"{item.message}"</p>}
                <span className="time-tag">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="footer">
        Backend API: <code>{API_BASE}</code>
      </footer>
    </div>
  );
}
