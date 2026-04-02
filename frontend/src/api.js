import axios from 'axios';

<<<<<<< HEAD
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_BASE });

// ── Courses ──────────────────────────────────────────────
export const getCourses     = ()           => api.get('/courses');
export const getCourse      = (id)         => api.get(`/courses/${id}`);
export const createCourse   = (data)       => api.post('/courses', data);
export const updateCourse   = (id, data)   => api.put(`/courses/${id}`, data);
export const deleteCourse   = (id)         => api.delete(`/courses/${id}`);

// ── Students ─────────────────────────────────────────────
export const getStudents    = ()           => api.get('/students');
export const getStudent     = (id)         => api.get(`/students/${id}`);
export const createStudent  = (data)       => api.post('/students', data);
export const updateStudent  = (id, data)   => api.put(`/students/${id}`, data);
export const deleteStudent  = (id)         => api.delete(`/students/${id}`);

// ── Registration ─────────────────────────────────────────
export const registerCourse = (sId, cId)  => api.post(`/students/${sId}/register/${cId}`);
export const dropCourse     = (sId, cId)  => api.delete(`/students/${sId}/drop/${cId}`);
=======
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8090/api';

const api = axios.create({ baseURL: API_BASE });

// Courses
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// Students
export const getStudents = () => api.get('/students');
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Registration
export const registerCourse = (sId, cId) =>
  api.post(`/students/${sId}/register/${cId}`);

export const dropCourse = (sId, cId) =>
  api.delete(`/students/${sId}/drop/${cId}`);
>>>>>>> f69bbc1253168534ba9dcff2f2c158e8927c2c5b
