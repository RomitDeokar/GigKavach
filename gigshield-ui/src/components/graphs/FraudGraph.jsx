import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length > 0) {
    return (
      <div style={{ background: '#1e1b2e', border: '1px solid #2d255a', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff' }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{payload[0].payload.name}</p>
        <p style={{ color: '#f87171' }}>Fraud cases: {payload[0].value}</p>
        {payload[0].payload.confidence !== undefined && (
          <p style={{ color: '#4ade80' }}>Fraud rate: {(payload[0].payload.confidence * 100).toFixed(1)}%</p>
        )}
      </div>
    );
  }
  return null;
};

const FraudGraph = ({ data = [] }) => {
  const processedData = Array.isArray(data) && data.length > 0 ? data : [
    { name: '0 claims', fraud: 0, confidence: 0.0 },
    { name: '1 claims', fraud: 1, confidence: 0.011 },
    { name: '2 claims', fraud: 0, confidence: 0.0 },
    { name: '3 claims', fraud: 1, confidence: 0.011 },
    { name: '4+ claims', fraud: 17, confidence: 0.098 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,37,80,0.5)" />
        <XAxis dataKey="name" tick={{ fill: '#7C72A0', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#7C72A0', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="fraud" fill="#e74c3c" radius={[6, 6, 0, 0]} maxBarSize={50} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FraudGraph;
