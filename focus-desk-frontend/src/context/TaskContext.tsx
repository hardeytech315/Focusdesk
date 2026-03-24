import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, TaskFilters, DashboardStats } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { tasksAPI } from '@/services/api';
import { isToday, isThisWeek, isPast } from 'date-fns';

interface TaskContextType {
  tasks: Task[];
  filters: TaskFilters;
  stats: DashboardStats;
  isLoading: boolean;
  setFilters: (f: Partial<TaskFilters>) => void;
  addTask: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getFilteredTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = 'focusdesk_tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFiltersState] = useState<TaskFilters>({
    status: 'all', priority: 'all', search: '', sortBy: 'deadline', sortOrder: 'asc',
  });

  useEffect(() => {
    if (!isAuthenticated) { setTasks([]); setIsLoading(false); return; }
    const fetchTasks = async () => {
      try {
        const { data } = await tasksAPI.getAll();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        toast({ title: 'Error', description: 'Failed to load tasks', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isAuthenticated]);

  const stats: DashboardStats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    inProgress: tasks.filter((t) => t.status === 'In Progress').length,
    overdue: tasks.filter((t) => t.status !== 'Completed' && isPast(new Date(t.deadline))).length,
    completedToday: tasks.filter((t) => t.status === 'Completed' && isToday(new Date(t.updatedAt))).length,
    dueToday: tasks.filter((t) => t.status !== 'Completed' && isToday(new Date(t.deadline))).length,
    dueThisWeek: tasks.filter((t) => t.status !== 'Completed' && isThisWeek(new Date(t.deadline))).length,
    highPriority: tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length,
  }), [tasks]);

  const setFilters = useCallback((f: Partial<TaskFilters>) => setFiltersState((p) => ({ ...p, ...f })), []);

  const addTask = useCallback(async (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data } = await tasksAPI.create(task);
      setTasks((p) => [data, ...p]);
      toast({ title: 'Task created', description: task.title });
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({ title: 'Error', description: 'Failed to create task', variant: 'destructive' });
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    try {
      const { data: updatedTask } = await tasksAPI.update(id, data);
      setTasks((p) => p.map((t) => t._id === id ? updatedTask : t));
      toast({ title: 'Task updated' });
    } catch (error) {
      console.error('Failed to update task:', error);
      toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' });
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await tasksAPI.delete(id);
      setTasks((p) => p.filter((t) => t._id !== id));
      toast({ title: 'Task deleted' });
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' });
    }
  }, []);

  const getFilteredTasks = useCallback(() => {
    let filtered = [...tasks];
    if (filters.status !== 'all') filtered = filtered.filter((t) => t.status === filters.status);
    if (filters.priority !== 'all') filtered = filtered.filter((t) => t.priority === filters.priority);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    filtered.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'deadline') cmp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      else if (filters.sortBy === 'priority') {
        const order = { High: 3, Medium: 2, Low: 1 };
        cmp = order[b.priority] - order[a.priority];
      } else cmp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });
    return filtered;
  }, [tasks, filters]);

  return (
    <TaskContext.Provider value={{ tasks, filters, stats, isLoading, setFilters, addTask, updateTask, deleteTask, getFilteredTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
