import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Download, Share2, Upload, Palette, Type, Check, Gift } from 'lucide-react';
import { Language, CalculatedAge, FontStyle } from '../types';
import { CARD_GRADIENTS, CARD_FONTS, TRANSLATIONS, BIRTHDAY_QUOTES } from '../utils/data';
import { GlassButton } from './ui/GlassButton';

interface Props {
  age: CalculatedAge;
  name: string;
  lang: Language;
  externalStatus?: string;
}

export const BirthdayCardGenerator: React.FC<Props> = ({ age, name, lang, externalStatus }) => {
  const [selectedGradient, setSelectedGradient] = useState(CARD_GRADIENTS[0]);
  const [selectedFont, setSelectedFont] = useState<FontStyle>('handwriting');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState(BIRTHDAY_QUOTES[lang][0].text);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (externalStatus) {
      setStatusText(externalStatus);
    }
  }, [externalStatus]);

  useEffect(() => {
      const executeDownload = () => {
          if (pendingDownload && cardRef.current) {
              setPendingDownload(false);
              performDownload();
          }
      };

      window.addEventListener('ad-verified', executeDownload);
      return () => window.removeEventListener('ad-verified', executeDownload);
  }, [pendingDownload, name]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setUserImage(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const performDownload = async () => {
      if (cardRef.current) {
        setIsDownloading(true);
        try {
            // Wait for images to load before capturing (though usually dataURLs are instant)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const canvas = await html2canvas(cardRef.current, {
                scale: 3, // Higher scale for premium quality
                useCORS: true,
                backgroundColor: null,
                logging: false,
            });
            
            const link = document.createElement('a');
            link.download = `Birthday-Card-${name || 'AgeClock'}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) {
            console.error("Download failed", err);
        } finally {
            setIsDownloading(false);
        }
      }
  };

  const handleDownload = async () => {
      setPendingDownload(true);
      window.dispatchEvent(new Event('request-download-ad'));
  };

  const handleShare = async () => {
     if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null });
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const file = new File([blob], "birthday-card.png", { type: "image/png" });
            if (navigator.share) {
                await navigator.share({
                    title: 'Birthday Wish',
                    text: `Happy Birthday ${name}!`,
                    files: [file]
                });
            } else {
                handleDownload();
            }
        });
      } catch (error) {
          console.log("Sharing not supported or failed", error);
      }
    }
  };

  const fontClassMap: Record<FontStyle, string> = {
      'sans': 'font-sans',
      'serif': 'font-serif',
      'handwriting': 'font-handwriting',
      'fun': 'font-fun',
      'fancy': 'font-fancy'
  };

  return (
    <div className="mt-12 w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-pink-500/20 rounded-lg text-pink-500 dark:text-pink-400">
            <Palette size={24} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{t.cardGenerator}</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview Section - Enhanced Visuals */}
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-black/20 p-2 sm:p-4 rounded-3xl border border-gray-200 dark:border-white/5">
            <motion.div 
                ref={cardRef}
                layout
                className={`relative w-full max-w-[300px] sm:max-w-sm aspect-[4/5] overflow-hidden shadow-2xl flex flex-col items-center justify-between text-center bg-gradient-to-br ${selectedGradient.gradient}`}
                style={{ borderRadius: '24px' }}
            >
                {/* Decorative Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                {/* Top Decoration */}
                <div className="w-full p-4 pt-6 sm:p-6 sm:pt-8 z-10 flex flex-col items-center">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 sm:px-4 rounded-full border border-white/30 shadow-lg mb-2 sm:mb-4">
                         <p className="text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase">
                            {lang === 'en' ? 'Special Day' : 'শুভ দিন'}
                         </p>
                    </div>
                    
                    <h2 className={`text-3xl sm:text-5xl ${selectedGradient.textColor} drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] leading-tight ${fontClassMap[selectedFont]}`}>
                         {lang === 'en' ? 'Happy Birthday' : 'শুভ জন্মদিন'}
                    </h2>
                    <h3 className={`text-xl sm:text-3xl font-bold text-white mt-1 sm:mt-2 drop-shadow-md break-words max-w-full px-2 ${fontClassMap.fun}`}>
                        {name}
                    </h3>
                </div>

                {/* Photo Area with Glow */}
                <div className="relative z-10 group flex-shrink-0">
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[4px] sm:border-[6px] border-white/90 shadow-2xl overflow-hidden bg-white/10 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                        {userImage ? (
                            <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <Gift size={48} className="text-white/80 sm:w-16 sm:h-16" />
                        )}
                    </div>
                    {/* Floating Age Badge */}
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-yellow-400 text-yellow-900 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 sm:border-4 border-white shadow-lg animate-bounce">
                        <span className="font-bold text-sm sm:text-lg">{age.years}</span>
                    </div>
                </div>

                {/* Bottom Message */}
                <div className="w-full p-4 pb-6 sm:p-6 sm:pb-8 z-10">
                    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                         <p className={`text-white/95 text-xs sm:text-base italic leading-relaxed ${fontClassMap.sans}`}>
                            "{statusText}"
                        </p>
                    </div>
                    <div className="mt-2 sm:mt-4 opacity-70">
                        <p className="text-[8px] sm:text-[10px] text-white uppercase tracking-[0.2em] font-bold">Generated by AgeClock</p>
                    </div>
                </div>

                {/* Floating SVG Decorations */}
                <div className="absolute top-10 left-4 opacity-80 animate-float">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-10 sm:h-10"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" fillOpacity="0.4"/></svg>
                </div>
                <div className="absolute bottom-20 right-4 opacity-60 animate-float" style={{ animationDelay: '2s' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-8 sm:h-8"><circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.3"/></svg>
                </div>
                <div className="absolute top-1/2 left-2 opacity-50 animate-float" style={{ animationDelay: '1s' }}>
                     <span className="text-xl sm:text-2xl">🎉</span>
                </div>
                <div className="absolute top-1/2 right-2 opacity-50 animate-float" style={{ animationDelay: '3s' }}>
                     <span className="text-xl sm:text-2xl">🎈</span>
                </div>

            </motion.div>
        </div>

        {/* Customization Controls */}
        <div className="glass-card rounded-3xl p-6 space-y-6 h-fit">
            <h4 className="text-gray-800 dark:text-white font-semibold flex items-center gap-2">
                <Palette size={18} className="text-blue-500 dark:text-blue-400" /> {t.customizeCard}
            </h4>

            {/* Gradient Picker */}
            <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">{t.selectTheme}</label>
                <div className="flex gap-3 flex-wrap">
                    {CARD_GRADIENTS.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => setSelectedGradient(g)}
                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${g.gradient} ring-2 ring-offset-2 ring-offset-gray-200 dark:ring-offset-gray-900 transition-all ${selectedGradient.id === g.id ? 'ring-blue-500 dark:ring-white scale-110' : 'ring-transparent hover:scale-105'}`}
                            title={g.name}
                        />
                    ))}
                </div>
            </div>

            {/* Font Picker */}
            <div>
                 <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Typography</label>
                 <div className="grid grid-cols-2 gap-2">
                     {CARD_FONTS.map(f => (
                         <button
                            key={f.id}
                            onClick={() => setSelectedFont(f.id as FontStyle)}
                            className={`px-3 py-2 rounded-lg text-sm border transition-all ${selectedFont === f.id ? 'bg-white dark:bg-white text-black border-white' : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-400 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400'}`}
                         >
                            <span className={fontClassMap[f.id as FontStyle]}>{f.name}</span>
                         </button>
                     ))}
                 </div>
            </div>

            {/* Image Upload */}
            <div>
                 <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">{t.uploadPhoto} (Optional)</label>
                 <label className="flex items-center justify-center w-full h-12 border border-dashed border-gray-400 dark:border-gray-500 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white">
                        <Upload size={16} />
                        <span className="text-sm">{userImage ? 'Change Image' : 'Choose File'}</span>
                    </div>
                 </label>
            </div>

             {/* Status Selector */}
            <div>
                 <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Birthday Message</label>
                 <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={statusText} 
                        onChange={(e) => setStatusText(e.target.value)}
                        className="flex-1 bg-white/50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-4 text-gray-800 dark:text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                    <button 
                        onClick={() => {
                             const quotes = BIRTHDAY_QUOTES[lang];
                             const random = quotes[Math.floor(Math.random() * quotes.length)];
                             setStatusText(random.text);
                        }}
                        className="p-2 bg-black/5 dark:bg-white/10 rounded-xl text-gray-700 dark:text-white hover:bg-black/10 dark:hover:bg-white/20"
                    >
                        🎲
                    </button>
                 </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <GlassButton onClick={handleDownload} className="flex-1 w-full justify-center" icon={<Download size={18} />}>
                    {isDownloading ? 'Processing...' : t.downloadCard}
                </GlassButton>
                <GlassButton onClick={handleShare} variant="secondary" className="flex-none px-4 w-full sm:w-auto justify-center" icon={<Share2 size={18} />}>
                    {/* Added text for mobile since just icon might be too small click area */}
                    <span className="sm:hidden ml-2">{lang === 'en' ? 'Share' : 'শেয়ার'}</span>
                </GlassButton>
            </div>
        </div>
      </div>
    </div>
  );
};