import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, Cookie } from 'lucide-react';
import { GlassButton } from './ui/GlassButton';
import { TRANSLATIONS } from '../utils/data';
import { Language } from '../types';

export const CookieConsent: React.FC<{ lang: Language }> = ({ lang }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('cookieConsent')) {
            setShow(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[60] p-4 flex justify-center"
        >
            <div className="glass-card bg-[#0f0f1a]/90 backdrop-blur-xl border-t border-white/10 max-w-2xl w-full rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-full text-blue-400">
                        <Cookie size={24} />
                    </div>
                    <p className="text-gray-300 text-sm font-medium">
                        {TRANSLATIONS[lang].acceptCookies}
                    </p>
                </div>
                <GlassButton onClick={accept} className="py-2 px-6 text-sm whitespace-nowrap">
                    {TRANSLATIONS[lang].accept}
                </GlassButton>
            </div>
        </motion.div>
    );
};

export const LegalFooter: React.FC<{ lang: Language }> = ({ lang }) => {
    const [modalContent, setModalContent] = useState<'privacy' | 'terms' | null>(null);

    const Modal = ({ title, content }: { title: string, content: React.ReactNode }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a2e] border border-white/10 w-full max-w-lg max-h-[80vh] rounded-2xl flex flex-col shadow-2xl">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 rounded-t-2xl">
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                    <button onClick={() => setModalContent(null)} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto text-gray-300 text-sm space-y-4">
                    {content}
                </div>
                <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-2xl text-right">
                    <button onClick={() => setModalContent(null)} className="text-blue-400 hover:underline">Close</button>
                </div>
            </div>
        </div>
    );

    const privacyContent = (
        <>
            <p><strong>1. Data Collection:</strong> We do not store any personal data on our servers. All calculations happen on your device.</p>
            <p><strong>2. Local Storage:</strong> We use local storage to save your theme preferences and language settings.</p>
            <p><strong>3. Advertising:</strong> This app uses third-party advertising services which may collect anonymous data to show relevant ads.</p>
            <p><strong>4. Images:</strong> Photos uploaded for birthday cards are processed locally in your browser and are not uploaded anywhere.</p>
        </>
    );

    const termsContent = (
        <>
            <p><strong>1. Usage:</strong> By using this app, you agree to these terms. The app is provided "as is".</p>
            <p><strong>2. Accuracy:</strong> While we strive for accuracy, age calculations depend on the device date settings.</p>
            <p><strong>3. Intellectual Property:</strong> The generated card designs are for personal use.</p>
        </>
    );

    return (
        <>
            <footer className="mt-16 border-t border-white/5 py-8 text-center">
                <div className="flex justify-center gap-6 mb-4">
                    <button onClick={() => setModalContent('privacy')} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                        <Shield size={12} /> {TRANSLATIONS[lang].privacy}
                    </button>
                    <button onClick={() => setModalContent('terms')} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                        <FileText size={12} /> {TRANSLATIONS[lang].terms}
                    </button>
                </div>
                <p className="text-[10px] text-gray-600">© {new Date().getFullYear()} AgeClock. All rights reserved.</p>
            </footer>

            {modalContent === 'privacy' && <Modal title="Privacy Policy" content={privacyContent} />}
            {modalContent === 'terms' && <Modal title="Terms of Service" content={termsContent} />}
        </>
    );
};