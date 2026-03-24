import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import StatsCard from '@/components/StatsCard';
import ProgressBar from '@/components/ProgressBar';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import EmptyState from '@/components/EmptyState';
import WeeklyChart from '@/components/WeeklyChart';
import PriorityChart from '@/components/PriorityChart';
import { DashboardSkeleton } from '@/components/TaskCardSkeleton';
import { ListTodo, CheckCircle2, Clock, AlertTriangle, CalendarCheck, CalendarDays, CalendarClock, Flame, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { Task } from '@/types';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { tasks, stats, isLoading } = useTasks();
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const recentTasks = tasks.slice(0, 5);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">Here's an overview of your tasks today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Tasks" value={stats.total} icon={ListTodo} color="primary" />
        <StatsCard title="Completed" value={stats.completed} icon={CheckCircle2} color="success" />
        <StatsCard title="In Progress" value={stats.inProgress} icon={Clock} color="info" />
        <StatsCard title="Overdue" value={stats.overdue} icon={AlertTriangle} color="destructive" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Completed Today" value={stats.completedToday} icon={CalendarCheck} color="success" />
        <StatsCard title="Due Today" value={stats.dueToday} icon={CalendarDays} color="warning" />
        <StatsCard title="Due This Week" value={stats.dueThisWeek} icon={CalendarClock} color="info" />
        <StatsCard title="High Priority" value={stats.highPriority} icon={Flame} color="destructive" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <WeeklyChart />
        <PriorityChart />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Tasks</h2>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={(t) => { setEditTask(t); setFormOpen(true); }} />
            ))}
            {recentTasks.length === 0 && (
              <EmptyState onAction={() => setFormOpen(true)} />
            )}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Progress</h2>
          <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-5">
            <ProgressBar value={completionRate} label="Overall Completion" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium text-foreground">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-medium text-foreground">{stats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium text-foreground">{stats.completed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskForm open={formOpen || !!editTask} onClose={() => { setFormOpen(false); setEditTask(null); }} editTask={editTask} />
    </div>
  );
};

export default Dashboard;
