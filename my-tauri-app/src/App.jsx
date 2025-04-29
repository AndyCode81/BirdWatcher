import React, { useState } from 'react';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [token, setToken] = useState(null);

  if (!token) {
    return <Login onLogin={setToken} />;
  }
  return <Dashboard token={token} />;
}

// Login component
function Login({ onLogin }) {
  const [login, setLogin] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login)
      });
      const data = await res.json();
      if (data.token) {
        onLogin(data.token);
        setError('');
      } else {
        setError('Invalid login');
      }
    } catch {
      setError('Login failed');
    }
  };

  return (
    <div className="login-root">
      <div className="login-container">
        <div className="header" style={{marginBottom: 24}}>BirdWatch Login</div>
        <input
          placeholder="Username"
          value={login.username}
          onChange={e => setLogin({ ...login, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={login.password}
          onChange={e => setLogin({ ...login, password: e.target.value })}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
      </div>
    </div>
  );
}

export default App;
