import { useState, useCallback } from 'react';
import { Participant } from '@/types';

/**
 * Hook لإدارة تقدم المتابعة
 */
export function useFollowProgress(participant: Participant) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * حساب عدد المنصات المكتملة
   */
  const getCompletedCount = useCallback(() => {
    let count = 0;
    if (participant.facebook_followed) count++;
    if (participant.instagram_followed) count++;
    if (participant.youtube_followed) count++;
    if (participant.tiktok_followed) count++;
    if (participant.twitter_followed) count++;
    if (participant.facebook_channel_followed) count++;
    return count;
  }, [participant]);

  /**
   * حساب النسبة المئوية للتقدم
   */
  const getProgressPercentage = useCallback(() => {
    const completed = getCompletedCount();
    return Math.round((completed / 6) * 100);
  }, [getCompletedCount]);

  /**
   * التحقق من اكتمال منصة معينة
   */
  const isPlatformCompleted = useCallback((platformId: string): boolean => {
    switch (platformId) {
      case 'facebook':
        return participant.facebook_followed;
      case 'instagram':
        return participant.instagram_followed;
      case 'youtube':
        return participant.youtube_followed;
      case 'tiktok':
        return participant.tiktok_followed;
      case 'twitter':
        return participant.twitter_followed;
      case 'facebook_channel':
        return participant.facebook_channel_followed;
      default:
        return false;
    }
  }, [participant]);

  /**
   * تحديث التقدم في الخادم
   */
  const updateProgress = useCallback(async (
    platformId: string,
    action: 'follow' | 'share'
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/participants/${participant.id}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: platformId,
          action: action
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ في تحديث التقدم');
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  }, [participant.id]);

  return {
    completedCount: getCompletedCount(),
    progressPercentage: getProgressPercentage(),
    isPlatformCompleted,
    updateProgress,
    isUpdating,
    error
  };
}
