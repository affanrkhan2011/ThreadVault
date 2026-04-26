import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/utils';
import { Shirt, Trash2, Filter } from 'lucide-react';

export function Vault() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, `users/${user.uid}/items`), 
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/items`);
    });

    return unsub;
  }, [user]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center">Loading vault...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-sans tracking-tight">Your Vault</h2>
        <button className="p-2 text-gray-500 hover:text-gray-900 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Shirt className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Your vault is empty</h3>
          <p className="text-gray-500 mt-2 max-w-sm">Tap the Add Item button below to start building your digital wardrobe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer">
              <div className="relative aspect-square bg-gray-50">
                {item.photoUrl ? (
                   <img src={item.photoUrl} alt={item.garmentType} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                   <div className="absolute inset-0 flex items-center justify-center"><Shirt className="w-8 h-8 text-gray-300" /></div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-gray-900 border border-black/5 shadow-sm">
                  {item.status}
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-medium text-sm text-gray-900 truncate capitalize">{item.garmentType || 'Item'}</h3>
                <p className="text-xs text-gray-500 truncate capitalize">{item.color} • {item.brand}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
