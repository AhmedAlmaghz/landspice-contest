import { useState, useCallback } from 'react';
import { Participant } from '@/types';

/**
 * Hook لإدارة تقدم المتابعة
 */
export function useFollowProgress(participant: Participant) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localParticipant, setLocalParticipant] = useState<Participant>(participant);

  /**
   * حساب عدد المنصات المكتملة
   */
  const getCompletedCount = useCallback(() => {
    let count = 0;
    if (localParticipant.facebook_followed) count++;
    if (localParticipant.instagram_followed) count++;
    if (localParticipant.youtube_followed) count++;
    if (localParticipant.tiktok_followed) count++;
    if (localParticipant.twitter_followed) count++;
    if (localParticipant.facebook_channel_followed) count++;
    return count;
  }, [localParticipant]);

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
        return localParticipant.facebook_followed;
      case 'instagram':
        return localParticipant.instagram_followed;
      case 'youtube':
        return localParticipant.youtube_followed;
      case 'tiktok':
        return localParticipant.tiktok_followed;
      case 'twitter':
        return localParticipant.twitter_followed;
      case 'facebook_channel':
        return localParticipant.facebook_channel_followed;
      default:
        return false;
    }
  }, [localParticipant]);

  /**
   * تحديث البيانات المحلية بعد التحديث الناجح
   */
  const updateLocalParticipant = useCallback((updatedData: Partial<Participant>) => {
    setLocalParticipant(prev => ({ ...prev, ...updatedData }));
  }, []);

  /**
   * تحديث التقدم في الخادم مع Optimistic Updates
   */
  const updateProgress = useCallback(async (
    platformId: string,
    action: 'follow' | 'share'
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    setIsUpdating(true);
    setError(null);

    // Optimistic Update: تحديث الواجهة فوراً قبل استجابة الخادم
    const previousState = { ...localParticipant };
    
    if (action === 'follow') {
      const optimisticUpdate: Partial<Participant> = {
        progress: Math.min(localParticipant.progress + 16, 100),
        [`${platformId}_followed` as keyof Participant]: true as any
      };
      updateLocalParticipant(optimisticUpdate);
    } else if (action === 'share') {
      const optimisticUpdate: Partial<Participant> = {
        shares: localParticipant.shares + 1
      };
      updateLocalParticipant(optimisticUpdate);
    }

    try {
      const response = await fetch(`/api/participants/${localParticipant.id}/progress`, {
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
        // التراجع عن Optimistic Update في حالة الفشل
        setLocalParticipant(previousState);
        throw new Error(data.error || 'حدث خطأ في تحديث التقدم');
      }

      // تحديث بالبيانات الفعلية من الخادم
      if (data.progress !== undefined || data.shares !== undefined || data.platformFollowed !== undefined) {
        const updatedData: Partial<Participant> = {
          progress: data.progress ?? localParticipant.progress,
          shares: data.shares ?? localParticipant.shares,
        };

        // تحديث حالة المتابعة للمنصة المحددة
        if (data.platformFollowed && action === 'follow') {
          (updatedData as any)[`${platformId}_followed`] = true;
        }

        updateLocalParticipant(updatedData);
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  }, [localParticipant, updateLocalParticipant]);

  return {
    participant: localParticipant, // إرجاع البيانات المحلية المحدثة
    completedCount: getCompletedCount(),
    progressPercentage: getProgressPercentage(),
    isPlatformCompleted,
    updateProgress,
    isUpdating,
    error,
    updateLocalParticipant // تصدير الدالة للاستخدام الخارجي إذا لزم الأمر
  };
}
