import Navbar from '@/components/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>{children}</main>
  </div>
);

export default MainLayout;
