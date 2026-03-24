import { ListTodo, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title = 'No tasks yet',
  description = 'Create your first task to start organizing your work.',
  actionLabel = 'Create Task',
  onAction,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <ListTodo className="h-8 w-8" />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    {onAction && (
      <Button onClick={onAction} className="mt-6 gradient-primary text-primary-foreground gap-2">
        <Plus className="h-4 w-4" /> {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
