import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskStatus } from '@/types';
import { useTasks } from '@/context/TaskContext';
import { Badge } from '@/components/ui/badge';
import { Calendar, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { getDeadlineStatus } from '@/utils/deadline';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'pending', label: 'Pending', color: 'bg-muted' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-info/10' },
  { id: 'completed', label: 'Completed', color: 'bg-success/10' },
];

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-destructive/10 text-destructive',
};

function KanbanCard({ task, overlay }: { task: Task; overlay?: boolean }) {
  const deadline = getDeadlineStatus(task);
  return (
    <div className={`rounded-lg border border-border bg-card p-3 shadow-card ${overlay ? 'shadow-elevated rotate-2' : ''}`}>
      <div className="flex items-start gap-2">
        {!overlay && <GripVertical className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground cursor-grab" />}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium text-card-foreground ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>
            {task.title}
          </p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
            <span className={`inline-flex items-center gap-1 text-xs ${deadline.color}`}>
              {deadline.emoji} <Calendar className="h-3 w-3" />
              {format(new Date(task.deadline), 'MMM d')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard task={task} />
    </div>
  );
}

function Column({ id, label, color, tasks }: { id: TaskStatus; label: string; color: string; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col">
      <div className={`mb-3 flex items-center justify-between rounded-lg px-3 py-2 ${color}`}>
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs font-medium text-muted-foreground">{tasks.length}</span>
      </div>
      <div ref={setNodeRef} className="flex-1 space-y-2 min-h-[120px]">
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableCard key={task._id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

const KanbanBoard = () => {
  const { tasks, updateTask } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const columns = useMemo(() => {
    return COLUMNS.map((col) => ({
      ...col,
      tasks: tasks.filter((t) => t.status === col.id),
    }));
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetStatus = COLUMNS.find((c) => c.id === overId)?.id;
    if (targetStatus) {
      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status !== targetStatus) {
        updateTask(taskId, { status: targetStatus });
      }
      return;
    }

    const overTask = tasks.find((t) => t._id === overId);
    if (overTask) {
      const task = tasks.find((t) => t._id === taskId);
      if (task && task.status !== overTask.status) {
        updateTask(taskId, { status: overTask.status });
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <Column key={col.id} {...col} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
