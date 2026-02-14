import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Download, Share2, Upload, Palette, Type, Check } from 'lucide-react';
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

  // Sync with StatusGenerator
  useEffect(() => {
    if (externalStatus) {
      setStatusText(externalStatus);
    }
  }, [externalStatus]);

  useEffect(() => {
      const executeDownload = () => {
          if (pendingDownload && cardRef.current) {
              setPendingDownload(false); // Reset flag
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
            const canvas = await html2canvas(cardRef.current, {
            scale: 2, // High resolution
            useCORS: true,
            backgroundColor: null,
            });
            
            const link = document.createElement('a');
            link.download = `ageclock-card-${name || 'user'}-${new Date().getFullYear()}.png`;
            link.href = canvas.toDataURL('image/png');
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
        const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null });
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const file = new File([blob], "ageclock-card.png", { type: "image/png" });
            if (navigator.share) {
                await navigator.share({
                    title: 'Birthday Card',
                    text: `Check out this birthday card for ${name || 'Friend'}!`,
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
        {/* Preview Section - Keep as is for visual accuracy */}
        <div className="flex flex-col items-center">
            <motion.div 
                ref={cardRef}
                layout
                className={`relative w-full aspect-[4/5] sm:aspect-[4/3] max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br ${selectedGradient.gradient}`}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center border-[3px] border-white/30 rounded-2xl p-4 bg-white/10 backdrop-blur-sm">
                    {userImage ? (
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
                            <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="text-6xl mb-4 animate-bounce">🎂</div>
                    )}

                    <h2 className={`text-4xl md:text-5xl ${selectedGradient.textColor} mb-2 drop-shadow-lg ${fontClassMap[selectedFont]}`}>
                        {name || (lang === 'en' ? 'Happy Birthday' : 'শুভ জন্মদিন')}
                    </h2>
                    
                    <div className="bg-white/20 px-4 py-1 rounded-full mb-4 backdrop-blur-md">
                         <p className={`text-lg md:text-xl font-bold text-white ${fontClassMap.fun}`}>
                            {age.years} {t.years} Young!
                         </p>
                    </div>

                    <p className={`text-white/90 text-sm md:text-lg italic max-w-[80%] leading-relaxed ${fontClassMap.sans}`}>
                        "{statusText}"
                    </p>

                    <div className="absolute bottom-4 right-4 opacity-60">
                        <p className="text-[10px] text-white uppercase tracking-widest">AgeClock App</p>
                    </div>
                    
                    <div className="absolute top-4 left-4 text-2xl animate-pulse">🎉</div>
                    <div className="absolute bottom-10 left-8 text-xl animate-spin-slow">🎈</div>
                    <div className="absolute top-10 right-8 text-xl animate-bounce">✨</div>
                </div>
            </motion.div>
        </div>

        {/* Customization Controls */}
        <div className="glass-card rounded-3xl p-6 space-y-6">
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

            <div className="pt-4 flex gap-4">
                <GlassButton onClick={handleDownload} className="flex-1" icon={<Download size={18} />}>
                    {isDownloading ? 'Processing...' : t.downloadCard}
                </GlassButton>
                <GlassButton onClick={handleShare} variant="secondary" className="flex-none px-4" icon={<Share2 size={18} />} />
            </div>
        </div>
      </div>
    </div>
  );
};