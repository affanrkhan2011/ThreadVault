import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, Loader2, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/utils';
import { app } from '../lib/firebase';

const storage = getStorage(app);

interface AIResponse {
  garment_type: string;
  colour: string;
  pattern: string;
  fabric: string;
  brand: string;
  fit: string;
  season: string[];
  occasion: string[];
  style: string;
  care: string;
}

export function ScanItem() {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visionData, setVisionData] = useState<AIResponse | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImageSrc(imageSrc || null);
  }, [webcamRef]);

  const retake = () => {
    setImageSrc(null);
    setVisionData(null);
  };

  const processImage = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          imageSrc, 
          model: "llama-3.2-11b-vision-preview" 
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || data.error || "Failed to analyze image");
      
      let parsed: AIResponse;
      try {
         // The server returns the full data from Groq, so we need to access choices[0].message.content
         parsed = JSON.parse(data.choices[0].message.content);
      } catch (e) {
         throw new Error("Invalid output from AI");
      }
      setVisionData(parsed);

    } catch (e: any) {
      toast.error(e.message || "Failed to process image");
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveItem = async () => {
    if (!user || !visionData || !imageSrc) return;
    setIsProcessing(true);
    try {
      // 1. upload image
      const photoId = Date.now().toString();
      const storageRef = ref(storage, `users/${user.uid}/items/${photoId}.jpg`);
      await uploadString(storageRef, imageSrc, 'data_url');
      const photoUrl = await getDownloadURL(storageRef);

      // 2. save to firestore
      const itemId = `item_${Date.now()}`;
      const itemRef = doc(db, `users/${user.uid}/items/${itemId}`);
      await setDoc(itemRef, {
        userId: user.uid,
        photoUrl: photoUrl,
        garmentType: visionData.garment_type || "Unknown",
        color: visionData.colour || "Unknown",
        pattern: visionData.pattern || "Unknown",
        fabric: visionData.fabric || "Unknown",
        brand: visionData.brand || "Unknown",
        fit: visionData.fit || "Regular",
        season: visionData.season || ["All-season"],
        occasion: visionData.occasion || ["Casual"],
        style: visionData.style || "Classic",
        status: "Clean",
        timesWorn: 0,
        notes: `Care: ${visionData.care || 'Unknown'}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      toast.success("Item added to Vault!");
      navigate('/vault');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/items`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-sans tracking-tight">Add Item</h2>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        {!imageSrc ? (
          <div className="relative aspect-[3/4] bg-gray-900">
            {/* @ts-ignore */}
            <Webcam
              audio={false}
              ref={webcamRef as any}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-8 flex justify-center">
              <button
                onClick={capture}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1"
              >
                <div className="w-full h-full rounded-full border-2 border-gray-900" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative aspect-[3/4]">
            <img src={imageSrc} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
            {!visionData && (
              <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex gap-4">
                  <button
                    onClick={retake}
                    className="flex-1 py-3 px-4 bg-white/20 backdrop-blur-md rounded-xl text-white font-medium flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" /> Retake
                  </button>
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="flex-1 py-3 px-4 bg-white rounded-xl text-gray-900 font-medium flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} 
                    Analyze
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {visionData && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Analysis Complete</h3>
            <button onClick={retake} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Type" value={visionData.garment_type} />
            <Detail label="Color" value={visionData.colour} />
            <Detail label="Brand" value={visionData.brand} />
            <Detail label="Fabric" value={visionData.fabric} />
          </div>

          <button
            onClick={saveItem}
            disabled={isProcessing}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium flex justify-center items-center gap-2"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
            Save to Vault
          </button>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</dt>
      <dd className="text-sm text-gray-900 mt-1 capitalize font-medium">{value}</dd>
    </div>
  );
}
