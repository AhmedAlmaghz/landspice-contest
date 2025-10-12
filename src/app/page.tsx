'use client';

import { useState, useEffect } from 'react';
import SocialLinks from '@/components/SocialLinks';
import RegistrationForm from '@/components/RegistrationForm';
import SocialActions from '@/components/SocialActions';
import ContestRules from '@/components/ContestRules';
import WelcomeMessage from '@/components/WelcomeMessage';
import { Participant, ContestSettings } from '@/types';
import { useReferralCode } from '@/hooks/useReferralCode';

export default function Home() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [settings, setSettings] = useState<ContestSettings | null>(null);
  const [showSocialActions, setShowSocialActions] = useState(false);
  const { referralCode, isReferred } = useReferralCode();

  useEffect(() => {
    // Check if user is already registered
    const savedParticipant = localStorage.getItem('contestParticipant');
    if (savedParticipant) {
      setParticipant(JSON.parse(savedParticipant));
      setShowSocialActions(true);
    }

    // Load contest settings
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch settings');
        }
        return res.json();
      })
      .then(data => setSettings(data.settings))
      .catch(err => {
        console.error('Error loading settings:', err);
        // Set default settings if API fails
        setSettings({
          id: 1,
          contest_title: 'مسابقة LandSpice',
          prize_description: 'جوائز قيمة للفائزين',
          contest_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          facebook_url: '#',
          instagram_url: '#',
          youtube_url: '#',
          tiktok_url: '#',
          twitter_url: '#',
          facebook_channel_url: '#',
          updated_at: new Date().toISOString()
        });
      });
  }, []);

  const handleRegistrationSuccess = (newParticipant: Participant) => {
    setParticipant(newParticipant);
    setShowSocialActions(true);
    localStorage.setItem('contestParticipant', JSON.stringify(newParticipant));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 animate-gradient">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 animate-fade-in">
                <span className="inline-block animate-float">🌶️</span> LandSpice
              </h1>
              <p className="text-white/90 text-sm md:text-lg font-medium">
                مسابقة المتابعة والمشاركة
              </p>
            </div>
            {participant ? (
              <a
                href="/dashboard"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors backdrop-blur-sm border border-white/30"
              >
                لوحة التحكم
              </a>
            ) : (
              <div className="w-24"></div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              🎉 انضم إلى مسابقة<br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                المتابعة والمشاركة
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              شارك في مسابقة رائعة واحصل على فرصة للفوز بجوائز قيمة!
              <br />
              <span className="text-yellow-300 font-semibold">سجّل الآن وابدأ رحلتك نحو الفوز</span>
            </p>
          </div>
          
          {settings && (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border-2 border-white/30 shadow-2xl animate-scale-in hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-6">
                <span className="text-6xl animate-bounce">🏆</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">الجوائز القيمة</h3>
              <div className="text-right text-white/95 text-lg md:text-xl whitespace-pre-line leading-relaxed bg-white/5 rounded-2xl p-6">
                {settings.prize_description}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Registration Form */}
      {!participant && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            {isReferred && referralCode && (
              <WelcomeMessage referralCode={referralCode} />
            )}
            <RegistrationForm 
              onSuccess={handleRegistrationSuccess} 
              initialReferralCode={referralCode}
            />
          </div>
        </section>
      )}

      {/* Social Actions */}
      {showSocialActions && participant && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <SocialActions 
              participant={participant} 
              settings={settings}
              onProgressUpdate={(updatedParticipant) => {
                setParticipant(updatedParticipant);
                localStorage.setItem('contestParticipant', JSON.stringify(updatedParticipant));
              }}
            />
          </div>
        </section>
      )}

      {/* Contest Rules */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <ContestRules />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/20 py-12">
        <div className="container mx-auto px-4">
          {/* Social Links */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              تابعونا على وسائل التواصل الاجتماعي
            </h3>
            <div className="flex justify-center">
              <SocialLinks
                showLabels={true}
                className="gap-6"
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <p className="text-white/80">
              &copy; 2024 LandSpice. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}