import React, { useEffect, useState } from 'react';
import { getCourses, getStudents } from '../api';

export default function Dashboard({ notify }) {
  const [courses,  setCourses]  = useState([]);
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getCourses(), getStudents()])
      .then(([cr, sr]) => { setCourses(cr.data); setStudents(sr.data); })
      .catch(() => notify('Failed to load dashboard', 'error'))
      .finally(() => setLoading(false));
  }, [notify]);

  const totalEnrolled   = courses.reduce((a, c) => a + c.enrolled, 0);
  const totalCapacity   = courses.reduce((a, c) => a + c.capacity, 0);
  const openCourses     = courses.filter(c => c.status === 'OPEN').length;
  const topCourses      = [...courses].sort((a,b) => b.enrolled - a.enrolled).slice(0,5);
  const recentStudents  = [...students].slice(-5).reverse();

  if (loading) return <div className="empty"><div className="empty-icon">⏳</div><p>Loading dashboard…</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1>🏠 Dashboard</h1>
        <p>Course Registration System — Overview</p>
      </div>

      {/* KPI */}
      <div className="stats-grid" style={{ gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))' }}>
        <div className="stat-card"><div className="stat-label">Total Courses</div><div className="stat-value stat-text">{courses.length}</div></div>
        <div className="stat-card"><div className="stat-label">Open Courses</div><div className="stat-value stat-green">{openCourses}</div></div>
        <div className="stat-card"><div className="stat-label">Total Students</div><div className="stat-value stat-blue">{students.length}</div></div>
        <div className="stat-card"><div className="stat-label">Total Enrolled</div><div className="stat-value stat-warn">{totalEnrolled}</div></div>
        <div className="stat-card"><div className="stat-label">Seat Utilization</div><div className="stat-value stat-text">{totalCapacity ? Math.round(totalEnrolled/totalCapacity*100) : 0}%</div></div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginTop:'0.5rem' }}>
        {/* Top Courses */}
        <div className="card">
          <h3 style={{ fontWeight:700, marginBottom:'1rem', fontSize:'0.95rem' }}>🔥 Top Enrolled Courses</h3>
          {topCourses.length === 0 ? <p style={{ color:'var(--muted)' }}>No data yet</p> : topCourses.map(c => {
            const p = Math.round(c.enrolled/c.capacity*100);
            const fc = p>=100?'fill-red':p>=80?'fill-yellow':'fill-green';
            return (
              <div key={c.id} style={{ marginBottom:'0.8rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:3 }}>
                  <span><span style={{ fontFamily:'var(--mono)', color:'var(--accent)', marginRight:6 }}>{c.code}</span>{c.name}</span>
                  <span style={{ color:'var(--muted)' }}>{c.enrolled}/{c.capacity}</span>
                </div>
                <div className="progress-bar"><div className={`progress-fill ${fc}`} style={{ width:`${Math.min(p,100)}%` }} /></div>
              </div>
            );
          })}
        </div>

        {/* Recent Students */}
        <div className="card">
          <h3 style={{ fontWeight:700, marginBottom:'1rem', fontSize:'0.95rem' }}>👤 Recent Students</h3>
          {recentStudents.length === 0 ? <p style={{ color:'var(--muted)' }}>No students yet</p> : recentStudents.map(s => (
            <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight:600, fontSize:'0.875rem' }}>{s.name}</div>
                <div style={{ color:'var(--muted)', fontSize:'0.75rem' }}>{s.department} · {s.studentId}</div>
              </div>
              <span className="badge badge-open">{s.registeredCourses?.length||0} courses</span>
            </div>
          ))}
        </div>
      </div>

      {/* DevOps Pipeline Status */}
      <div className="card" style={{ marginTop:'1rem' }}>
        <h3 style={{ fontWeight:700, marginBottom:'1rem', fontSize:'0.95rem' }}>🚀 DevOps Pipeline</h3>
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', alignItems:'center' }}>
          {[
            { icon:'📁', label:'Git', status:'Source' },
            { icon:'🔨', label:'Maven', status:'Build' },
            { icon:'🧪', label:'JUnit', status:'Test' },
            { icon:'⚙️', label:'Jenkins', status:'CI/CD' },
            { icon:'🐳', label:'Docker', status:'Package' },
            { icon:'☁️', label:'Deploy', status:'Prod' },
          ].map((step, i, arr) => (
            <React.Fragment key={step.label}>
              <div style={{ textAlign:'center', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 16px', minWidth:80 }}>
                <div style={{ fontSize:'1.3rem' }}>{step.icon}</div>
                <div style={{ fontWeight:700, fontSize:'0.8rem', marginTop:2 }}>{step.label}</div>
                <div style={{ color:'var(--accent)', fontSize:'0.7rem' }}>{step.status}</div>
              </div>
              {i < arr.length-1 && <span style={{ color:'var(--accent)', fontWeight:700, fontSize:'1.2rem' }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
