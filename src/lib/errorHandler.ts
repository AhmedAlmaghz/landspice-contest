/**
 * معالجة موحدة للأخطاء
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): {
  message: string;
  statusCode: number;
  code?: string;
} {
  // خطأ من النوع AppError
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code
    };
  }

  // خطأ عادي
  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500
    };
  }

  // خطأ غير معروف
  return {
    message: 'حدث خطأ غير متوقع',
    statusCode: 500
  };
}

// رسائل خطأ مخصصة
export const ErrorMessages = {
  // التسجيل
  REGISTRATION_FAILED: 'فشل التسجيل. حاول مرة أخرى.',
  EMAIL_EXISTS: 'البريد الإلكتروني مستخدم بالفعل.',
  INVALID_EMAIL: 'البريد الإلكتروني غير صحيح.',
  INVALID_PHONE: 'رقم الهاتف غير صحيح.',
  
  // المتابعة
  FOLLOW_FAILED: 'فشلت عملية المتابعة.',
  ALREADY_FOLLOWED: 'تمت المتابعة مسبقاً.',
  
  // المشاركة
  SHARE_FAILED: 'فشلت عملية المشاركة.',
  
  // السحب
  DRAW_FAILED: 'فشل السحب العشوائي.',
  NO_ELIGIBLE_PARTICIPANTS: 'لا يوجد مشاركون مؤهلون.',
  
  // عام
  DATABASE_ERROR: 'خطأ في قاعدة البيانات.',
  NETWORK_ERROR: 'خطأ في الاتصال.',
  UNAUTHORIZED: 'غير مصرح لك بهذا الإجراء.',
  NOT_FOUND: 'العنصر المطلوب غير موجود.',
  RATE_LIMIT_EXCEEDED: 'تم تجاوز الحد المسموح من الطلبات.',
};

// تسجيل الأخطاء
export function logError(error: unknown, context?: string) {
  const errorInfo = handleError(error);
  
  console.error('[Error]', {
    context,
    message: errorInfo.message,
    statusCode: errorInfo.statusCode,
    code: errorInfo.code,
    timestamp: new Date().toISOString()
  });
  
  // في الإنتاج، أرسل إلى خدمة تتبع الأخطاء (Sentry, etc.)
}

// معالج أخطاء API
export function apiErrorHandler(error: unknown) {
  const errorInfo = handleError(error);
  logError(error, 'API');
  
  return {
    error: errorInfo.message,
    code: errorInfo.code,
    statusCode: errorInfo.statusCode
  };
}
