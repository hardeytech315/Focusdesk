import { differenceInHours, isPast } from 'date-fns';

export interface DeadlineStatus {
  label: string;
  emoji: string;
  color: string;
}

export function getDeadlineStatus(task: { status: string; deadline: string }): DeadlineStatus {
  if (task.status === 'completed') {
    return { label: 'Completed', emoji: '✅', color: 'text-success' };
  }

  const deadline = new Date(task.deadline);

  if (isPast(deadline)) {
    return { label: 'Overdue', emoji: '🔴', color: 'text-destructive font-medium' };
  }

  const hoursLeft = differenceInHours(deadline, new Date());
  if (hoursLeft <= 48) {
    return { label: 'Due Soon', emoji: '🟡', color: 'text-warning font-medium' };
  }

  return { label: 'On Track', emoji: '🟢', color: 'text-muted-foreground' };
}
