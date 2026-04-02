import React, { useState, useEffect } from 'react';

const EMPTY = { name:'', code:'', instructor:'', credits:3, capacity:30, description:'', schedule:'', status:'OPEN' };

export default function CourseModal({ course, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(course ? { ...course } : EMPTY);
  }, [course]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.code || !form.instructor || !form.schedule) return;
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{course ? '✏️ Edit Course' : '➕ Add Course'}</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Course Name *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Data Structures" />
          </div>
          <div className="form-group">
            <label>Course Code *</label>
            <input className="form-control" value={form.code} onChange={e => set('code', e.target.value)} placeholder="e.g. CS201" disabled={!!course} />
          </div>
        </div>

        <div className="form-group">
          <label>Instructor *</label>
          <input className="form-control" value={form.instructor} onChange={e => set('instructor', e.target.value)} placeholder="Dr. Smith" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Credits</label>
            <input className="form-control" type="number" min={1} max={6} value={form.credits} onChange={e => set('credits', +e.target.value)} />
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input className="form-control" type="number" min={1} value={form.capacity} onChange={e => set('capacity', +e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Schedule *</label>
          <input className="form-control" value={form.schedule} onChange={e => set('schedule', e.target.value)} placeholder="Mon/Wed 9:00-10:30 AM" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea className="form-control" rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short course description..." />
        </div>

        {course && (
          <div className="form-group">
            <label>Status</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="OPEN">OPEN</option>
              <option value="FULL">FULL</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : course ? 'Save Changes' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
}
