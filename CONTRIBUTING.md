# 🤝 دليل المساهمة - LandSpice Contest

## 🎯 نرحب بمساهماتك!

شكراً لاهتمامك بالمساهمة في مشروع LandSpice Contest!

---

## 📋 كيفية المساهمة

### 1. Fork المشروع
```bash
# انقر على Fork في GitHub
# ثم clone المشروع
git clone https://github.com/YOUR_USERNAME/landspice-contest.git
cd landspice-contest
```

### 2. إنشاء Branch جديد
```bash
git checkout -b feature/amazing-feature
```

### 3. التطوير
```bash
# تثبيت المتطلبات
npm install

# تشغيل التطوير
npm run dev

# اختبار التغييرات
npm test
```

### 4. Commit التغييرات
```bash
git add .
git commit -m "Add: amazing feature"
```

### 5. Push للـ Fork
```bash
git push origin feature/amazing-feature
```

### 6. إنشاء Pull Request
- افتح GitHub
- اضغط "New Pull Request"
- اشرح التغييرات بالتفصيل

---

## 📝 معايير الكود

### TypeScript/JavaScript:
```typescript
// ✅ جيد
export function calculateProgress(completed: number, total: number): number {
  return Math.round((completed / total) * 100);
}

// ❌ سيء
function calc(c,t){return c/t*100}
```

### React Components:
```typescript
// ✅ جيد
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

### CSS/Tailwind:
```typescript
// ✅ جيد - استخدم Tailwind classes
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// ❌ سيء - تجنب inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

---

## 🧪 الاختبارات

### قبل Submit:
```bash
# تشغيل الاختبارات
npm test

# فحص الأخطاء
npm run lint

# بناء المشروع
npm run build
```

### كتابة اختبارات جديدة:
```javascript
// tests/myFeature.test.js
describe('My Feature', () => {
  test('should work correctly', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

---

## 📦 أنواع المساهمات

### 1. إصلاح الأخطاء 🐛
- ابحث في Issues عن bugs
- أنشئ branch: `fix/bug-description`
- اشرح المشكلة والحل

### 2. ميزات جديدة ✨
- ناقش الفكرة في Issue أولاً
- أنشئ branch: `feature/feature-name`
- وثق الميزة الجديدة

### 3. تحسينات الأداء ⚡
- قس الأداء قبل وبعد
- أنشئ branch: `perf/improvement-name`
- أضف benchmarks

### 4. التوثيق 📚
- حسّن README أو الأدلة
- أنشئ branch: `docs/what-you-changed`
- تأكد من الوضوح

### 5. التصميم 🎨
- حسّن UI/UX
- أنشئ branch: `design/component-name`
- أضف screenshots

---

## 💬 Commit Messages

استخدم prefixes واضحة:

```bash
# ميزة جديدة
git commit -m "Add: user authentication system"

# إصلاح خطأ
git commit -m "Fix: registration form validation"

# تحسين
git commit -m "Improve: database query performance"

# توثيق
git commit -m "Docs: update API documentation"

# تصميم
git commit -m "Style: improve button hover effects"

# إعادة هيكلة
git commit -m "Refactor: simplify validation logic"

# اختبارات
git commit -m "Test: add unit tests for validation"
```

---

## 🔍 Code Review

### ما نبحث عنه:
- ✅ الكود نظيف وواضح
- ✅ يتبع معايير المشروع
- ✅ يحتوي على تعليقات مفيدة
- ✅ تم اختباره
- ✅ لا يكسر الكود الموجود

### ما نتجنبه:
- ❌ كود معقد بدون داعٍ
- ❌ تغييرات كبيرة بدون نقاش
- ❌ بدون اختبارات
- ❌ تجاهل معايير الكود

---

## 🎯 أولويات المشروع

### عالية الأولوية:
1. إصلاح الأخطاء الحرجة
2. تحسينات الأمان
3. تحسينات الأداء

### متوسطة الأولوية:
1. ميزات جديدة
2. تحسينات UI/UX
3. التوثيق

### منخفضة الأولوية:
1. إعادة الهيكلة
2. تحسينات صغيرة
3. تجميل الكود

---

## 📞 التواصل

### قبل البدء:
- افتح Issue لمناقشة الفكرة
- تأكد أن أحداً لا يعمل على نفس الشيء
- اسأل إذا كنت غير متأكد

### أثناء التطوير:
- حدّث Issue بالتقدم
- اطلب المساعدة إذا احتجت
- كن منفتحاً للملاحظات

---

## ✅ Checklist قبل Submit

- [ ] الكود يعمل بدون أخطاء
- [ ] تم اختبار جميع التغييرات
- [ ] التعليقات واضحة ومفيدة
- [ ] التوثيق محدّث
- [ ] Commit messages واضحة
- [ ] لا توجد console.log غير ضرورية
- [ ] الكود يتبع معايير المشروع

---

## 🙏 شكراً!

كل مساهمة، مهما كانت صغيرة، تساعد في تحسين المشروع!

**نتطلع لمساهماتك!** 🎉
