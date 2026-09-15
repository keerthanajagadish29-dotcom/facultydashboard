/**
 * app.js — Shared helpers for Faculty Portal
 */

// ── Auth guard ────────────────────────────────────────────────────────────────
function requireAuth() {
  const n = sessionStorage.getItem('faculty_name');
  if (!n) { window.location.href = 'login.html'; return null; }
  return { name: n, id: sessionStorage.getItem('faculty_id'), role: sessionStorage.getItem('faculty_role') || 'faculty' };
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function buildSidebar(activePage) {
  const user = requireAuth();
  if (!user) return '';
  const college = APP_DATA.getCollegeInfo();
  const NAV = [
    { id: 'dashboard',     icon: '🏠', label: 'Dashboard',       href: 'dashboard.html' },
    { id: 'subjects',      icon: '📚', label: 'My Subjects',      href: 'subjects.html' },
    { id: 'timetable',     icon: '🗓', label: 'Timetable',        href: 'timetable.html' },
    { id: 'attendance',    icon: '✅', label: 'Attendance',       href: 'attendance.html' },
    { id: 'marks',         icon: '📊', label: 'Internal Marks',   href: 'marks.html' },
    { id: 'performance',   icon: '📈', label: 'Performance',      href: 'performance.html' },
    { id: 'reports',       icon: '📋', label: 'Reports',          href: 'reports.html' },
    { id: 'announcements', icon: '📢', label: 'Announcements',    href: 'announcements.html' },
    { id: 'activity',      icon: '🔒', label: 'Login Activity',   href: 'activity.html' },
    { id: 'settings',      icon: '⚙️', label: 'Settings',         href: 'settings.html' },
  ];
  const initials = user.name.split(' ').filter(Boolean).map(w => w[0]).slice(0,2).join('').toUpperCase();
  const navHTML = NAV.map(item =>
    `<a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}">
       <span class="icon">${item.icon}</span>${item.label}
     </a>`).join('');

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="college-name">${college.name}</div>
        <div class="portal-label">Faculty Portal · ${college.academicYear}</div>
      </div>
      <div class="sidebar-user">
        <div class="avatar">${initials}</div>
        <div>
          <div class="name">${user.name}</div>
          <div class="role">${user.id} · ${college.dept || 'Faculty'}</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">Navigation</div>
        ${navHTML}
        <div class="nav-section-label" style="margin-top:10px;">Admin</div>
        <a href="admin.html" class="nav-item ${activePage==='admin'?'active':''}"><span class="icon">🛡</span>Admin Panel</a>
        <a href="student.html" class="nav-item ${activePage==='student'?'active':''}"><span class="icon">🎓</span>Student View</a>
      </nav>
      <div class="sidebar-footer">
        <a href="#" onclick="logout()" style="color:rgba(255,255,255,.6);font-size:.78rem;">🚪 Logout</a>
        <span style="float:right">v3.0</span>
      </div>
    </aside>`;
}

// ── Header ────────────────────────────────────────────────────────────────────
function buildHeader(pageTitle) {
  const user = requireAuth();
  if (!user) return '';
  const annCount = APP_DATA.getAnnouncements().length;
  return `
    <header class="top-header">
      <div style="display:flex;align-items:center;gap:14px;">
        <button class="btn-icon" onclick="toggleSidebar()" id="menu-btn" style="display:none">☰</button>
        <div class="page-title">${pageTitle}</div>
      </div>
      <div class="header-right">
        <button class="badge-btn" onclick="window.location.href='announcements.html'">
          🔔<span class="badge">${annCount || 0}</span>
        </button>
        <button class="watsonx-btn" onclick="openWatsonxPanel()">
          <div class="dot"></div>watsonx AI
        </button>
        <span style="font-size:.8rem;font-weight:600;color:var(--primary)">${user.name.split(' ').slice(-1)[0]}</span>
      </div>
    </header>`;
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    const log = JSON.parse(localStorage.getItem('login_log') || '[]');
    log.unshift({ ts: new Date().toLocaleString(), action: 'Logout', device: 'Portal' });
    localStorage.setItem('login_log', JSON.stringify(log.slice(0,10)));
    sessionStorage.clear();
    window.location.href = 'login.html';
  }
}

// ── watsonx AI Side Panel ─────────────────────────────────────────────────────
function openWatsonxPanel() {
  const existing = document.getElementById('wx-panel');
  if (existing) {
    const isHidden = existing.style.transform === 'translateX(100%)';
    existing.style.transform = isHidden ? 'translateX(0)' : 'translateX(100%)';
    return;
  }
  const panel = document.createElement('div');
  panel.id = 'wx-panel';
  panel.style.cssText = 'position:fixed;right:0;top:0;bottom:0;width:340px;background:#fff;border-left:1px solid var(--border);z-index:400;display:flex;flex-direction:column;transform:translateX(0);transition:transform .3s;box-shadow:-4px 0 20px rgba(0,0,0,.1);';
  panel.innerHTML = `
    <div style="background:var(--primary);color:#fff;padding:16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
      <div><div style="font-weight:700;font-size:.95rem;">🤖 IBM watsonx AI</div>
      <div style="font-size:.7rem;opacity:.7">Granite-13B Instruct</div></div>
      <button onclick="openWatsonxPanel()" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer">✕</button>
    </div>
    <div id="wx-msgs" style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#f8fafc;"></div>
    <div style="padding:12px;border-top:1px solid var(--border);background:#fff;flex-shrink:0;">
      <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
        <button onclick="wxQuick('Analyze attendance')" class="btn btn-sm btn-outline">Attendance</button>
        <button onclick="wxQuick('Analyze student performance')" class="btn btn-sm btn-outline">Performance</button>
        <button onclick="wxQuick('Generate a semester report summary')" class="btn btn-sm btn-outline">Report</button>
      </div>
      <div style="display:flex;gap:8px;">
        <input id="wx-input" type="text" class="form-control" placeholder="Ask AI anything…" style="flex:1"/>
        <button onclick="wxSend()" class="btn btn-primary btn-sm">Send</button>
      </div>
      ${typeof WATSONX !== 'undefined' && !WATSONX.isConfigured() ? '<div style="font-size:.7rem;color:#f97316;margin-top:6px;">⚠ Demo mode – add API key in Settings.</div>' : ''}
    </div>`;
  document.body.appendChild(panel);
  document.getElementById('wx-input').addEventListener('keydown', e => { if (e.key === 'Enter') wxSend(); });
  wxAddMsg('ai', 'Hello! I\'m your IBM watsonx AI assistant. Ask me anything about attendance, marks, or student performance.');
}

function wxAddMsg(type, text) {
  const msgs = document.getElementById('wx-msgs');
  if (!msgs) return;
  const div = document.createElement('div');
  div.style.cssText = type === 'user'
    ? 'background:var(--primary);color:#fff;padding:10px 12px;border-radius:12px 12px 4px 12px;font-size:.82rem;max-width:85%;align-self:flex-end;word-break:break-word;'
    : 'background:#fff;border:1px solid var(--border);padding:10px 12px;border-radius:12px 12px 12px 4px;font-size:.82rem;max-width:90%;word-break:break-word;';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

async function wxSend() {
  const input = document.getElementById('wx-input');
  if (!input || !input.value.trim()) return;
  const msg = input.value.trim();
  input.value = '';
  wxAddMsg('user', msg);
  const thinking = document.createElement('div');
  thinking.style.cssText = 'color:var(--muted);font-size:.78rem;padding:6px;';
  thinking.textContent = '⏳ Thinking…';
  thinking.id = 'wx-thinking';
  document.getElementById('wx-msgs').appendChild(thinking);
  document.getElementById('wx-msgs').scrollTop = 99999;
  try {
    const res = await WATSONX.generate(msg, { maxTokens: 350 });
    document.getElementById('wx-thinking')?.remove();
    wxAddMsg('ai', res);
  } catch(e) {
    document.getElementById('wx-thinking')?.remove();
    wxAddMsg('ai', 'Error – please check your watsonx credentials in Settings.');
  }
}

function wxQuick(prompt) {
  const inp = document.getElementById('wx-input');
  if (inp) { inp.value = prompt; wxSend(); }
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatDate(d) { return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }); }
function getDay()      { return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()]; }
function getCurrentTime() { return new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true }); }

function initPage(page, title) {
  const sp = document.getElementById('sidebar-placeholder');
  const hp = document.getElementById('header-placeholder');
  if (sp) sp.innerHTML = buildSidebar(page);
  if (hp) hp.innerHTML = buildHeader(title);
  if (window.innerWidth <= 900) {
    const mb = document.getElementById('menu-btn');
    if (mb) mb.style.display = 'block';
  }
}
