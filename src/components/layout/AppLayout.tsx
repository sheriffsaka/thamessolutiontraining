import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
