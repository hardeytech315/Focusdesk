import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTasks } from '@/context/TaskContext';

const COLORS: Record<string, string> = {
  High: 'hsl(var(--destructive))',
  Medium: 'hsl(var(--warning))',
  Low: 'hsl(var(--success))',
};

const PriorityChart = () => {
  const { tasks } = useTasks();

  const data = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => counts[t.priority]++);
    return [
      { name: 'High', value: counts.high },
      { name: 'Medium', value: counts.medium },
      { name: 'Low', value: counts.low },
    ].filter((d) => d.value > 0);
  }, [tasks]);

  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Priority Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Legend
            formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: 12 }}>{value}</span>}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityChart;
