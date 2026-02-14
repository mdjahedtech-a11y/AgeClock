import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ResultCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
  delay?: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, icon: Icon, colorClass, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card p-4 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group hover:bg-white/20 transition-all`}
    >
      {/* Glow Effect */}
      <div className={`absolute -top-10 -right-10 w-24 h-24 ${colorClass} opacity-30 blur-2xl rounded-full group-hover:opacity-50 transition-opacity duration-500`} />
      
      <div className={`p-3 rounded-full mb-3 ${colorClass} bg-opacity-20 text-white shadow-inner`}>
        <Icon size={24} />
      </div>
      
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight drop-shadow-sm">
        {value}
      </h3>
      <p className="text-white/70 text-sm font-medium uppercase tracking-wider">{label}</p>
    </motion.div>
  );
};
