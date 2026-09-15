/**
 * data.js — Generic seed data for Faculty Portal
 * No college-specific timetable. Timetable is built by the user via timetable.html.
 */

const APP_DATA = (() => {

  // ── Timetable helpers ─────────────────────────────────────────────────────────
  // Returns the timetable from localStorage (built by the user), or an empty shell.
  function getTimetable() {
    try {
      const stored = localStorage.getItem('portal_timetable');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    // Empty shell — 6 days, no slots
    return ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(day => ({
      day, slots: []
    }));
  }

  function saveTimetable(data) {
    localStorage.setItem('portal_timetable', JSON.stringify(data));
  }

  // ── College info (editable in Settings) ──────────────────────────────────────
  function getCollegeInfo() {
    try {
      const stored = localStorage.getItem('portal_college');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return {
      name: 'My College',
      dept: 'Department',
      class: 'Class / Section',
      semester: 'Semester',
      academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    };
  }

  function saveCollegeInfo(info) {
    localStorage.setItem('portal_college', JSON.stringify(info));
  }

  // ── Faculty (stored in localStorage so admin can manage) ─────────────────────
  function getFaculty() {
    try {
      const stored = localStorage.getItem('portal_faculty');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [
      { id: 'F001', name: 'Faculty Member 1', email: 'faculty1@college.edu', dept: 'Department', designation: 'Asst. Professor', subjects: [], phone: '', joined: new Date().toISOString().split('T')[0], status: 'active' },
    ];
  }

  function saveFaculty(data) {
    localStorage.setItem('portal_faculty', JSON.stringify(data));
  }

  // ── Subjects (stored in localStorage) ────────────────────────────────────────
  function getSubjects() {
    try {
      const stored = localStorage.getItem('portal_subjects');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [];
  }

  function saveSubjects(data) {
    localStorage.setItem('portal_subjects', JSON.stringify(data));
  }

  // ── Students (stored in localStorage) ────────────────────────────────────────
  function getStudents() {
    try {
      const stored = localStorage.getItem('portal_students');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [];
  }

  function saveStudents(data) {
    localStorage.setItem('portal_students', JSON.stringify(data));
  }

  // ── Attendance log ────────────────────────────────────────────────────────────
  function getAttendanceLog() {
    try {
      const stored = localStorage.getItem('portal_att_log');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [];
  }

  function appendAttendanceLog(entry) {
    const log = getAttendanceLog();
    log.unshift(entry);
    localStorage.setItem('portal_att_log', JSON.stringify(log.slice(0, 200)));
  }

  // ── Announcements ─────────────────────────────────────────────────────────────
  function getAnnouncements() {
    try {
      const stored = localStorage.getItem('portal_announcements');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [];
  }

  function saveAnnouncements(data) {
    localStorage.setItem('portal_announcements', JSON.stringify(data));
  }

  // ── Login Activity ────────────────────────────────────────────────────────────
  function getLoginActivity() {
    return JSON.parse(localStorage.getItem('login_log') || '[]');
  }

  // ── Audit Log ────────────────────────────────────────────────────────────────
  function getAuditLog() {
    try {
      const stored = localStorage.getItem('portal_audit');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [];
  }

  function appendAudit(action, module, detail) {
    const log = getAuditLog();
    const user = sessionStorage.getItem('faculty_name') || 'Unknown';
    log.unshift({ id: Date.now(), action, module, user, detail, ts: new Date().toLocaleString() });
    localStorage.setItem('portal_audit', JSON.stringify(log.slice(0, 500)));
  }

  return {
    getTimetable, saveTimetable,
    getCollegeInfo, saveCollegeInfo,
    getFaculty, saveFaculty,
    getSubjects, saveSubjects,
    getStudents, saveStudents,
    getAttendanceLog, appendAttendanceLog,
    getAnnouncements, saveAnnouncements,
    getLoginActivity,
    getAuditLog, appendAudit,
  };
})();
