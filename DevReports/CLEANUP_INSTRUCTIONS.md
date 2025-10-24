# 🧹 تعليمات التنظيف - المرحلة الأولى

**التاريخ:** 2025-10-23  
**الحالة:** 🔄 **تنظيف المشروع**

---

## ❌ الملفات والمجلدات المكررة التي يجب حذفها

### 1. مجلدات API مكررة
```
حذف:
- src/app/api/v1/companies/[slug]/
  السبب: مكرر - نستخدم src/app/api/companies/[companyId]/ بدلاً منه

الاحتفاظ بـ:
- src/app/api/companies/[companyId]/
```

### 2. مجلدات قديمة
```
حذف:
- src/app/company/[slug]/
  السبب: مكرر - نستخدم src/app/[companyId]/ بدلاً منه

الاحتفاظ بـ:
- src/app/[companyId]/
```

### 3. مجلدات API قديمة (غير مستخدمة)
```
حذف:
- src/app/api/analytics/
- src/app/api/export/
- src/app/api/publish/
- src/app/api/settings/
- src/app/api/social-links/
- src/app/api/stats/
- src/app/api/draw/

السبب: هذه الـ APIs القديمة لم تعد مستخدمة
الاستخدام الجديد: src/app/api/v1/
```

### 4. مجلدات API v1 غير المستخدمة
```
حذف:
- src/app/api/v1/analytics/
- src/app/api/v1/payments/
- src/app/api/v1/reports/
- src/app/api/v1/subscriptions/
- src/app/api/v1/verify/
- src/app/api/v1/webhooks/

السبب: لم تكتمل بعد - سيتم إنشاؤها لاحقاً
```

### 5. مجلدات صفحات قديمة
```
حذف:
- src/app/dashboard/
- src/app/login/

السبب: مكررة - نستخدم مسارات محددة بدلاً منها
الاستخدام الجديد:
- /admin/login
- /company/login
- /admin (لوحة الإدارة)
- /company/dashboard (لوحة الشركة)
- /participant/dashboard (لوحة المشارك)
```

---

## ✅ الملفات والمجلدات التي يجب الاحتفاظ بها

### الصفحات الرئيسية
```
احتفظ بـ:
- src/app/page.tsx
- src/app/register/
- src/app/[companyId]/
- src/app/contest/
- src/app/admin/
- src/app/company/
- src/app/participant/
```

### الـ APIs الصحيحة
```
احتفظ بـ:
- src/app/api/v1/companies/register/
- src/app/api/v1/companies/[companyId]/
- src/app/api/v1/contests/
- src/app/api/v1/participants/
- src/app/api/v1/social-platforms/
- src/app/api/companies/[companyId]/
- src/app/api/auth/
- src/app/api/participants/
```

---

## 📋 خطوات التنظيف

### الخطوة 1: حذف مجلدات API القديمة
```
حذف المجلدات التالية من src/app/api/:
1. analytics/
2. export/
3. publish/
4. settings/
5. social-links/
6. stats/
7. draw/
```

### الخطوة 2: حذف مجلدات API v1 غير المستخدمة
```
حذف المجلدات التالية من src/app/api/v1/:
1. analytics/
2. payments/
3. reports/
4. subscriptions/
5. verify/
6. webhooks/
```

### الخطوة 3: حذف مجلدات API المكررة
```
حذف:
- src/app/api/v1/companies/[slug]/
```

### الخطوة 4: حذف مجلدات الصفحات القديمة
```
حذف:
- src/app/dashboard/
- src/app/login/
- src/app/company/[slug]/
```

### الخطوة 5: اختبار الخادم
```bash
npm run dev
# التحقق من عدم وجود أخطاء build
```

---

## 🎯 الملفات المتبقية بعد التنظيف

### الصفحات (6 صفحات رئيسية)
```
✅ src/app/page.tsx
✅ src/app/register/page.tsx
✅ src/app/register/company/page.tsx
✅ src/app/register/participant/page.tsx
✅ src/app/[companyId]/page.tsx
✅ src/app/contest/[contestId]/page.tsx
```

### صفحات الإدارة (4 صفحات)
```
✅ src/app/admin/page.tsx
✅ src/app/admin/companies/page.tsx
✅ src/app/admin/contests/page.tsx
✅ src/app/admin/platforms/page.tsx
```

### الـ APIs (8 APIs)
```
✅ POST /api/v1/companies/register
✅ GET /api/companies/[companyId]
✅ POST /api/v1/participants/register
✅ GET /api/v1/contests
✅ POST /api/v1/contests/[contestId]/subscribe
✅ GET /api/v1/contests/[contestId]/platforms
✅ GET /api/auth/session
✅ POST /api/auth/login
```

---

## ⚠️ ملاحظات مهمة

1. **لا تحذف الملفات يدويًا** - استخدم الأوامر الصحيحة
2. **تحقق من عدم وجود أخطاء** - بعد كل حذف
3. **اختبر الخادم** - بعد التنظيف الكامل
4. **احفظ النسخة الاحتياطية** - قبل الحذف (اختياري)

---

## 🚀 الخطوة التالية

بعد إكمال التنظيف:
1. اختبر الخادم
2. تأكد من عدم وجود أخطاء
3. انتقل للمرحلة الثانية: نظام التسجيل والدخول

---

**🧹 تنظيف المشروع جاهز! استعد للبدء! 🚀**
