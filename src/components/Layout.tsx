import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Grid, PlusCircle, Sparkles, PieChart, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-16 md:pb-0">
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold text-xl tracking-tight">ThreadVault</h1>
        <button onClick={logout} className="p-2 text-gray-500 hover:text-gray-900">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 w-full md:w-64 md:h-screen md:sticky md:top-0 bg-white border-t md:border-t-0 md:border-r border-gray-200 z-20 flex md:flex-col justify-around md:justify-start px-2 py-3 md:p-6 shadow-lg md:shadow-none">
        
        <div className="hidden md:flex justify-between items-center mb-8 px-2">
          <h1 className="font-bold text-2xl tracking-tight">ThreadVault</h1>
        </div>

        <div className="flex md:flex-col justify-around md:justify-start w-full gap-2">
          <NavItem to="/" icon={<Home className="w-6 h-6 md:w-5 md:h-5" />} label="Home" />
          <NavItem to="/vault" icon={<Grid className="w-6 h-6 md:w-5 md:h-5" />} label="Vault" />
          <div className="relative -top-6 md:top-0 md:my-4">
            <NavLink
              to="/scan"
              className="flex items-center justify-center bg-gray-900 text-white w-14 h-14 md:w-auto md:h-10 md:rounded-lg rounded-full shadow-lg hover:bg-gray-800 transition-colors md:px-4 md:py-2 md:gap-3"
            >
              <PlusCircle className="w-6 h-6" />
              <span className="hidden md:inline font-medium">Add Item</span>
            </NavLink>
          </div>
          <NavItem to="/outfits" icon={<Sparkles className="w-6 h-6 md:w-5 md:h-5" />} label="Outfits" />
          <NavItem to="/stats" icon={<PieChart className="w-6 h-6 md:w-5 md:h-5" />} label="Stats" />
        </div>

        <div className="hidden md:block mt-auto px-2">
          <button onClick={logout} className="flex items-center gap-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-colors ${
          isActive ? 'text-gray-900 md:bg-gray-100 font-medium' : 'text-gray-400 md:text-gray-500 hover:text-gray-900 hover:bg-gray-50'
        }`
      }
    >
      {icon}
      <span className="text-[10px] md:text-sm mt-1 md:mt-0">{label}</span>
    </NavLink>
  );
}
