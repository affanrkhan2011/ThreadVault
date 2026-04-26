import { useState } from 'react';
import { Sparkles, ArrowRight, Save, Navigation } from 'lucide-react';

export function OutfitBuilder() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutfit, setGeneratedOutfit] = useState<any | null>(null);

  const generateOutfit = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulated generation based on prompt
    setTimeout(() => {
      setGeneratedOutfit({
        name: "Casual Evening",
        description: "A relaxed but put-together look based on your vault items.",
        items: [
          { type: 'Top', name: 'White Oxford', color: 'White' },
          { type: 'Bottom', name: 'Navy Chinos', color: 'Navy' },
          { type: 'Shoes', name: 'Brown Loafers', color: 'Brown' }
        ]
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 -rotate-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-bold font-sans tracking-tight text-gray-900">Outfit Builder</h2>
        <p className="text-gray-500">Describe what you need, and the AI will style you from your vault.</p>
      </div>

      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Smart casual for a dinner date tonight..."
          className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 outline-none text-gray-900 placeholder:text-gray-400"
        />
        <button 
          onClick={generateOutfit}
          disabled={isGenerating || !prompt.trim()}
          className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

      {generatedOutfit && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 fade-in duration-500">
           <div className="flex justify-between items-start mb-6">
             <div>
               <h3 className="text-xl font-bold text-gray-900">{generatedOutfit.name}</h3>
               <p className="text-gray-500 text-sm mt-1">{generatedOutfit.description}</p>
             </div>
             <button className="text-gray-400 hover:text-gray-900 p-2">
               <Save className="w-5 h-5" />
             </button>
           </div>

           <div className="space-y-3">
             {generatedOutfit.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xs font-medium text-gray-400">
                    Img
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{item.type}</p>
                    <p className="text-gray-900 font-medium">{item.color} {item.name}</p>
                  </div>
                </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}
