/**
 * اختبارات التحقق من البيانات
 */

const { validateEmail, validatePhone, validateName } = require('../src/lib/validation');

// اختبارات البريد الإلكتروني
console.log('🧪 اختبارات البريد الإلكتروني:');

const emailTests = [
  { email: 'test@example.com', expected: true },
  { email: 'user.name@domain.co', expected: true },
  { email: 'invalid@', expected: false },
  { email: '@invalid.com', expected: false },
  { email: 'no-at-sign.com', expected: false },
  { email: '', expected: false }
];

emailTests.forEach(test => {
  const result = validateEmail(test.email);
  const status = result.isValid === test.expected ? '✅' : '❌';
  console.log(`${status} ${test.email}: ${result.isValid}`);
});

// اختبارات رقم الهاتف (يمني)
console.log('\n🧪 اختبارات رقم الهاتف:');

const phoneTests = [
  { phone: '712345678', expected: true },
  { phone: '777777777', expected: true },
  { phone: '700000000', expected: true },
  { phone: '612345678', expected: false }, // لا يبدأ بـ 7
  { phone: '71234567', expected: false }, // 8 أرقام فقط
  { phone: '7123456789', expected: false }, // 10 أرقام
  { phone: '', expected: false }
];

phoneTests.forEach(test => {
  const result = validatePhone(test.phone);
  const status = result.isValid === test.expected ? '✅' : '❌';
  console.log(`${status} ${test.phone}: ${result.isValid}`);
});

// اختبارات الاسم
console.log('\n🧪 اختبارات الاسم:');

const nameTests = [
  { name: 'محمد أحمد', expected: true },
  { name: 'فاطمة علي', expected: true },
  { name: 'أ', expected: false }, // قصير جداً
  { name: '', expected: false },
  { name: '123', expected: false }
];

nameTests.forEach(test => {
  const result = validateName(test.name);
  const status = result.isValid === test.expected ? '✅' : '❌';
  console.log(`${status} ${test.name}: ${result.isValid}`);
});

console.log('\n✅ اكتملت جميع الاختبارات!');
