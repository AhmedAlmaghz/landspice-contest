import { useState, useEffect } from 'react';

/**
 * Hook لاستخراج كود الإحالة من URL
 * يقرأ معامل 'ref' من query string ويحفظه
 */
export function useReferralCode() {
  const [referralCode, setReferralCode] = useState<string>('');
  const [isReferred, setIsReferred] = useState<boolean>(false);

  useEffect(() => {
    // استخراج كود الإحالة من URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      
      if (refCode) {
        setReferralCode(refCode);
        setIsReferred(true);
        
        // حفظ كود الإحالة في localStorage للاستخدام لاحقاً
        localStorage.setItem('referralCode', refCode);
      } else {
        // محاولة استرجاع كود الإحالة من localStorage
        const savedRefCode = localStorage.getItem('referralCode');
        if (savedRefCode) {
          setReferralCode(savedRefCode);
          setIsReferred(true);
        }
      }
    }
  }, []);

  return { referralCode, isReferred };
}
