import React from 'react';
import { PieChart as PieChartIcon, Activity, AlertCircle, TrendingUp } from 'lucide-react';

export function Stats() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-sans tracking-tight">Wardrobe Intelligence</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Items" value="14" icon={<PieChartIcon className="w-4 h-4 text-gray-500" />} />
        <StatCard title="Possible Outfits" value="1,092" icon={<TrendingUp className="w-4 h-4 text-green-500" />} />
        <StatCard title="Most Worn" value="Navy Chinos" icon={<Activity className="w-4 h-4 text-blue-500" />} />
        <StatCard title="Never Worn" value="3 items" icon={<AlertCircle className="w-4 h-4 text-orange-500" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <h3 className="font-semibold text-gray-900 mb-6">Wardrobe Gaps</h3>
           <div className="space-y-4">
             <div className="p-4 bg-orange-50 text-orange-900 rounded-2xl">
               <p className="font-medium text-sm">Missing versatile neutral shoe</p>
               <p className="text-xs opacity-80 mt-1">A white sneaker or tan loafer would unlock 40% more outfit combinations.</p>
             </div>
             <div className="p-4 bg-gray-50 text-gray-900 rounded-2xl">
               <p className="font-medium text-sm">Top-heavy wardrobe</p>
               <p className="text-xs text-gray-500 mt-1">You have 10 tops but only 2 bottoms. Consider investing in trousers or jeans.</p>
             </div>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <h3 className="font-semibold text-gray-900 mb-6">Color Palette</h3>
           <div className="flex h-32 rounded-xl overflow-hidden shadow-inner">
             <div className="bg-blue-900 w-1/3 flex items-center justify-center text-white/50 text-xs">33%</div>
             <div className="bg-white border-l border-r border-gray-100 w-1/4 flex items-center justify-center text-black/50 text-xs">25%</div>
             <div className="bg-gray-400 w-1/5 flex items-center justify-center text-white/50 text-xs">20%</div>
             <div className="bg-green-800 w-[12%] flex items-center justify-center text-white/50 text-xs">12%</div>
             <div className="bg-red-500 flex-1 flex items-center justify-center text-white/50 text-xs">10%</div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <div className="bg-gray-50 p-1.5 rounded-lg">{icon}</div>
      </div>
      <p className="text-2xl font-bold font-sans tracking-tight text-gray-900 mt-auto">{value}</p>
    </div>
  );
}
