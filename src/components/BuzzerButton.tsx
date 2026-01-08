import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface BuzzerButtonProps {
  onPress: () => void;
  disabled: boolean;
  pressed: boolean;
}

export default function BuzzerButton({ onPress, disabled, pressed }: BuzzerButtonProps) {
  return (
    <motion.button
      onClick={onPress}
      disabled={disabled}
      className={`
        w-40 h-40 rounded-full font-bold text-2xl transition-all duration-200 
        focus:outline-none focus:ring-4 focus:ring-red-500/50
        ${pressed 
          ? 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-2xl shadow-yellow-500/50' 
          : 'bg-gradient-to-br from-red-500 to-red-700 hover:shadow-2xl hover:shadow-red-500/30'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer active:scale-95 hover:scale-105'
        }
        text-white shadow-2xl
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={pressed ? { 
        boxShadow: [
          '0 0 0 0 rgba(239, 68, 68, 0.7)',
          '0 0 0 20px rgba(239, 68, 68, 0)',
          '0 0 0 0 rgba(239, 68, 68, 0)'
        ]
      } : {}}
      transition={{ 
        boxShadow: { 
          duration: 1.5, 
          repeat: pressed ? Infinity : 0,
          ease: "easeOut"
        }
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <Zap className="w-12 h-12" />
        <span className="text-lg">
          {pressed ? 'BUZZED!' : 'BUZZ'}
        </span>
      </div>
    </motion.button>
  );
}