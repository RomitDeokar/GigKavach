import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length > 0) {
    return (
      <div style={{ background: '#1e1b2e', border: '1px solid #2d255a', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff' }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{payload[0].payload.name}</p>
        <p style={{ color: '#4ade80' }}>Risk Score: {(payload[0].value * 100).toFixed(1)}%</p>
        {payload[0].payload.traffic !== undefined && (
          <p style={{ color: '#facc15' }}>Traffic Violations (avg): {payload[0].payload.traffic}</p>
        )}
      </div>
    );
  }
  return null;
};

const RiskGraph = ({ data = [] }) => {
  const processedData = Array.isArray(data) && data.length > 0 ? data : [
    { name: 'Home Services', risk: 0.482, traffic: 4.4 },
    { name: 'Freelance Tech', risk: 0.476, traffic: 4.9 },
    { name: 'Ride-hailing', risk: 0.465, traffic: 4.7 },
    { name: 'Delivery', risk: 0.463, traffic: 4.7 },
    { name: 'Grocery', risk: 0.461, traffic: 4.3 },
    { name: 'Logistics', risk: 0.457, traffic: 4.4 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={processedData}>
        <defs>
          <linearGradient id="riskAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#27ae60" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#27ae60" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,37,80,0.5)" />
        <XAxis dataKey="name" tick={{ fill: '#7C72A0', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#7C72A0', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 1]} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="risk" stroke="#27ae60" fill="url(#riskAreaGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#27ae60', strokeWidth: 0 }} activeDot={{ r: 6 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RiskGraph;
