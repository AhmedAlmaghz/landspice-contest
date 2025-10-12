/**
 * نظام Cache بسيط للبيانات
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SimpleCache {
  private cache: Map<string, CacheItem<any>>;

  constructor() {
    this.cache = new Map();
  }

  // حفظ في الـ cache
  set<T>(key: string, data: T, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // جلب من الـ cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // التحقق من انتهاء الصلاحية
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  // حذف من الـ cache
  delete(key: string): void {
    this.cache.delete(key);
  }

  // مسح الـ cache بالكامل
  clear(): void {
    this.cache.clear();
  }

  // مسح العناصر المنتهية
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // الحصول على حجم الـ cache
  size(): number {
    return this.cache.size;
  }
}

// إنشاء instance واحد
export const cache = new SimpleCache();

// تنظيف تلقائي كل 5 دقائق
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 5 * 60 * 1000);
}

// دوال مساعدة للاستخدام الشائع
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 60000
): Promise<T> {
  // محاولة الجلب من الـ cache
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // جلب البيانات الجديدة
  const data = await fetchFn();
  
  // حفظ في الـ cache
  cache.set(key, data, ttl);
  
  return data;
}

// Cache للإحصائيات
export async function getCachedStats() {
  return getCachedData(
    'stats',
    async () => {
      const response = await fetch('/api/stats');
      return response.json();
    },
    30000 // 30 ثانية
  );
}

// Cache للمشاركين
export async function getCachedParticipants() {
  return getCachedData(
    'participants',
    async () => {
      const response = await fetch('/api/participants');
      return response.json();
    },
    60000 // دقيقة واحدة
  );
}
