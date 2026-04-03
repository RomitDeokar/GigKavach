import { Router } from "express";
import {
  buildAdminAnalytics,
  buildAdminOverview,
  buildForecastDashboard,
  buildGigBotReply,
  buildLoyaltyMonitor,
  buildWorkerDashboard,
  buyPolicy,
  calculatePremium,
  confirmReferral,
  createOrUpdateWorkerProfile,
  createPoolMotion,
  createReferral,
  evaluateFraud,
  getNotifications,
  generateCertificate,
  generateClaimStatement,
  getCoverageGap,
  getTier,
  getWorker,
  getWorkerPolicy,
  getZonePool,
  getZoneSignals,
  getZone,
  issueOtp,
  listPlans,
  listReferrals,
  processClaimPayout,
  reviewFraudCase,
  runSimulator,
  runZoneMonitor,
  sendManualNotification,
  toggleAutoRenew,
  verifyOtp,
  votePoolMotion,
  workerClaims,
  workerHistorySummary
} from "./services/domain.js";
import { store } from "./store.js";

const router = Router();

// ─── Auth ────────────────────────────────────
router.get("/plans", (_req, res) => res.json({ plans: listPlans() }));

router.post("/auth/request-otp", (req, res) => {
  try {
    res.json(issueOtp(req.body.mobile));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/auth/verify-otp", (req, res) => {
  try {
    res.json(verifyOtp(req.body.mobile, req.body.otp));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/workers/onboarding", (req, res) => {
  try {
    res.json(createOrUpdateWorkerProfile(req.body));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

// ─── Worker routes ───────────────────────────
// Check if a worker exists (used by frontend to validate stored session)
router.get("/workers/:workerId/exists", (req, res) => {
  const worker = store.workers.find((item) => item.id === req.params.workerId);
  res.json({ exists: !!worker, workerId: req.params.workerId });
});

router.get("/workers/:workerId/dashboard", (req, res) => {
  try {
    res.json(buildWorkerDashboard(req.params.workerId));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/policy", (req, res) => {
  try {
    const worker = getWorker(req.params.workerId);
    const zone = getZone(worker.zoneId);
    const policy = getWorkerPolicy(req.params.workerId);
    res.json({
      policy,
      pricingPreview: ["basic", "pro", "elite"].map((planId) => calculatePremium(planId, zone.riskScore, worker.points)),
      forecast: buildWorkerDashboard(req.params.workerId).forecast
    });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/workers/:workerId/policies/purchase", (req, res) => {
  try {
    res.json(buyPolicy(req.params.workerId, req.body));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.patch("/workers/:workerId/policy/auto-renew", (req, res) => {
  try {
    res.json(toggleAutoRenew(req.params.workerId, req.body.autoRenew));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/history", (req, res) => {
  try {
    const workerId = req.params.workerId;
    res.json({
      summary: workerHistorySummary(workerId),
      claims: workerClaims(workerId),
      zoneHistory: store.disruptionEvents.filter((i) => i.zoneId === getWorker(workerId).zoneId).slice(0, 10),
      lifetimeProtection: store.lifetimeProtection[workerId] ?? []
    });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/points", (req, res) => {
  try {
    const worker = getWorker(req.params.workerId);
    res.json({
      balance: worker.points,
      tier: getTier(worker.points),
      ledger: store.pointsLedger.filter((i) => i.workerId === req.params.workerId),
      milestones: [
        { points: 2500, reward: "10% waiver + priority payout" },
        { points: 5000, reward: "1 free week every 13 weeks" },
        { points: 7500, reward: "Rs 500 top-up" }
      ]
    });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/profile", (req, res) => {
  try {
    const worker = getWorker(req.params.workerId);
    res.json({ worker, zone: getZone(worker.zoneId) });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/coverage-gap", (req, res) => {
  try {
    res.json({ coverageGap: getCoverageGap(req.params.workerId) });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/notifications", (req, res) => {
  try {
    res.json({ notifications: getNotifications(req.params.workerId) });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/workers/:workerId/notifications/send", (req, res) => {
  try {
    res.json(sendManualNotification(req.params.workerId, req.body.channel ?? "push", req.body.message ?? "GigShield alert"));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/referrals", (req, res) => {
  try {
    res.json({ referrals: listReferrals(req.params.workerId) });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/workers/:workerId/referrals", (req, res) => {
  try {
    res.json(createReferral(req.params.workerId, req.body));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/pool", (req, res) => {
  try {
    res.json({ pool: getZonePool(getWorker(req.params.workerId).zoneId) });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/workers/:workerId/pool/motions", (req, res) => {
  try {
    res.json(createPoolMotion(req.params.workerId, req.body));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/workers/:workerId/gigbot", (req, res) => {
  try {
    res.json(buildGigBotReply(req.params.workerId, req.body.message ?? ""));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/workers/:workerId/payouts/process", (req, res) => {
  try {
    res.json(processClaimPayout(req.params.workerId, req.body.eventId));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/certificate", (req, res) => {
  try {
    res.type("text/plain").send(generateCertificate(req.params.workerId));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/workers/:workerId/claims/:claimId/statement", (req, res) => {
  try {
    res.type("text/plain").send(generateClaimStatement(req.params.workerId, req.params.claimId));
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

// ─── Admin routes ────────────────────────────
router.get("/admin/overview", (_req, res) => {
  try { res.json(buildAdminOverview()); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/admin/zones", (_req, res) => res.json({ zones: store.zones }));

router.get("/admin/zones/:zoneId/signals", (req, res) => {
  try { res.json(getZoneSignals(req.params.zoneId)); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/admin/live-feed", (_req, res) => res.json({ liveFeed: store.liveFeed }));

router.get("/admin/analytics", (_req, res) => {
  try { res.json(buildAdminAnalytics()); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/admin/fraud-cases", (_req, res) => {
  try {
    res.json({
      fraudCases: store.fraudCases.map((i) => {
        let workerName = i.workerId;
        try { workerName = getWorker(i.workerId).name; } catch { /* use id */ }
        return { ...i, worker: workerName };
      })
    });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/admin/fraud-cases/:caseId/decision", (req, res) => {
  try { res.json(reviewFraudCase(req.params.caseId, req.body.decision)); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/admin/simulator", (req, res) => {
  try { res.json(runSimulator(req.body)); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/admin/forecast", (_req, res) => {
  try { res.json({ zones: buildForecastDashboard() }); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/admin/loyalty", (_req, res) => {
  try { res.json(buildLoyaltyMonitor()); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.get("/admin/pools", (_req, res) => res.json({ pools: store.zonePools }));

router.get("/admin/pools/:zoneId", (req, res) => {
  try { res.json(getZonePool(req.params.zoneId)); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/admin/pools/motions/:motionId/vote", (req, res) => {
  try { res.json(votePoolMotion(req.params.motionId, req.body.vote ?? "for")); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/admin/referrals/:referralId/confirm", (req, res) => {
  try { res.json(confirmReferral(req.params.referralId)); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

// ─── Worker profile update ──────────────────
router.patch("/workers/:workerId/profile", (req, res) => {
  try {
    const worker = getWorker(req.params.workerId);
    const { name, platform, avgDailyHours, shiftPattern, upiId } = req.body;
    if (name) worker.name = name;
    if (platform) worker.platform = platform;
    if (avgDailyHours) worker.avgDailyHours = Number(avgDailyHours);
    if (shiftPattern) worker.shiftPattern = shiftPattern;
    if (upiId) worker.upiId = upiId;
    res.json({ worker, zone: getZone(worker.zoneId) });
  } catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

// ─── Worker logout ──────────────────────────
router.post("/workers/:workerId/logout", (req, res) => {
  res.json({ success: true });
});

// ─── System routes ───────────────────────────
router.post("/system/monitor/run", (_req, res) => {
  try { res.json({ events: runZoneMonitor() }); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

router.post("/system/fraud/evaluate", (req, res) => {
  try { res.json(evaluateFraud(req.body.workerId, req.body.eventId)); }
  catch (e) { res.status(e.statusCode || 500).json({ error: e.message }); }
});

export const handleApiRequest = router;
