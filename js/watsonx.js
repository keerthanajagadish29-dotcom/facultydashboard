/**
 * watsonx.js — IBM watsonx Runtime Integration
 * Faculty Portal
 *
 * Replace WATSONX_API_KEY and PROJECT_ID with your credentials.
 * All AI calls go through this module.
 */

const WATSONX = (() => {
  // ── Config ─────────────────────────────────────────────────────────────────
  const CONFIG = {
    API_KEY:    localStorage.getItem('wx_api_key')    || 'ApiKey-0ae35a9e-ce73-4bb1-85a6-136d892085f5',
    PROJECT_ID: localStorage.getItem('wx_project_id') || '4d539e47-32a8-4fac-8787-0d8c9f14f97a',
    REGION:     'us-south', // us-south | eu-de | jp-tok
    MODEL_ID:   'ibm/granite-13b-instruct-v2',
    IAM_URL:    'https://iam.cloud.ibm.com/identity/token',
    WX_URL:     'https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29',
  };

  let _token = null;
  let _tokenExpiry = 0;

  // ── Get IAM Bearer Token ────────────────────────────────────────────────────
  async function getToken() {
    if (_token && Date.now() < _tokenExpiry) return _token;
    try {
      const res = await fetch(CONFIG.IAM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${CONFIG.API_KEY}`
      });
      if (!res.ok) throw new Error(`IAM error ${res.status}`);
      const data = await res.json();
      _token = data.access_token;
      _tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
      return _token;
    } catch (e) {
      console.warn('[watsonx] Token fetch failed – using mock mode', e.message);
      return null;
    }
  }

  // ── Core text generation ────────────────────────────────────────────────────
  async function generate(prompt, params = {}) {
    const token = await getToken();
    if (!token) return _mockGenerate(prompt);

    const body = {
      model_id: CONFIG.MODEL_ID,
      project_id: CONFIG.PROJECT_ID,
      input: prompt,
      parameters: {
        decoding_method: params.decoding || 'greedy',
        max_new_tokens:  params.maxTokens || 400,
        temperature:     params.temperature || 0.7,
        stop_sequences:  params.stop || [],
      }
    };

    try {
      const res = await fetch(CONFIG.WX_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':  'application/json',
          'Accept':        'application/json',
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`WX error ${res.status}`);
      const data = await res.json();
      return data.results?.[0]?.generated_text?.trim() || '';
    } catch (e) {
      console.warn('[watsonx] Generation failed – using mock', e.message);
      return _mockGenerate(prompt);
    }
  }

  // ── Mock responses for offline / demo mode ──────────────────────────────────
  function _mockGenerate(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('attendance')) return 'Attendance is currently at 78%. Students below 75% threshold: Ravi Kumar, Priya Sharma. Recommend issuing attendance warnings.';
    if (p.includes('performance')) return 'Overall class performance is satisfactory. Top performer: Sneha Patel (92%). Struggling students need attention in Cryptography topic.';
    if (p.includes('marks')) return 'Internal marks have been uploaded. Average score: 68/100. 3 students have incomplete submissions.';
    if (p.includes('timetable')) return 'Your next class is Web Programming at 11:30 AM in Room 203. You have 3 classes today.';
    if (p.includes('report')) return 'Semester report summary: Average attendance 82%, Average internal marks 71/100. Class performing above college average.';
    if (p.includes('anomal')) return 'Anomaly detected: Student Arjun Mehta has dropped attendance from 90% to 62% in the last 2 weeks. Recommend counselling.';
    return 'AI analysis complete. No critical issues detected in the current period. All systems are operating normally.';
  }

  // ── High-level helpers ──────────────────────────────────────────────────────

  async function analyzeAttendance(data) {
    const prompt = `You are an academic assistant. Analyze the following attendance data and provide insights, warnings for students below 75%, and recommendations:\n${JSON.stringify(data, null, 2)}\nAnalysis:`;
    return generate(prompt, { maxTokens: 300 });
  }

  async function analyzePerformance(data) {
    const prompt = `You are an academic performance advisor. Analyze the following student performance data and identify at-risk students, top performers, and class trends:\n${JSON.stringify(data, null, 2)}\nInsights:`;
    return generate(prompt, { maxTokens: 350 });
  }

  async function generateReport(type, data) {
    const prompt = `Generate a concise academic ${type} report for faculty:\n${JSON.stringify(data, null, 2)}\nReport:`;
    return generate(prompt, { maxTokens: 400 });
  }

  async function detectAnomalies(data) {
    const prompt = `Analyze this student data for anomalies such as sudden attendance drops, failing marks, or unusual patterns:\n${JSON.stringify(data, null, 2)}\nAnomalies detected:`;
    return generate(prompt, { maxTokens: 250 });
  }

  async function suggestRemedialAction(studentData) {
    const prompt = `Based on the following student academic data, suggest specific remedial actions:\n${JSON.stringify(studentData, null, 2)}\nRemedial actions:`;
    return generate(prompt, { maxTokens: 300 });
  }

  // ── Settings ────────────────────────────────────────────────────────────────
  function setCredentials(apiKey, projectId) {
    CONFIG.API_KEY    = apiKey;
    CONFIG.PROJECT_ID = projectId;
    localStorage.setItem('wx_api_key',    apiKey);
    localStorage.setItem('wx_project_id', projectId);
    _token = null; // force re-auth
  }

  function isConfigured() {
    return CONFIG.API_KEY !== 'YOUR_WATSONX_API_KEY' && CONFIG.API_KEY.length > 10;
  }

  return {
    generate,
    analyzeAttendance,
    analyzePerformance,
    generateReport,
    detectAnomalies,
    suggestRemedialAction,
    setCredentials,
    isConfigured,
  };
})();
