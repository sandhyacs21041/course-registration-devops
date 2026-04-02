import React, { useEffect, useState, useCallback } from 'react';
import { getStudents, getCourses, createStudent, updateStudent, deleteStudent, registerCourse, dropCourse } from '../api';
import StudentModal from '../components/StudentModal';

export default function StudentsPage({ notify }) {
  const [students, setStudents] = useState([]);
  const [courses,  setCourses]  = useState([]);
  const [search,   setSearch]   = useState('');
  const [modal,    setModal]    = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [regModal, setRegModal] = useState(null); // student object

  const load = useCallback(async () => {
    try {
      const [sr, cr] = await Promise.all([getStudents(), getCourses()]);
      setStudents(sr.data);
      setCourses(cr.data);
    } catch { notify('Failed to load data', 'error'); }
    setLoading(false);
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (form) => {
    try {
      if (modal && modal.id) { await updateStudent(modal.id, form); notify('Student updated', 'success'); }
      else                   { await createStudent(form);           notify('Student added', 'success'); }
      setModal(null); load();
    } catch (e) { notify(e.response?.data || 'Error saving student', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try { await deleteStudent(id); notify('Student deleted', 'success'); load(); }
    catch { notify('Could not delete student', 'error'); }
  };

  const handleRegister = async (studentId, courseId) => {
    try {
      await registerCourse(studentId, courseId);
      notify('Registered successfully!', 'success');
      load();
    } catch (e) { notify(e.response?.data || 'Registration failed', 'error'); }
  };

  const handleDrop = async (studentId, courseId) => {
    if (!window.confirm('Drop this course?')) return;
    try {
      await dropCourse(studentId, courseId);
      notify('Course dropped', 'success');
      load();
    } catch (e) { notify(e.response?.data || 'Drop failed', 'error'); }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>🎓 Students</h1>
        <p>Manage students and their course registrations</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Students</div><div className="stat-value stat-text">{students.length}</div></div>
        <div className="stat-card"><div className="stat-label">Total Registrations</div><div className="stat-value stat-blue">{students.reduce((a,s)=>a+(s.registeredCourses?.length||0),0)}</div></div>
        <div className="stat-card"><div className="stat-label">Avg Courses/Student</div><div className="stat-value stat-green">{students.length ? (students.reduce((a,s)=>a+(s.registeredCourses?.length||0),0)/students.length).toFixed(1) : '0'}</div></div>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="🔍  Search students…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => setModal('new')}>+ Add Student</button>
        </div>
      </div>

      {loading ? (
        <div className="empty"><div className="empty-icon">⏳</div><p>Loading…</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty"><div className="empty-icon">👤</div><p>No students found</p></div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>ID</th>
                <th>Department</th>
                <th>Courses</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <React.Fragment key={s.id}>
                  <tr>
                    <td>
                      <div style={{ fontWeight:600 }}>{s.name}</div>
                      <div style={{ color:'var(--muted)', fontSize:'0.78rem' }}>{s.email}</div>
                    </td>
                    <td><span style={{ fontFamily:'var(--mono)', fontSize:'0.82rem', color:'var(--accent)' }}>{s.studentId}</span></td>
                    <td style={{ color:'var(--muted)', fontSize:'0.85rem' }}>{s.department}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span className="badge badge-open">{s.registeredCourses?.length || 0} courses</span>
                        <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(expanded===s.id ? null : s.id)}>
                          {expanded===s.id ? '▲' : '▼'}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:4 }}>
                        <button className="btn btn-blue btn-sm" onClick={() => setRegModal(s)}>+ Register</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setModal(s)}>✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                  {expanded === s.id && (
                    <tr>
                      <td colSpan={5} style={{ background:'var(--bg)', padding:'0.75rem 1rem' }}>
                        {(!s.registeredCourses || s.registeredCourses.length === 0) ? (
                          <span style={{ color:'var(--muted)', fontSize:'0.85rem' }}>No registered courses</span>
                        ) : (
                          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                            {s.registeredCourses.map(c => (
                              <div key={c.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:6, padding:'5px 10px', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:6 }}>
                                <span style={{ fontFamily:'var(--mono)', color:'var(--accent)' }}>{c.code}</span>
                                <span>{c.name}</span>
                                <button className="btn btn-danger btn-sm" style={{ padding:'2px 6px', fontSize:'0.7rem' }} onClick={() => handleDrop(s.id, c.id)}>Drop</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal !== null && (
        <StudentModal student={modal==='new'?null:modal} onSave={handleSave} onClose={() => setModal(null)} />
      )}

      {regModal && (
        <RegisterModal student={regModal} courses={courses} onRegister={handleRegister} onClose={() => setRegModal(null)} />
      )}
    </div>
  );
}

function RegisterModal({ student, courses, onRegister, onClose }) {
  const [selected, setSelected] = useState('');
  const registered = new Set((student.registeredCourses||[]).map(c=>c.id));
  const available  = courses.filter(c => c.status==='OPEN' && !registered.has(c.id));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>📋 Register for Course</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>
        <p style={{ color:'var(--muted)', fontSize:'0.85rem', marginBottom:'1rem' }}>Student: <strong style={{ color:'var(--text)' }}>{student.name}</strong></p>
        <div className="form-group">
          <label>Select Course</label>
          <select className="form-control" value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">-- Choose a course --</option>
            {available.map(c => (
              <option key={c.id} value={c.id}>{c.code} — {c.name} ({c.enrolled}/{c.capacity})</option>
            ))}
          </select>
        </div>
        {available.length === 0 && <p style={{ color:'var(--muted)', fontSize:'0.85rem' }}>No available courses to register.</p>}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!selected} onClick={() => { onRegister(student.id, selected); onClose(); }}>Register</button>
        </div>
      </div>
    </div>
  );
}
