import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { 
  Calendar, User, Calculator, Moon, Sun, Globe, 
  Clock, Hourglass, Star, Gift, Share, Heart 
} from 'lucide-react';
import { calculateAgeLogic } from './utils/logic';
import { TRANSLATIONS } from './utils/data';
import { CalculatedAge, Language, ThemeMode } from './types';
import { GlassButton } from './components/ui/GlassButton';
import { ResultCard } from './components/ResultCard';
import { StatusGenerator } from './components/StatusGenerator';
import { BirthdayCardGenerator } from './components/BirthdayCardGenerator';
import { AdBanner, AdPopup, MoreAppsButton } from './components/AdUnit';
import { CookieConsent, LegalFooter } from './components/Legal';

// Flower Emojis for the falling animation
const FLOWERS = ['🌸', '🌺', '🌻', '🌹', '🌷', '💐', '🌼', '🏵️'];

function App() {
  // State
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<CalculatedAge | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [loading, setLoading] = useState(false);
  const [generatedStatus, setGeneratedStatus] = useState('');
  const [showFlowers, setShowFlowers] = useState(false); // State for flower animation
  const resultRef = useRef<HTMLDivElement>(null);

  // Load Persisted Data
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLang(savedLang);
  }, []);

  // Theme Handling
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Lang Handling
  useEffect(() => {
    localStorage.setItem('lang', lang);
    setGeneratedStatus('');
  }, [lang]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'bn' : 'en');

  const handleCalculate = () => {
    if (!dob) return;
    setLoading(true);
    setResult(null);
    setShowFlowers(false); // Reset flowers

    // Track usage
    const count = parseInt(sessionStorage.getItem('calculateCount') || '0');
    sessionStorage.setItem('calculateCount', (count + 1).toString());

    setTimeout(() => {
      try {
        const res = calculateAgeLogic(dob, lang);
        setResult(res);
        
        if (res.isBirthday) {
          fireConfetti();
          triggerFlowers(); // Trigger the falling flowers
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }, 800);
  };

  const triggerFlowers = () => {
    setShowFlowers(true);
    // Stop flowers after 8 seconds
    setTimeout(() => setShowFlowers(false), 8000);
  };

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleScreenshot = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: null,
        scale: 2
      });
      const link = document.createElement('a');
      link.download = `ageclock-result.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const t = TRANSLATIONS[lang];

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${theme === 'dark' ? 'bg-[#0f0f1a]' : 'bg-gray-100'} overflow-x-hidden`}>
      
      <CookieConsent lang={lang} />
      <AdPopup />

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {theme === 'dark' ? (
           <>
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
           </>
        ) : (
           <>
             <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/30 blur-[120px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/30 blur-[120px]" />
           </>
        )}
      </div>

      {/* Flower Animation Container */}
      <AnimatePresence>
        {showFlowers && (
          <div className="flower-container">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="flower"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 3 + 4}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.5
                }}
              >
                {FLOWERS[Math.floor(Math.random() * FLOWERS.length)]}
              </div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className={`relative z-10 max-w-4xl mx-auto p-4 md:p-8 ${lang === 'bn' ? 'font-bangla' : 'font-sans'}`}>
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7F00FF] to-[#E100FF] flex items-center justify-center text-white shadow-lg">
                <Clock size={28} className="animate-pulse" />
             </div>
             <div>
               <h1 className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-gray-800 to-gray-500'}`}>
                 AgeClock
               </h1>
               <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                 {t.subtitle}
               </p>
             </div>
          </div>

          <div className="flex gap-3">
            <button onClick={toggleLang} className="p-3 rounded-xl glass-card text-gray-800 dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-all active:scale-95">
              <span className="font-bold">{lang === 'en' ? 'EN' : 'BN'}</span>
            </button>
            <button onClick={toggleTheme} className="p-3 rounded-xl glass-card text-gray-800 dark:text-white hover:bg-white/40 dark:hover:bg-white/20 transition-all active:scale-95">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Input Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden"
        >
          {/* Decorative Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00C6FF] to-[#E100FF]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className={`text-sm font-medium ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                 {lang === 'en' ? 'Name (Optional)' : 'নাম (ঐচ্ছিক)'}
               </label>
               <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                 <input 
                    type="text" 
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl glass-input text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all"
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className={`text-sm font-medium ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                 {t.dobLabel}
               </label>
               <div className="relative">
                 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                 <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl glass-input text-gray-800 dark:text-gray-400 focus:ring-2 focus:ring-purple-500 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                 />
               </div>
            </div>
          </div>

          <div className="mt-8">
             <GlassButton 
               onClick={handleCalculate} 
               className="w-full py-4 text-lg bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white hover:opacity-90 border-none shadow-purple-500/30"
             >
               {loading ? (
                 <span className="animate-pulse">Calculating...</span>
               ) : (
                 t.calculateBtn
               )}
             </GlassButton>
          </div>
        </motion.div>

        {/* Ad Space - Top Banner */}
        <div className="mb-8">
            <AdBanner slot="top-banner" />
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div 
               ref={resultRef}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="space-y-8"
            >
              {/* Greeting */}
              <div className="text-center space-y-2">
                <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {result.isBirthday ? `🎉 ${t.happyBirthday}` : `${t.greeting}, ${name || (lang === 'en' ? 'Friend' : 'বন্ধু')}!`}
                </h2>
                {result.isBirthday && (
                   <p className="text-pink-500 dark:text-pink-400 font-medium animate-bounce">{lang === 'en' ? "It's your special day!" : "আজ তোমার বিশেষ দিন!"}</p>
                )}
              </div>

              {/* Main Age Cards */}
              <div className="grid grid-cols-3 gap-4">
                 <ResultCard 
                    label={t.years} 
                    value={result.years} 
                    icon={Hourglass} 
                    colorClass="bg-blue-500" 
                    delay={0.1}
                 />
                 <ResultCard 
                    label={t.months} 
                    value={result.months} 
                    icon={Clock} 
                    colorClass="bg-purple-500" 
                    delay={0.2}
                 />
                 <ResultCard 
                    label={t.days} 
                    value={result.days} 
                    icon={Calendar} 
                    colorClass="bg-pink-500" 
                    delay={0.3}
                 />
              </div>

              {/* Secondary Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-white/40 dark:hover:bg-white/10 transition-colors">
                    <div className="p-3 bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 rounded-full">
                      <Star size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t.zodiac}</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{result.zodiac}</p>
                    </div>
                 </div>

                 <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-white/40 dark:hover:bg-white/10 transition-colors">
                    <div className="p-3 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t.totalDays}</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{result.totalDays.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-white/40 dark:hover:bg-white/10 transition-colors">
                    <div className="p-3 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full">
                      <Gift size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t.nextBirthday}</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {result.nextBirthdayDays === 0 ? (lang === 'en' ? 'Today!' : 'আজ!') : `${result.nextBirthdayDays} ${t.days}`}
                      </p>
                    </div>
                 </div>

                 <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:bg-white/40 dark:hover:bg-white/10 transition-colors">
                    <div className="p-3 bg-red-500/20 text-red-500 dark:text-red-400 rounded-full">
                      <Heart size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t.birthDayName}</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{result.birthDayName}</p>
                    </div>
                 </div>
              </div>
              
              {/* Extra Stats */}
              <div className="glass-card rounded-2xl p-4 overflow-x-auto">
                 <div className="flex justify-between min-w-[300px] divide-x divide-gray-300 dark:divide-white/10 text-center">
                    <div className="px-4 flex-1">
                       <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{t.weeks}</p>
                       <p className="text-sm font-bold text-gray-800 dark:text-white">{(Math.floor(result.totalDays / 7)).toLocaleString()}</p>
                    </div>
                    <div className="px-4 flex-1">
                       <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{t.hours}</p>
                       <p className="text-sm font-bold text-gray-800 dark:text-white">{(result.totalDays * 24).toLocaleString()}</p>
                    </div>
                    <div className="px-4 flex-1">
                       <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{t.minutes}</p>
                       <p className="text-sm font-bold text-gray-800 dark:text-white">{(result.totalDays * 24 * 60).toLocaleString()}</p>
                    </div>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center mt-6">
                 <GlassButton variant="secondary" onClick={handleScreenshot} icon={<Share size={18} />}>
                   {lang === 'en' ? 'Share Stats' : 'শেয়ার করুন'}
                 </GlassButton>
              </div>

              {/* Status Generator */}
              <StatusGenerator 
                lang={lang} 
                onStatusChange={(text) => setGeneratedStatus(text)} 
              />

              {/* Birthday Card Generator - Premium Template */}
              <BirthdayCardGenerator 
                age={result} 
                name={name} 
                lang={lang} 
                externalStatus={generatedStatus}
              />
              
              {/* Mid-Content Ad */}
              <div className="mt-8">
                <AdBanner slot="mid-content" />
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <div className="text-center mt-20 opacity-50">
            <div className="inline-block p-6 rounded-full bg-white/40 dark:bg-white/5 mb-4 animate-pulse">
               <Calculator size={48} className="text-gray-400 dark:text-white" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">{lang === 'en' ? 'Enter your details to begin' : 'শুরু করতে আপনার তথ্য দিন'}</p>
          </div>
        )}

        <div className="flex flex-col items-center pb-20">
           <MoreAppsButton lang={lang} />
        </div>

        {/* Sticky Bottom Ad */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0f0f1a]/90 backdrop-blur-md border-t border-gray-200 dark:border-white/10 p-2 hidden md:block">
            <AdBanner slot="sticky-footer" className="max-w-4xl mx-auto !h-[60px]" />
        </div>
        
        <LegalFooter lang={lang} />
      </div>
    </div>
  );
}

export default App;