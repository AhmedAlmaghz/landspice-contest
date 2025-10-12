/**
 * دوال الأمان والحماية
 */

// تنظيف المدخلات من HTML و JavaScript
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // إزالة < و >
    .replace(/javascript:/gi, '') // إزالة javascript:
    .replace(/on\w+=/gi, '') // إزالة event handlers
    .substring(0, 1000); // حد أقصى 1000 حرف
}

// تنظيف البريد الإلكتروني
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/g, '')
    .substring(0, 100);
}

// تنظيف رقم الهاتف
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  
  return phone
    .trim()
    .replace(/[^0-9]/g, '')
    .substring(0, 15);
}

// تنظيف URL
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsedUrl = new URL(url);
    // السماح فقط بـ http و https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    return url.substring(0, 500);
  } catch {
    return '';
  }
}

// التحقق من معدل الطلبات (Rate Limiting)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // دقيقة واحدة
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  // تنظيف السجلات القديمة
  if (rateLimitStore[key] && rateLimitStore[key].resetTime < now) {
    delete rateLimitStore[key];
  }
  
  // إنشاء سجل جديد
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + windowMs
    };
  }
  
  const record = rateLimitStore[key];
  record.count++;
  
  const allowed = record.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - record.count);
  
  return {
    allowed,
    remaining,
    resetTime: record.resetTime
  };
}

// توليد كود إحالة آمن
export function generateSecureReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // بدون أحرف مشابهة
  let code = 'LS';
  
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

// التحقق من صحة كود الإحالة
export function isValidReferralCode(code: string): boolean {
  if (!code) return false;
  
  // يجب أن يبدأ بـ LS ويتكون من 10 أحرف
  const regex = /^LS[A-Z0-9]{8}$/;
  return regex.test(code);
}

// تشفير بسيط للبيانات الحساسة (للعرض فقط)
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
  
  return `${maskedUsername}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  
  return '***' + phone.slice(-4);
}

// التحقق من CSRF Token (بسيط)
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}

// تسجيل الأحداث الأمنية
export interface SecurityLog {
  timestamp: Date;
  event: string;
  identifier: string;
  details?: any;
}

const securityLogs: SecurityLog[] = [];

export function logSecurityEvent(event: string, identifier: string, details?: any) {
  const log: SecurityLog = {
    timestamp: new Date(),
    event,
    identifier,
    details
  };
  
  securityLogs.push(log);
  
  // الاحتفاظ بآخر 1000 سجل فقط
  if (securityLogs.length > 1000) {
    securityLogs.shift();
  }
  
  // في الإنتاج، يجب حفظ هذه السجلات في قاعدة بيانات
  console.log('[Security]', log);
}

export function getSecurityLogs(limit: number = 100): SecurityLog[] {
  return securityLogs.slice(-limit);
}

// التحقق من قوة كلمة المرور (للمستقبل)
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (password.length < 8) feedback.push('يجب أن تكون 8 أحرف على الأقل');
  if (!/[a-z]/.test(password)) feedback.push('أضف حروف صغيرة');
  if (!/[A-Z]/.test(password)) feedback.push('أضف حروف كبيرة');
  if (!/[0-9]/.test(password)) feedback.push('أضف أرقام');
  if (!/[^a-zA-Z0-9]/.test(password)) feedback.push('أضف رموز خاصة');
  
  return { score, feedback };
}
