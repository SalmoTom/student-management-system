import { useState } from "react";
import "./App.css";

// Reuse your classifyScore logic from Exercise 1
const classifyScore = (score) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 65) return "Needs Improvement";
  return "Failed";
};

// Student component with name and score props
const Student = ({ id, name, score, onLog, onRemove }) => {
  const category = classifyScore(score);
  const isExcellent = score >= 90;
  
  return (
    <div className="student-card">
      <div className="student-header">
        <h3 className="student-name">{name}</h3>
        <span className={`category-badge ${category.toLowerCase().replace(" ", "-")}`}>
          {category}
        </span>
      </div>
      
      <div className="student-info">
        <div className="score-display">
          <span className="score-label">Score:</span>
          <span className="score-value">{score}</span>
        </div>
        {isExcellent && (
          <div className="excellent-badge">
            <span className="star">⭐</span> Excellent Performance!
          </div>
        )}
      </div>
      
      <div className="student-actions">
        <button onClick={() => onLog(name)} className="btn btn-secondary">
          Log Name
        </button>
        <button onClick={() => onRemove(id)} className="btn btn-danger">
          Remove
        </button>
      </div>
    </div>
  );
};

// Login Component
const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (pass) => {
    // At least 6 characters, one uppercase, one special character
    const hasLength = pass.length >= 6;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    return hasLength && hasUpperCase && hasSpecialChar;
  };

  const handleLogin = () => {
    setError("");

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters with one uppercase letter and one special character");
      return;
    }

    // Login successful
    onLogin();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome!</h1>
          <p className="login-subtitle">Enter details to continue</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input login-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input login-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="login-options">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox"
              />
              <span>Remember me</span>
            </label>
            <button className="forgot-password">Forgot password?</button>
          </div>

          <button onClick={handleLogin} className="btn btn-primary login-button">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [students, setStudents] = useState([]);
  const [newName, setNewName] = useState("");
  const [newScore, setNewScore] = useState("");
  const [search, setSearch] = useState("");
  const [showPassingOnly, setShowPassingOnly] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    setIsLoggedIn(false);
    // Reset all data
    setStudents([]);
    setNewName("");
    setNewScore("");
    setSearch("");
    setShowPassingOnly(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleAddStudent = () => {
    if (!newName.trim()) {
      alert("Please enter a name");
      return;
    }
    
    if (!newScore) {
      alert("Please enter a score");
      return;
    }
    
    const convertedScore = Number(newScore);
    if (isNaN(convertedScore) || convertedScore < 0 || convertedScore > 100) {
      alert("Score must be a number between 0 and 100");
      return;
    }
    
    const newStudent = {
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
      name: newName.trim(),
      score: convertedScore
    };
    
    setStudents([...students, newStudent]);
    setNewName("");
    setNewScore("");
  };
  
  const handleLogName = (name) => {
    console.log(name);
  };
  
  const handleRemoveStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };
  
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const isPassing = student.score >= 80;
    return showPassingOnly ? matchesSearch && isPassing : matchesSearch;
  });

  // Show login form if not logged in
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }
  
  return (
    <div className="app-container">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleLogoutCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h2 className="modal-title">Confirm Logout</h2>
            <p className="modal-message">Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button onClick={handleLogoutCancel} className="btn btn-secondary modal-btn">
                Cancel
              </button>
              <button onClick={handleLogoutConfirm} className="btn btn-danger modal-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <header className="app-header">
          <div>
            <h1 className="app-title">Student Management System</h1>
            <p className="app-subtitle">Track and manage student performance</p>
          </div>
          <button onClick={handleLogoutClick} className="btn btn-logout">
          Logout
          </button>
        </header>
        
        <div className="main-content">
          {/* Left Sidebar - Controls */}
          <aside className="sidebar">
            <div className="sidebar-section">
              <h2 className="section-title">Add Student</h2>
              <div className="add-form">
                <input
                  placeholder="Student Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input"
                />
                <input
                  placeholder="Score (0-100)"
                  type="number"
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="input"
                  min="0"
                  max="100"
                />
                <button onClick={handleAddStudent} className="btn btn-primary">
                  ➕ Add Student
                </button>
              </div>
            </div>
            
            <div className="sidebar-section">
              <h2 className="section-title">Filters</h2>
              <div className="filter-controls">
                <input
                  placeholder="🔍 Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input search-input"
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showPassingOnly}
                    onChange={(e) => setShowPassingOnly(e.target.checked)}
                    className="checkbox"
                  />
                  <span>Show passing only (≥80)</span>
                </label>
              </div>
            </div>
          </aside>
          
          {/* Right Main Panel - Student List */}
          <main className="main-panel">
            <div className="panel-header">
              <div>
                <span className="student-count">
                  Students
                  <span className="count-badge">{filteredStudents.length}</span>
                </span>
              </div>
            </div>
            
            <div className="panel-content">
              {filteredStudents.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📚</div>
                  <p className="empty-text">No students yet</p>
                  <p className="empty-subtext">
                    {students.length === 0 
                      ? "Add your first student to get started" 
                      : "Try adjusting your filters"}
                  </p>
                </div>
              ) : (
                <div className="students-grid">
                  {filteredStudents.map((student) => (
                    <Student
                      key={student.id}
                      id={student.id}
                      name={student.name}
                      score={student.score}
                      onLog={handleLogName}
                      onRemove={handleRemoveStudent}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;