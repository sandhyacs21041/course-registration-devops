import React, { useEffect, useState, useCallback } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api';
import CourseModal from '../components/CourseModal';

export default function CoursesPage({ notify }) {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);   // null | 'new' | course-object
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const r = await getCourses();
      setCourses(r.data);
    } catch { notify('Failed to load courses', 'error'); }
    setLoading(false);
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    try {
      if (modal && modal.id) {
        await updateCourse(modal.id, form);
        notify('Course updated', 'success');
      } else {
        await createCourse(form);
        notify('Course created', 'success');
      }
      setModal(null);
      load();
    } catch (e) {
      notify(e.response?.data || 'Error saving course', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      notify('Course deleted', 'success');
      load();
    } catch { notify('Could not delete course', 'error'); }
  };

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  const pct = (c) => Math.round((c.enrolled / c.capacity) * 100);

  return (
    <div>
      <div className="page-header">
        <h1>📚 Courses</h1>
        <p>Manage all available courses in the system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value stat-text">{courses.length}</div></div>
        <div className="stat-card"><div className="stat-label">Open</div><div className="stat-value stat-green">{courses.filter(c=>c.status==='OPEN').length}</div></div>
        <div className="stat-card"><div className="stat-label">Full</div><div className="stat-value stat-warn">{courses.filter(c=>c.status==='FULL').length}</div></div>
        <div className="stat-card"><div className="stat-label">Enrolled</div><div className="stat-value stat-blue">{courses.reduce((a,c)=>a+c.enrolled,0)}</div></div>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="🔍  Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => setModal('new')}>+ New Course</button>
        </div>
      </div>

      {loading ? (
        <div className="empty"><div className="empty-icon">⏳</div><p>Loading courses…</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty"><div className="empty-icon">📭</div><p>No courses found</p></div>
      ) : (
        <div className="card-grid">
          {filtered.map(c => {
            const p = pct(c);
            const fillClass = p >= 100 ? 'fill-red' : p >= 80 ? 'fill-yellow' : 'fill-green';
            return (
              <div className="card" key={c.id}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                  <div className="course-code">{c.code}</div>
                  <span className={`badge badge-${c.status === 'OPEN' ? 'open' : 'full'}`}>{c.status}</span>
                </div>
                <div className="course-name">{c.name}</div>
                <div className="course-meta">
                  <span>👤 {c.instructor}</span>
                  <span>🕐 {c.schedule}</span>
                  <span>⭐ {c.credits} credits</span>
                  {c.description && <span style={{ color:'var(--muted)', marginTop:2 }}>{c.description}</span>}
                </div>

                <div style={{ marginTop:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.78rem', color:'var(--muted)' }}>
                    <span>Enrollment</span>
                    <span>{c.enrolled}/{c.capacity}</span>
                  </div>
                  <div className="progress-bar">
                    <div className={`progress-fill ${fillClass}`} style={{ width: `${Math.min(p,100)}%` }} />
                  </div>
                </div>

                <div className="course-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => setModal(c)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>🗑 Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal !== null && (
        <CourseModal
          course={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
