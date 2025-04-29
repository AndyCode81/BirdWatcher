import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

function Dashboard({ token }) {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Bot', text: "Hi! I'm BirdBot. Ask me anything about your network's current activity." }
  ]);
  const chatBoxRef = useRef(null);

  // Fetch anomaly data
  useEffect(() => {
    fetch('http://localhost:8000/api/anomalies', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRows(data))
      .catch(err => console.error(err));
  }, [token]);

  // Chatbot Q&A with FastAPI
  const sendMessage = async () => {
    const msg = chatInput.trim();
    if (!msg) return;

    setChatMessages(msgs => [...msgs, { sender: 'You', text: msg }]);
    setChatInput('');

    setChatMessages(msgs => [
      ...msgs,
      { sender: 'Bot', text: 'Thinking...' }
    ]);
    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const botReply = data.reply || "Sorry, I couldn't process your question.";
      setChatMessages(msgs => [
        ...msgs.slice(0, -1),
        { sender: 'Bot', text: botReply }
      ]);
    } catch {
      setChatMessages(msgs => [
        ...msgs.slice(0, -1),
        { sender: 'Bot', text: "Error connecting to BirdBot backend." }
      ]);
    }

    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="container">
      <header className="dashboard-header">
        <div className="logo-circle">🦜</div>
        <h1 className="header-title">BirdWatch Dashboard</h1>
      </header>
      <main className="dashboard-main">
      <div className="grid">
  <div className="card vibrant-card">
    <div className="icon">🌐</div>
    <div className="label">Network Monitor</div>
  </div>
  <div className="card vibrant-card">
    <div className="icon">📡</div>
    <div className="label">Wireshark Link</div>
  </div>
  <div className="card vibrant-card">
    <div className="icon">🤖</div>
    <div className="label">AI Anomaly Detection</div>
  </div>
  <div
  className="card vibrant-card"
  onClick={() => alert('System Benchmarking feature coming soon!')}
>
  <div className="icon dell-laptop-icon">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="12" width="32" height="18" rx="3" fill="#121C24" stroke="#0d6efd" strokeWidth="2"/>
      <rect x="8" y="30" width="32" height="3" rx="1.5" fill="#0d6efd" />
      <ellipse cx="24" cy="33.5" rx="3.5" ry="1.2" fill="#0d6efd" />
      <circle cx="24" cy="21" r="3" fill="none" stroke="#0d6efd" strokeWidth="1.2"/>
    </svg>
  </div>
  <div className="label">System Benchmarking</div>
</div>
  <div className="card vibrant-card">
    <div className="icon">➕</div>
    <div className="label">Add Tool</div>
  </div>
</div>

        <div className="section">
          <h2>Network Anomaly Monitoring</h2>
          <p>Connects to Wireshark and an AI model to detect abnormal activity on your network in real time.</p>
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>IP Address</th>
                <th>Anomaly Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(rows.filter(row =>
                row.ip.includes(filter) ||
                row.anomaly.toLowerCase().includes(filter.toLowerCase())
              ).length === 0) ? (
                <tr><td colSpan="4">No results found.</td></tr>
              ) : (
                rows.filter(row =>
                  row.ip.includes(filter) ||
                  row.anomaly.toLowerCase().includes(filter.toLowerCase())
                ).map((row, i) => (
                  <tr key={i}>
                    <td>{row.timestamp}</td>
                    <td>{row.ip}</td>
                    <td>{row.anomaly}</td>
                    <td>
                      <span className={
                        row.status === "Active" ? "status-dot status-active"
                        : row.status === "Investigating" ? "status-dot status-investigating"
                        : "status-dot"
                      }></span>
                      {row.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="footer-buttons">
            <input
              type="text"
              placeholder="Filter by IP or Anomaly Type..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
            <button className="vibrant-btn" onClick={() => alert('Scanning started!')}>Start Monitoring</button>
          </div>
        </div>
      </main>
      <button className="chatbot" onClick={() => setChatOpen(o => !o)}>💬</button>
      {chatOpen && (
        <div className="chat-window" id="chatWindow" style={{ display: 'flex' }}>
          <div className="chat-header">BirdBot Assistant</div>
          <div className="chat-messages" id="chatMessages" ref={chatBoxRef}>
            {chatMessages.map((msg, i) => (
              <div key={i}><strong>{msg.sender}:</strong> {msg.text}</div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
