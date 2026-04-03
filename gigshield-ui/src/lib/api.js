const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {})
      },
      signal: controller.signal,
      ...options
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(typeof payload === "string" ? payload : payload.error ?? "API request failed");
    }

    return payload;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  }
}

// Helper methods
export const api = {
  // Auth
  requestOtp: (mobile) => apiFetch("/api/auth/request-otp", { method: "POST", body: JSON.stringify({ mobile }) }),
  verifyOtp: (mobile, otp) => apiFetch("/api/auth/verify-otp", { method: "POST", body: JSON.stringify({ mobile, otp }) }),
  
  // Onboarding
  onboard: (data) => apiFetch("/api/workers/onboarding", { method: "POST", body: JSON.stringify(data) }),
  
  // Worker
  workerExists: (id) => apiFetch(`/api/workers/${id}/exists`),
  dashboard: (id) => apiFetch(`/api/workers/${id}/dashboard`),
  policy: (id) => apiFetch(`/api/workers/${id}/policy`),
  purchasePolicy: (id, data) => apiFetch(`/api/workers/${id}/policies/purchase`, { method: "POST", body: JSON.stringify(data) }),
  toggleAutoRenew: (id, autoRenew) => apiFetch(`/api/workers/${id}/policy/auto-renew`, { method: "PATCH", body: JSON.stringify({ autoRenew }) }),
  history: (id) => apiFetch(`/api/workers/${id}/history`),
  points: (id) => apiFetch(`/api/workers/${id}/points`),
  profile: (id) => apiFetch(`/api/workers/${id}/profile`),
  updateProfile: (id, data) => apiFetch(`/api/workers/${id}/profile`, { method: "PATCH", body: JSON.stringify(data) }),
  coverageGap: (id) => apiFetch(`/api/workers/${id}/coverage-gap`),
  notifications: (id) => apiFetch(`/api/workers/${id}/notifications`),
  sendNotification: (id, channel, message) => apiFetch(`/api/workers/${id}/notifications/send`, { method: "POST", body: JSON.stringify({ channel, message }) }),
  referrals: (id) => apiFetch(`/api/workers/${id}/referrals`),
  createReferral: (id, data) => apiFetch(`/api/workers/${id}/referrals`, { method: "POST", body: JSON.stringify(data) }),
  pool: (id) => apiFetch(`/api/workers/${id}/pool`),
  createPoolMotion: (id, data) => apiFetch(`/api/workers/${id}/pool/motions`, { method: "POST", body: JSON.stringify(data) }),
  gigbot: (id, message) => apiFetch(`/api/workers/${id}/gigbot`, { method: "POST", body: JSON.stringify({ message }) }),
  processPayout: (id, eventId) => apiFetch(`/api/workers/${id}/payouts/process`, { method: "POST", body: JSON.stringify({ eventId }) }),
  certificate: (id) => apiFetch(`/api/workers/${id}/certificate`),
  claimStatement: (id, claimId) => apiFetch(`/api/workers/${id}/claims/${claimId}/statement`),
  logout: (id) => apiFetch(`/api/workers/${id}/logout`, { method: "POST" }),
  
  // Admin
  adminOverview: () => apiFetch("/api/admin/overview"),
  adminZones: () => apiFetch("/api/admin/zones"),
  adminZoneSignals: (zoneId) => apiFetch(`/api/admin/zones/${zoneId}/signals`),
  adminLiveFeed: () => apiFetch("/api/admin/live-feed"),
  adminAnalytics: () => apiFetch("/api/admin/analytics"),
  adminFraudCases: () => apiFetch("/api/admin/fraud-cases"),
  adminFraudDecision: (caseId, decision) => apiFetch(`/api/admin/fraud-cases/${caseId}/decision`, { method: "POST", body: JSON.stringify({ decision }) }),
  adminSimulator: (data) => apiFetch("/api/admin/simulator", { method: "POST", body: JSON.stringify(data) }),
  adminForecast: () => apiFetch("/api/admin/forecast"),
  adminLoyalty: () => apiFetch("/api/admin/loyalty"),
  adminPools: () => apiFetch("/api/admin/pools"),
  adminPoolDetail: (zoneId) => apiFetch(`/api/admin/pools/${zoneId}`),
  adminPoolVote: (motionId, vote) => apiFetch(`/api/admin/pools/motions/${motionId}/vote`, { method: "POST", body: JSON.stringify({ vote }) }),
  adminConfirmReferral: (refId) => apiFetch(`/api/admin/referrals/${refId}/confirm`, { method: "POST" }),
  
  // System
  runMonitor: () => apiFetch("/api/system/monitor/run", { method: "POST" }),
  evaluateFraud: (workerId, eventId) => apiFetch("/api/system/fraud/evaluate", { method: "POST", body: JSON.stringify({ workerId, eventId }) }),
  
  // Plans
  plans: () => apiFetch("/api/plans"),
};

export function getApiBaseUrl() {
  return BASE_URL;
}
