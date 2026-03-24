import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTasks } from '@/context/TaskContext';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

const WeeklyChart = () => {
  const { tasks } = useTasks();

  const data = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(today, 6 - i);
      const completed = tasks.filter(
        (t) =>
          t.status === 'completed' &&
          isWithinInterval(new Date(t.updatedAt), {
            start: startOfDay(date),
            end: endOfDay(date),
          })
      ).length;
      return { day: format(date, 'EEE'), completed };
    });
  }, [tasks]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Weekly Completion</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
            }}
          />
          <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
