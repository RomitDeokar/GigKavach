import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length > 0) {
    return (
      <div style={{ background: '#1e1b2e', border: '1px solid #2d255a', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff' }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{payload[0].payload.name}</p>
        <p style={{ color: '#818cf8' }}>Premium: ₹{Number(payload[0].value).toFixed(2)}</p>
        {payload[0].payload.riskScore !== undefined && (
          <p style={{ color: '#fb923c' }}>Risk Score: {(payload[0].payload.riskScore * 100).toFixed(1)}%</p>
        )}
      </div>
    );
  }
  return null;
};

const PriceGraph = ({ data = [] }) => {
  const processedData = Array.isArray(data) && data.length > 0 ? data : [
    { name: 'Ola', price: 4844, riskScore: 0.60 },
    { name: 'Zomato', price: 4773, riskScore: 0.59 },
    { name: 'Blinkit', price: 4766, riskScore: 0.54 },
    { name: 'Uber', price: 4710, riskScore: 0.57 },
    { name: 'Zepto', price: 4591, riskScore: 0.56 },
    { name: 'Swiggy', price: 4533, riskScore: 0.53 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,37,80,0.5)" />
        <XAxis dataKey="name" tick={{ fill: '#7C72A0', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#7C72A0', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="price" stroke="#6C5CE7" strokeWidth={2.5} dot={{ r: 4, fill: '#6C5CE7', strokeWidth: 0 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceGraph;
