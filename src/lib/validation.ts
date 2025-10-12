// Validation utilities for form data

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email || email.trim().length === 0) {
    return { isValid: false, message: 'البريد الإلكتروني مطلوب' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'البريد الإلكتروني غير صحيح. مثال: example@email.com' };
  }
  
  return { isValid: true };
}

export function validatePhone(phone: string): { isValid: boolean; message?: string } {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, message: 'رقم الهاتف مطلوب' };
  }
  
  // Yemen phone number validation (9 digits starting with 7)
  const phoneRegex = /^7[0-9]{8}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, message: 'رقم الهاتف غير صحيح. يجب أن يبدأ بـ 7 ويتكون من 9 أرقام' };
  }
  
  return { isValid: true };
}

export function validateName(name: string): { isValid: boolean; message?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, message: 'الاسم مطلوب' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: 'الاسم قصير جداً (الحد الأدنى حرفان)' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, message: 'الاسم طويل جداً (الحد الأقصى 50 حرف)' };
  }
  
  return { isValid: true };
}

export function validateCity(city: string): { isValid: boolean; message?: string } {
  if (!city || city.trim().length === 0) {
    return { isValid: false, message: 'المدينة مطلوبة' };
  }
  
  if (city.trim().length < 2) {
    return { isValid: false, message: 'اسم المدينة قصير جداً (الحد الأدنى حرفان)' };
  }
  
  if (city.trim().length > 30) {
    return { isValid: false, message: 'اسم المدينة طويل جداً (الحد الأقصى 30 حرف)' };
  }
  
  return { isValid: true };
}

export function validateRegistrationData(data: {
  name: string;
  email: string;
  phone: string;
  city: string;
  referredBy?: string;
}): ValidationResult {
  const errors: string[] = [];

  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.message || 'الاسم غير صحيح');
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.message || 'البريد الإلكتروني غير صحيح');
  }

  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.isValid) {
    errors.push(phoneValidation.message || 'رقم الهاتف غير صحيح');
  }

  const cityValidation = validateCity(data.city);
  if (!cityValidation.isValid) {
    errors.push(cityValidation.message || 'المدينة غير صحيحة');
  }

  // التحقق من كود الإحالة إذا تم إدخاله
  if (data.referredBy && data.referredBy.trim().length > 0) {
    if (!validateReferralCode(data.referredBy)) {
      errors.push('كود الإحالة غير صحيح. يجب أن يبدأ بـ LS ويتكون من 10 أحرف');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LS';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function validateReferralCode(code: string): boolean {
  const codeRegex = /^LS[A-Z0-9]{8}$/;
  return codeRegex.test(code);
}
