import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Share2, Sparkles, RefreshCw } from 'lucide-react';
import { Language, StatusMessage } from '../types';
import { BIRTHDAY_QUOTES, TRANSLATIONS } from '../utils/data';
import { GlassButton } from './ui/GlassButton';

interface StatusGeneratorProps {
  lang: Language;
}

export const StatusGenerator: React.FC<StatusGeneratorProps> = ({ lang }) => {
  const [currentQuote, setCurrentQuote] = useState<StatusMessage>(BIRTHDAY_QUOTES[lang][0]);
  const [isCopied, setIsCopied] = useState(false);

  const generateNew = () => {
    const quotes = BIRTHDAY_QUOTES[lang];
    let newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    // Ensure new quote is different if possible
    while (quotes.length > 1 && newQuote.id === currentQuote.id) {
       newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    setCurrentQuote(newQuote);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentQuote.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full mt-8">
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-yellow-300" />
            {TRANSLATIONS[lang].generateStatus}
          </h3>
        </div>

        <AnimatePresence mode='wait'>
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 min-h-[100px] flex items-center justify-center text-center"
          >
            <p className="text-lg md:text-xl text-white font-medium leading-relaxed">
              "{currentQuote.text}"
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap gap-3 justify-center">
          <GlassButton onClick={generateNew} icon={<RefreshCw size={18} />}>
            {lang === 'en' ? 'Random' : 'নতুন বার্তা'}
          </GlassButton>
          
          <GlassButton 
            onClick={copyToClipboard} 
            variant="secondary"
            icon={<Copy size={18} />}
          >
            {isCopied ? (lang === 'en' ? 'Copied!' : 'কপি হয়েছে!') : TRANSLATIONS[lang].copy}
          </GlassButton>

          <GlassButton 
             variant="secondary"
             icon={<Share2 size={18} />}
             onClick={() => {
                if (navigator.share) {
                    navigator.share({
                        title: 'Birthday Wish',
                        text: currentQuote.text,
                    }).catch(console.error);
                }
             }}
          >
            {TRANSLATIONS[lang].share}
          </GlassButton>
        </div>
      </div>
    </div>
  );
};
