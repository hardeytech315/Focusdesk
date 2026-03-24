import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, BarChart3, Clock, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: CheckCircle2, title: 'Task Management', desc: 'Create, organize, and track tasks with priorities and deadlines.' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Visual dashboard to monitor your productivity at a glance.' },
  { icon: Clock, title: 'Deadline Alerts', desc: 'Never miss a deadline with smart overdue tracking.' },
  { icon: Zap, title: 'Stay Focused', desc: 'Clean interface designed to keep you in the zone.' },
];

const Landing = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative overflow-hidden gradient-hero px-4 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(32_95%_52%/0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Productivity Reimagined
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
            Stay Focused.<br />
            <span className="text-primary">Get Things Done.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/70">
            FocusDesk helps you manage tasks, set deadlines, and track progress — so you can focus on what matters most.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground gap-2 px-8 text-base">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-base">
                Log In
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features */}
    <section className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Everything you need to stay productive</h2>
          <p className="mt-3 text-muted-foreground">Simple, powerful tools to manage your workflow.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FocusDesk. All rights reserved.
      </div>
    </footer>
  </div>
);

export default Landing;
