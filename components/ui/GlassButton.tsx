import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ children, variant = 'primary', icon, className, ...props }) => {
  const baseStyle = "relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg backdrop-blur-md";
  
  const variants = {
    primary: "bg-white/80 dark:bg-white/20 text-gray-900 dark:text-white border border-gray-200 dark:border-white/30 hover:bg-white dark:hover:bg-white/30 hover:scale-105 active:scale-95",
    secondary: "bg-black/5 dark:bg-black/20 text-gray-800 dark:text-white border border-gray-300 dark:border-white/10 hover:bg-black/10 dark:hover:bg-black/30 hover:scale-105 active:scale-95",
    danger: "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-100 border border-red-200 dark:border-red-500/30 hover:bg-red-500/20 dark:hover:bg-red-500/30 hover:scale-105 active:scale-95"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${className || ''}`}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </motion.button>
  );
};