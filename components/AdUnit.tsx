import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertTriangle, Download } from 'lucide-react';
import { GlassButton } from './ui/GlassButton';

interface AdBannerProps {
  slot: string;
  className?: string;
  format?: 'banner' | 'rectangle';
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className, format = 'banner' }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`relative overflow-hidden glass-card rounded-xl border border-white/10 flex flex-col items-center justify-center bg-black/20 ${format === 'banner' ? 'h-[60px] md:h-[90px]' : 'h-[250px]'} ${className}`}>
      <span className="text-[10px] text-gray-500 absolute top-1 right-2 border border-gray-600 px-1 rounded">AD</span>
      
      {/* Placeholder for Ad Network Code (AdSense/AdMob/Unity) */}
      <div className="text-center opacity-50">
        <p className="text-xs text-gray-400">Sponsored Advertisement</p>
        <p className="text-[10px] text-gray-600 mt-1">Slot: {slot}</p>
      </div>

      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-1 left-1 p-1 hover:bg-white/10 rounded-full text-gray-500"
      >
        <X size={10} />
      </button>
    </div>
  );
};

export const AdPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Listen for the download request event
    const handleTrigger = () => {
        setShow(true);
    };

    window.addEventListener('request-download-ad', handleTrigger);
    return () => window.removeEventListener('request-download-ad', handleTrigger);
  }, []);

  const handleAdClick = () => {
      // 1. Open Ad Link
      window.open('https://play.google.com/store/apps', '_blank');
      
      // 2. Dispatch event to unlock download
      window.dispatchEvent(new Event('ad-verified'));
      
      // 3. Close Popup
      setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-gray-700 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl"
        >
          <button onClick={() => setShow(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white">
            <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
                <Download className="text-white" size={32} />
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Download Ready!</h3>
             <p className="text-gray-400 text-sm mb-6">
                 Please visit our sponsor to unlock your high-quality birthday card download instantly.
             </p>
             
             <GlassButton className="w-full justify-center bg-blue-600 hover:bg-blue-500 group" onClick={handleAdClick}>
                <span className="flex items-center gap-2">
                    Open & Start Download <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
             </GlassButton>
             
             <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-widest">Sponsored Content</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const MoreAppsButton: React.FC<{lang: string}> = ({ lang }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleRedirect = () => {
        // Redirect logic here
        window.open('https://play.google.com/store/apps', '_blank');
        setShowConfirm(false);
    };

    return (
        <>
            <button 
                onClick={() => setShowConfirm(true)}
                className="mt-8 text-sm text-gray-400 hover:text-white underline decoration-dotted underline-offset-4 transition-colors"
            >
                {lang === 'en' ? 'More Apps by Us' : 'আমাদের আরও অ্যাপস'}
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a2e] border border-white/10 p-6 rounded-2xl max-w-xs w-full text-center">
                        <AlertTriangle className="mx-auto text-yellow-500 mb-3" size={32} />
                        <h4 className="text-white font-bold mb-2">Leaving App?</h4>
                        <p className="text-gray-400 text-sm mb-4">You are about to visit the external App Store.</p>
                        <div className="flex gap-2">
                            <GlassButton variant="secondary" onClick={() => setShowConfirm(false)} className="flex-1 text-sm py-2">Cancel</GlassButton>
                            <GlassButton onClick={handleRedirect} className="flex-1 text-sm py-2 bg-blue-600">Go</GlassButton>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};