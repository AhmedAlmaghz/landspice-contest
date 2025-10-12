# 🔒 سياسة الأمان - LandSpice Contest

## الإبلاغ عن الثغرات الأمنية

نحن نأخذ أمان تطبيق LandSpice Contest على محمل الجد.

### كيفية الإبلاغ

إذا اكتشفت ثغرة أمنية، الرجاء:

1. **لا تفتح Issue عام** - قد يعرض المستخدمين للخطر
2. أرسل بريد إلكتروني إلى: security@landspice.com
3. قدم تفاصيل كافية لإعادة إنتاج المشكلة

### ما نحتاجه

- وصف الثغرة
- خطوات إعادة الإنتاج
- التأثير المحتمل
- أي اقتراحات للإصلاح

---

## الإصدارات المدعومة

| الإصدار | مدعوم |
| ------- | ------ |
| 1.0.x   | ✅     |
| < 1.0   | ❌     |

---

## التدابير الأمنية المطبقة

### 1. حماية المدخلات
- ✅ تنظيف جميع المدخلات من HTML و JavaScript
- ✅ التحقق من صحة البيانات
- ✅ حماية من XSS

### 2. قاعدة البيانات
- ✅ استخدام Prepared Statements
- ✅ حماية من SQL Injection
- ✅ تشفير البيانات الحساسة

### 3. Rate Limiting
- ✅ حد أقصى 10 طلبات/دقيقة
- ✅ منع هجمات DDoS
- ✅ تسجيل المحاولات المشبوهة

### 4. المصادقة والتفويض
- ⚠️ **للإنتاج:** أضف نظام مصادقة قوي
- ⚠️ **للإنتاج:** حماية لوحة الإدارة
- ✅ CSRF protection جاهز للتفعيل

### 5. HTTPS
- ⚠️ **مطلوب للإنتاج:** استخدم SSL/TLS
- ⚠️ استخدم Let's Encrypt للشهادات المجانية

---

## أفضل الممارسات

### للتطوير:
```bash
# لا تضع أسرار في الكود
❌ const apiKey = "sk_live_123456"

# استخدم متغيرات البيئة
✅ const apiKey = process.env.API_KEY
```

### للإنتاج:
- ✅ استخدم HTTPS فقط
- ✅ فعّل CSRF protection
- ✅ أضف نظام مصادقة
- ✅ راقب السجلات
- ✅ حدّث التبعيات بانتظام

---

## قائمة التحقق الأمنية

### قبل النشر:
- [ ] تم تفعيل HTTPS
- [ ] تم إضافة المصادقة
- [ ] تم تحديث جميع التبعيات
- [ ] تم اختبار الثغرات الشائعة
- [ ] تم تفعيل Rate Limiting
- [ ] تم تشفير البيانات الحساسة
- [ ] تم إعداد النسخ الاحتياطية
- [ ] تم تكوين Firewall

---

## الثغرات الشائعة وكيفية تجنبها

### 1. XSS (Cross-Site Scripting)
```typescript
// ❌ خطر
dangerouslySetInnerHTML={{ __html: userInput }}

// ✅ آمن
{sanitizeInput(userInput)}
```

### 2. SQL Injection
```typescript
// ❌ خطر
db.query(`SELECT * FROM users WHERE id = ${userId}`)

// ✅ آمن
db.prepare('SELECT * FROM users WHERE id = ?').get(userId)
```

### 3. CSRF
```typescript
// ✅ استخدم CSRF tokens
const token = generateCSRFToken();
```

---

## التحديثات الأمنية

سنقوم بنشر تحديثات أمنية عند الحاجة.

### الاشتراك في التنبيهات:
- Watch المشروع على GitHub
- تابع صفحاتنا الرسمية

---

## الموارد

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**آخر تحديث:** 2025-10-07  
**الإصدار:** 1.0.5
