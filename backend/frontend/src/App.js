import React, { useState, useCallback } from 'react';
import Dashboard    from './pages/Dashboard';
import CoursesPage  from './pages/CoursesPage';
import StudentsPage from './pages/StudentsPage';
import Toast        from './components/Toast';

let toastId = 0;

export default function App() {
  const [page,   setPage]   = useState('dashboard');
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts(t => [...t, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <span className="navbar-brand">
          🎓 <span>CourseReg</span> System
        </span>
        <div className="nav-links">
          {[
            { key:'dashboard', label:'Dashboard' },
            { key:'courses',   label:'Courses' },
            { key:'students',  label:'Students' },
          ].map(item => (
            <button
              key={item.key}
              className={`nav-link ${page === item.key ? 'active' : ''}`}
              onClick={() => setPage(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="main">
        {page === 'dashboard' && <Dashboard    notify={notify} />}
        {page === 'courses'   && <CoursesPage  notify={notify} />}
        {page === 'students'  && <StudentsPage notify={notify} />}
      </main>

      <Toast toasts={toasts} remove={removeToast} />
    </div>
  );
}
