import React, { useState, useEffect } from 'react';

const EMPTY = { name:'', email:'', studentId:'', department:'' };

export default function StudentModal({ student, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(student ? { name: student.name, email: student.email, studentId: student.studentId, department: student.department } : EMPTY);
  }, [student]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.studentId || !form.department) return;
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{student ? '✏️ Edit Student' : '➕ Add Student'}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label>Full Name *</label>
          <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Alice Sharma" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input className="form-control" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="alice@university.edu" disabled={!!student} />
          </div>
          <div className="form-group">
            <label>Student ID *</label>
            <input className="form-control" value={form.studentId} onChange={e => set('studentId', e.target.value)} placeholder="STU001" disabled={!!student} />
          </div>
        </div>

        <div className="form-group">
          <label>Department *</label>
          <select className="form-control" value={form.department} onChange={e => set('department', e.target.value)}>
            <option value="">-- Select --</option>
            <option>Computer Science</option>
            <option>Information Technology</option>
            <option>Electronics</option>
            <option>Mechanical Engineering</option>
            <option>Civil Engineering</option>
            <option>Mathematics</option>
            <option>Physics</option>
          </select>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : student ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
}
