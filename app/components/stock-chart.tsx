'use client';

import { Pie, PieChart, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

export default function StockChart({ data }: { data: ChartData[] }) {
  return (
    <PieChart
      style={{
        width: '100%',
        maxWidth: '500px',
        maxHeight: '80vh',
        aspectRatio: 2.5,
      }}
      responsive
    >
      <Pie
        data={data}
        innerRadius="80%"
        outerRadius="100%"
        cornerRadius="50%"
        fill="#8884d8"
        paddingAngle={4}
        dataKey="value"
        isAnimationActive={true}
      />
      <Tooltip />
    </PieChart>
  );
}
