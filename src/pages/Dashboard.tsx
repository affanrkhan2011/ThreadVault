import { useAuth } from '../contexts/AuthContext';
import { Cloud, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      <header>
        <p className="text-gray-500 font-medium">Good morning,</p>
        <h2 className="text-3xl font-bold font-sans tracking-tight text-gray-900">{user?.displayName?.split(' ')[0] || 'User'}</h2>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Cloud className="w-4 h-4 text-blue-400" />
            <span>Mostly Sunny • 21°C</span>
          </div>
          <h3 className="text-xl font-semibold">Today's Recommendation</h3>
          <p className="text-gray-600 max-w-sm">Based on the weather and your recent wear history, here is an outfit perfectly suited for today.</p>
        </div>
        
        <div className="flex gap-2">
           <Link to="/outfits" className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm">
             <Sparkles className="w-4 h-4" /> Go to Outfits
           </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-gray-400" /> Upcoming Looks</h3>
          <div className="flex flex-col gap-3">
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
               <span className="font-medium text-sm text-gray-900">Friday Dinner</span>
               <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">Tomorrow</span>
             </div>
             <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
               <span className="font-medium text-sm text-gray-900">Office Monday</span>
               <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm">Mar 25</span>
             </div>
          </div>
        </section>

        <section className="bg-gray-900 text-white rounded-2xl shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24" />
          </div>
          <h3 className="font-semibold text-lg mb-2 relative z-10">Vault Intelligence</h3>
          <p className="text-gray-400 text-sm mb-4 relative z-10 max-w-xs">You have 14 items in your vault. You are missing a versatile neutral sneaker to unlock more outfit combinations.</p>
          <Link to="/stats" className="inline-block text-sm font-medium text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors relative z-10">
            View Analytics
          </Link>
        </section>
      </div>

    </div>
  );
}
