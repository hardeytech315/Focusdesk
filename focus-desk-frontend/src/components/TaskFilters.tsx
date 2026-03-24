import { useTasks } from '@/context/TaskContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskFiltersProps {
  searchRef?: React.RefObject<HTMLInputElement>;
}

const TaskFilters = ({ searchRef }: TaskFiltersProps) => {
  const { filters, setFilters } = useTasks();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={searchRef}
          placeholder="Search tasks... (press /)"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="pl-9"
        />
      </div>
      <Select value={filters.status} onValueChange={(v) => setFilters({ status: v as any })}>
        <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.priority} onValueChange={(v) => setFilters({ priority: v as any })}>
        <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.sortBy} onValueChange={(v) => setFilters({ sortBy: v as any })}>
        <SelectTrigger className="w-[140px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="deadline">Deadline</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="createdAt">Created</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
        title={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TaskFilters;
