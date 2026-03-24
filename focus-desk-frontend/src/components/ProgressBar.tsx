import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  label?: string;
}

const ProgressBar = ({ value, label }: ProgressBarProps) => (
  <div>
    {label && (
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{Math.round(value)}%</span>
      </div>
    )}
    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full gradient-primary"
      />
    </div>
  </div>
);

export default ProgressBar;
