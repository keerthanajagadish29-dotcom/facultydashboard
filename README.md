# Faculty Portal
## Powered by IBM watsonx AI — Works for Any College

---

## 🚀 How to Open

This is a **plain HTML project** — no installation, no server, no npm needed.

### Option 1 — Double-click (simplest)
1. Open the project folder `Faculty login/`
2. Double-click **`login.html`**
3. It opens directly in your browser (Chrome, Edge, Firefox)

### Option 2 — VS Code Live Server (recommended for development)
1. Open the folder in **VS Code**
2. Install the **Live Server** extension (by Ritwick Dey)
3. Right-click `login.html` → **"Open with Live Server"**
4. Browser opens at `http://127.0.0.1:5500/login.html`

### Option 3 — Browser drag & drop
1. Open Chrome or Edge
2. Drag `login.html` from File Explorer into the browser tab

---

## 🔑 Demo Login Credentials

| Role | ID | Password |
|---|---|---|
| Faculty | `faculty` | `faculty123` |
| Admin | `admin` | `admin123` |
| Student | `student` | `student123` |

---

## 🏫 First-Time Setup (for your college)

1. **Login** with any credential above
2. Go to **Settings → Profile** — enter your college name, department, designation
3. Go to **Timetable → 📤 Upload Timetable** — upload your timetable as CSV or JSON
4. Go to **Admin Panel** — add your students and subjects
5. Done — the portal now shows your college name and data everywhere

---

## 🤖 IBM watsonx AI Setup (optional)

1. Sign in at **cloud.ibm.com**
2. Create an **API Key**: Manage → Access → API Keys
3. Open **watsonx.ai** → Create a project
4. Copy **Project ID** from Project Settings
5. In the portal: **Settings → watsonx AI** → paste credentials → **Save & Connect**

> Without credentials the portal runs in **demo mode** with sample AI responses.

---

## 📁 File Structure

```
Faculty login/
├── login.html              — Login (OTP, 2FA, forgot password)
├── dashboard.html          — Main dashboard with AI insights
├── timetable.html          — Weekly/daily view + Upload timetable (CSV/JSON)
├── attendance.html         — Attendance marking
├── marks.html              — Internal marks management
├── performance.html        — Student performance reports
├── reports.html            — Report generation
├── subjects.html           — Assigned subjects
├── announcements.html      — College announcements
├── activity.html           — Login activity & security log
├── settings.html           — Profile, password, watsonx config
├── admin.html              — Admin panel
├── student.html            — Student portal
│
├── css/style.css           — Global styles
└── js/
    ├── app.js              — Shared helpers, sidebar, watsonx chat
    ├── data.js             — localStorage helpers
    └── watsonx.js          — IBM watsonx Runtime API
```

---

## 📋 Key Features

| Module | What it does |
|---|---|
| **Login** | Faculty ID/Email, OTP reset, 2FA |
| **Timetable** | Upload CSV/JSON, weekly & daily view |
| **Attendance** | Period-based, auto-lock, monthly reports |
| **Marks** | Internal 1 & 2, assignments, lab, auto-grade |
| **Performance** | Per-student analytics, AI anomaly detection |
| **Admin** | Manage faculty/students/subjects, audit log |
| **Student** | View attendance, marks, timetable, apply leave |
| **watsonx AI** | Attendance analysis, performance insights, report generation |

---

*Made with IBM watsonx AI Runtime*
