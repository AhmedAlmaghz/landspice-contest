/**
 * اختبارات API
 */

console.log('🧪 اختبارات API:');

// محاكاة بيانات المشارك
const testParticipant = {
  name: 'محمد أحمد',
  email: 'test@example.com',
  phone: '712345678',
  city: 'صنعاء',
  referredBy: ''
};

// اختبار 1: التحقق من البيانات
console.log('\n1. اختبار التحقق من البيانات:');

function validateParticipant(data) {
  const errors = [];
  
  if (!data.name || data.name.length < 2) {
    errors.push('الاسم قصير جداً');
  }
  
  if (!data.email || !data.email.includes('@')) {
    errors.push('البريد الإلكتروني غير صحيح');
  }
  
  if (!data.phone || !/^7[0-9]{8}$/.test(data.phone)) {
    errors.push('رقم الهاتف غير صحيح');
  }
  
  if (!data.city || data.city.length < 2) {
    errors.push('المدينة مطلوبة');
  }
  
  return { valid: errors.length === 0, errors };
}

const validation = validateParticipant(testParticipant);
console.log(validation.valid ? '✅ البيانات صحيحة' : '❌ البيانات غير صحيحة');
if (!validation.valid) {
  console.log('الأخطاء:', validation.errors);
}

// اختبار 2: توليد كود الإحالة
console.log('\n2. اختبار توليد كود الإحالة:');

function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'LS';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const code1 = generateReferralCode();
const code2 = generateReferralCode();
console.log('✅ كود 1:', code1);
console.log('✅ كود 2:', code2);
console.log(code1 !== code2 ? '✅ الأكواد مختلفة' : '❌ الأكواد متطابقة');

// اختبار 3: حساب التقدم
console.log('\n3. اختبار حساب التقدم:');

function calculateProgress(followed) {
  const total = 6; // عدد المنصات
  const completed = Object.values(followed).filter(Boolean).length;
  return Math.round((completed / total) * 100);
}

const followed = {
  facebook: true,
  instagram: true,
  youtube: false,
  tiktok: false,
  twitter: false,
  facebook_channel: false
};

const progress = calculateProgress(followed);
console.log('✅ التقدم:', progress + '%');
console.log(progress === 33 ? '✅ الحساب صحيح' : '❌ الحساب خاطئ');

// اختبار 4: تنظيف المدخلات
console.log('\n4. اختبار تنظيف المدخلات:');

function sanitizeInput(input) {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .substring(0, 1000);
}

const dangerousInput = '<script>alert("xss")</script>محمد';
const cleanInput = sanitizeInput(dangerousInput);
console.log('✅ المدخل الخطر:', dangerousInput);
console.log('✅ المدخل النظيف:', cleanInput);
console.log(!cleanInput.includes('<script>') ? '✅ تم التنظيف' : '❌ فشل التنظيف');

// اختبار 5: Rate Limiting
console.log('\n5. اختبار Rate Limiting:');

const rateLimitStore = {};

function checkRateLimit(ip, maxRequests = 10) {
  const now = Date.now();
  const key = `ratelimit:${ip}`;
  
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { count: 0, resetTime: now + 60000 };
  }
  
  const record = rateLimitStore[key];
  
  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + 60000;
  }
  
  record.count++;
  
  return {
    allowed: record.count <= maxRequests,
    remaining: Math.max(0, maxRequests - record.count)
  };
}

// محاكاة 12 طلب
for (let i = 1; i <= 12; i++) {
  const result = checkRateLimit('192.168.1.1');
  const status = result.allowed ? '✅' : '❌';
  console.log(`${status} طلب ${i}: ${result.allowed ? 'مسموح' : 'محظور'} (متبقي: ${result.remaining})`);
}

console.log('\n✅ اكتملت جميع اختبارات API!');
