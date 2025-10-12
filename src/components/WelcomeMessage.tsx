'use client';

import { Gift, Sparkles } from 'lucide-react';

interface WelcomeMessageProps {
  referralCode: string;
}

export default function WelcomeMessage({ referralCode }: WelcomeMessageProps) {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-2xl">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Gift className="w-16 h-16 animate-bounce" />
            <Sparkles className="w-6 h-6 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-center mb-3">
          🎉 مرحباً بك في المسابقة!
        </h3>
        
        <p className="text-center text-lg mb-4 text-white/90">
          تمت إحالتك من قبل صديق! احصل على فرصة مضاعفة للفوز
        </p>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
          <p className="text-sm text-white/80 mb-2">كود الإحالة:</p>
          <p className="text-2xl font-bold font-mono tracking-wider">
            {referralCode}
          </p>
        </div>
        
        <div className="mt-4 text-center text-sm text-white/80">
          <p>✨ سيتم ملء كود الإحالة تلقائياً في النموذج</p>
        </div>
      </div>
    </div>
  );
}
