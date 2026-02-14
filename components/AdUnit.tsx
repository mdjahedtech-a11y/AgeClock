import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, AlertTriangle, Download } from 'lucide-react';
import { GlassButton } from './ui/GlassButton';

// Configuration for Ad Keys provided by user
const AD_KEYS = {
  // Mobile 320x50 (Top Banner Mobile & Sticky Footer)
  MOBILE_BANNER: 'dd82580ca3811525f598111a4997ec11',
  
  // Desktop 728x90 (Top Banner Desktop & Mid Content Desktop)
  DESKTOP_LEADERBOARD: 'b38bd17e3c239bba5d47b65b45ec3cb4',
  
  // Mobile 300x250 (Mid Content Mobile)
  MOBILE_RECTANGLE: '9d925f5de7f3b15ff6c1536c558c29d9',
  
  // Popup Link
  POPUP_LINK: 'https://www.effectivegatecpm.com/mcadnt9pk?key=706246ed54a77c8e386bc6883d56608a'
};

// Helper component to render script-based ads safely inside an iframe
const AdsterraAd = ({ width, height, adKey }: { width: number; height: number; adKey: string }) => {
  const srcDoc = `
    <html>
      <head>
        <base target="_blank" />
        <style>
          body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <iframe
      title={`ad-${adKey}`}
      width={width}
      height={height}
      srcDoc={srcDoc}
      style={{ border: 'none', overflow: 'hidden' }}
      scrolling="no"
    />
  );
};

interface AdBannerProps {
  slot: string;
  className?: string;
  format?: 'banner' | 'rectangle';
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isVisible) return null;

  let adContent = null;
  let containerHeight = 'h-auto';

  // Determine which ad to show based on slot and device
  if (slot === 'top-banner') {
    // Mobile: 320x50, Desktop: 728x90
    if (isMobile) {
      adContent = <AdsterraAd width={320} height={50} adKey={AD_KEYS.MOBILE_BANNER} />;
      containerHeight = 'h-[60px]';
    } else {
      adContent = <AdsterraAd width={728} height={90} adKey={AD_KEYS.DESKTOP_LEADERBOARD} />;
      containerHeight = 'h-[100px]';
    }
  } else if (slot === 'mid-content') {
    // Mobile: 300x250, Desktop: 728x90
    if (isMobile) {
      adContent = <AdsterraAd width={300} height={250} adKey={AD_KEYS.MOBILE_RECTANGLE} />;
      containerHeight = 'h-[260px]';
    } else {
      adContent = <AdsterraAd width={728} height={90} adKey={AD_KEYS.DESKTOP_LEADERBOARD} />;
      containerHeight = 'h-[100px]';
    }
  } else if (slot === 'sticky-footer') {
    // Always 320x50 (Standard for sticky footer)
    adContent = <AdsterraAd width={320} height={50} adKey={AD_KEYS.MOBILE_BANNER} />;
    containerHeight = 'h-[50px]';
  }

  return (
    <div className={`relative flex items-center justify-center bg-transparent ${containerHeight} ${className}`}>
      {/* Close button for sticky footer only, or general if desired */}
      {slot === 'sticky-footer' && (
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 right-0 bg-red-500 text-white p-1 rounded-full shadow-md z-50"
        >
          <X size={12} />
        </button>
      )}

      {/* Ad Content */}
      <div className="overflow-hidden rounded-md shadow-sm flex justify-center">
        {adContent}
      </div>
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
      // 1. Open Ad Link provided by user
      window.open(AD_KEYS.POPUP_LINK, '_blank');
      
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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
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
                 Click the button below to visit our partner and start your high-quality download immediately.
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
        // Use the same link or a different app store link
        window.open('https://play.google.com/store/apps', '_blank');
        setShowConfirm(false);
    };

    return (
        <>
            <button 
                onClick={() => setShowConfirm(true)}
                className="mt-8 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline decoration-dotted underline-offset-4 transition-colors"
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