import { useState, useRef, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/context/TaskContext';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import TaskFilters from '@/components/TaskFilters';
import KanbanBoard from '@/components/KanbanBoard';
import EmptyState from '@/components/EmptyState';
import TaskCardSkeleton from '@/components/TaskCardSkeleton';
import { Button } from '@/components/ui/button';
import { Plus, LayoutList, Columns3 } from 'lucide-react';
import type { Task } from '@/types';
import { AnimatePresence } from 'framer-motion';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const Tasks = () => {
  const { isAuthenticated } = useAuth();
  const { getFilteredTasks, tasks, isLoading } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const searchRef = useRef<HTMLInputElement>(null);

  const openNewTask = useCallback(() => { setEditTask(null); setFormOpen(true); }, []);

  useKeyboardShortcuts({
    onNewTask: openNewTask,
    onFocusSearch: () => searchRef.current?.focus(),
    onCloseModal: () => { if (formOpen) { setFormOpen(false); setEditTask(null); } },
  });

  if (!isAuthenticated) return <Navigate to="/login" />;

  const filtered = getFilteredTasks();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-muted p-0.5">
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 gap-1.5 px-3"
              onClick={() => setView('list')}
            >
              <LayoutList className="h-4 w-4" /> List
            </Button>
            <Button
              variant={view === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 gap-1.5 px-3"
              onClick={() => setView('kanban')}
            >
              <Columns3 className="h-4 w-4" /> Board
            </Button>
          </div>
          <Button onClick={openNewTask} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      {view === 'list' && <TaskFilters searchRef={searchRef} />}

      {isLoading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : view === 'kanban' ? (
        <div className="mt-6">
          {tasks.length === 0 ? (
            <EmptyState onAction={openNewTask} />
          ) : (
            <KanbanBoard />
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={(t) => { setEditTask(t); setFormOpen(true); }} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <EmptyState
              title="No tasks match your filters"
              description="Try adjusting your filters or create a new task."
              onAction={openNewTask}
            />
          )}
        </div>
      )}

      <TaskForm open={formOpen} onClose={() => { setFormOpen(false); setEditTask(null); }} editTask={editTask} />
    </div>
  );
};

export default Tasks;
