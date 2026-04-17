import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#27ae60', '#e74c3c'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length > 0) {
    return (
      <div style={{ background: '#1e1b2e', border: '1px solid #2d255a', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff' }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{payload[0].name}</p>
        <p style={{ color: payload[0].fill }}>Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const ClaimGraph = ({ data }) => {
  const processedData = Array.isArray(data) && data.length > 0 ? data : [
    { name: 'Likely Approved', value: 347 },
    { name: 'Likely Rejected', value: 153 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          dataKey="value"
          stroke="none"
          paddingAngle={4}
        >
          {processedData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ClaimGraph;
