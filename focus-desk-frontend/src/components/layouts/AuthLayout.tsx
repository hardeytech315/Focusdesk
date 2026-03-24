import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="flex min-h-screen flex-col bg-background">
    <header className="flex h-16 items-center px-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
          <Flame className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">FocusDesk</span>
      </Link>
    </header>
    <main className="flex flex-1 items-center justify-center px-4">
      {children}
    </main>
  </div>
);

export default AuthLayout;
