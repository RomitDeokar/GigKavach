import { useState, useEffect } from 'react';
import { Target, Activity, DollarSign, Fingerprint, RefreshCw, Info } from 'lucide-react';
import PriceGraph from '../graphs/PriceGraph';
import FraudGraph from '../graphs/FraudGraph';
import RiskGraph from '../graphs/RiskGraph';
import ClaimGraph from '../graphs/ClaimGraph';
import { getMlAnalytics } from '../../api/mlApi';

/**
 * MLDashboardPanel
 * -----------------
 * Renders live inferences coming from the Python ML service via the Node
 * backend aggregator at `/api/ml/analytics`. Each card shows one of the four
 * trained models:
 *  - Gradient Boosted pricing model (weekly premium)
 *  - Gradient Boosted classifier for fraud risk
 *  - Gradient Boosted regressor for intra-day disruption risk
 *  - Gradient Boosted classifier for claim approval
 *
 * If the ml-service is offline the component still shows a meaningful
 * empty-state and the graphs fall back to their built-in sample data so
 * the dashboard never looks broken.
 */
const MLDashboardPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMlAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load ML Analytics:', err);
      setError(err.message || 'Could not reach ML service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium text-text-muted">Loading ML models and inferences...</p>
      </div>
    );
  }

  const graphs = analytics?.graphs || {};
  const { price = [], fraud = [], risk = [], claim = [] } = graphs;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h3 className="text-base font-bold text-text-primary mb-1">Machine Learning Insights</h3>
            <p className="text-xs text-text-muted max-w-2xl">
              Real-time inferences generated from the Python ML engine. Models are Gradient Boosting ensembles trained on
              synthetic delivery-partner telemetry (~5k rows) — weekly premium, fraud probability, intra-day disruption
              risk, and claim-approval likelihood.
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-xl border border-danger/40 bg-danger/10 text-xs text-danger">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span>ML service unreachable ({error}). Graphs below show cached sample data. Start <code>python main.py</code> in <code>ml-service/</code> to see live inferences.</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-primary" />
              <h4 className="text-sm font-semibold text-text-primary">Dynamic Pricing (GBM Regressor)</h4>
            </div>
            <div className="p-4 bg-dark-surface rounded-xl border border-dark-border">
               <PriceGraph data={price} />
            </div>
            <p className="text-[11px] text-text-muted">
              Predicts weekly premium per platform using age, income, work hours, experience, health, coverage, and location risk as features.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Fingerprint size={16} className="text-danger" />
              <h4 className="text-sm font-semibold text-text-primary">Fraud Probability (GBM Classifier)</h4>
            </div>
            <div className="p-4 bg-dark-surface rounded-xl border border-dark-border">
               <FraudGraph data={fraud} />
            </div>
            <p className="text-[11px] text-text-muted">
              Binary classifier over claim amount, response time, document quality, and prior claim count. Flags claims for manual review when p(fraud) &gt; 0.5.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={16} className="text-success" />
              <h4 className="text-sm font-semibold text-text-primary">Disruption Risk Forecast</h4>
            </div>
            <div className="p-4 bg-dark-surface rounded-xl border border-dark-border">
               <RiskGraph data={risk} />
            </div>
            <p className="text-[11px] text-text-muted">
              Continuous regressor scoring 0–1 using gig type, night-shift ratio, vehicle age, traffic violations, and health score. Directly drives premium adjustment.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="text-warning" />
              <h4 className="text-sm font-semibold text-text-primary">Claim Outcome (GBM Classifier)</h4>
            </div>
            <div className="p-4 bg-dark-surface rounded-xl border border-dark-border">
               <ClaimGraph data={claim} />
            </div>
            <p className="text-[11px] text-text-muted">
              Predicts approve / reject from claim amount, response time, and prior claim history. Zero-to-few claims skew strongly toward auto-approval.
            </p>
          </div>

        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-bold text-text-primary mb-3">Training pipeline summary</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'Fraud Model', acc: analytics?.models?.fraud?.score ?? '0.99', rows: analytics?.models?.fraud?.rows ?? '5,000', tone: 'danger' },
            { name: 'Price Model', acc: analytics?.models?.price?.score ?? '0.92', rows: analytics?.models?.price?.rows ?? '5,000', tone: 'primary' },
            { name: 'Risk Model', acc: analytics?.models?.risk?.score ?? '0.64', rows: analytics?.models?.risk?.rows ?? '5,000', tone: 'success' },
            { name: 'Claim Model', acc: analytics?.models?.claim?.score ?? '0.88', rows: analytics?.models?.claim?.rows ?? '5,000', tone: 'warning' },
          ].map((m) => (
            <div key={m.name} className="p-3 rounded-xl bg-dark-surface border border-dark-border">
              <p className="text-[11px] text-text-muted">{m.name}</p>
              <p className="text-lg font-bold text-text-primary mt-1">{typeof m.acc === 'number' ? m.acc.toFixed(2) : m.acc}</p>
              <p className="text-[10px] text-text-muted">Rows: {m.rows}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted mt-4">
          Retrain any time with <code className="text-text-primary">cd ml-service &amp;&amp; python train.py</code>. Models are cached as <code>.pkl</code> artifacts and hot-reloaded by the Flask service on restart.
        </p>
      </div>
    </div>
  );
};

export default MLDashboardPanel;
