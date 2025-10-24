# 🔗 الروابط السريعة

**التاريخ:** 2025-10-23  
**الحالة:** ✅ **جميع الروابط جاهزة**

---

## 🏠 الصفحات الرئيسية

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| **الصفحة الرئيسية** | http://localhost:3000 | الصفحة الرئيسية للتطبيق |
| **صفحة الاختيار** | http://localhost:3000/register | اختيار نوع التسجيل |

---

## 👥 روابط التسجيل

### تسجيل الشركات
| الرابط | الوصف |
|--------|-------|
| http://localhost:3000/register/company | تسجيل شركة جديدة |
| http://localhost:3000/company/login | تسجيل دخول الشركة |
| http://localhost:3000/company/dashboard | لوحة تحكم الشركة |

### تسجيل المشاركين
| الرابط | الوصف |
|--------|-------|
| http://localhost:3000/register/participant | تسجيل مشارك جديد |
| http://localhost:3000/participant/dashboard | لوحة تحكم المشارك |

### تسجيل دخول الإدارة
| الرابط | الوصف |
|--------|-------|
| http://localhost:3000/admin/login | تسجيل دخول الإدارة |
| http://localhost:3000/admin | لوحة تحكم الإدارة |

---

## 🎛️ لوحات التحكم

### لوحة الإدارة
| الرابط | الوصف |
|--------|-------|
| http://localhost:3000/admin | الصفحة الرئيسية |
| http://localhost:3000/admin/companies | إدارة الشركات |
| http://localhost:3000/admin/contests | إدارة المسابقات |
| http://localhost:3000/admin/platforms | إدارة الشبكات الاجتماعية |

### لوحة الشركة
| الرابط | الوصف |
|--------|-------|
| http://localhost:3000/company/dashboard | الصفحة الرئيسية |
| http://localhost:3000/company/contests | المسابقات |
| http://localhost:3000/company/platforms | الشبكات الاجتماعية |
| http://localhost:3000/company/participants | المشاركون |
| http://localhost:3000/company/analytics | التحليلات |

### لوحة المشارك
| الرابط | الوصف |
|--------|-------|
| http://localhost:3000/participant/dashboard | الصفحة الرئيسية |
| http://localhost:3000/participant/contests | المسابقات |
| http://localhost:3000/participant/profile | الملف الشخصي |
| http://localhost:3000/participant/referrals | الإحالات |

---

## 📡 الـ APIs

### APIs الشركات
| الـ API | الطريقة | الوصف |
|--------|--------|-------|
| `/api/v1/companies` | GET | جلب الشركات |
| `/api/v1/companies` | POST | إنشاء شركة |
| `/api/v1/companies/register` | POST | تسجيل شركة جديدة |

### APIs المسابقات
| الـ API | الطريقة | الوصف |
|--------|--------|-------|
| `/api/v1/contests` | GET | جلب المسابقات |
| `/api/v1/contests` | POST | إنشاء مسابقة |
| `/api/v1/contests/:id` | GET | جلب مسابقة محددة |
| `/api/v1/contests/:id` | PUT | تحديث مسابقة |
| `/api/v1/contests/:id` | DELETE | حذف مسابقة |

### APIs الشبكات الاجتماعية
| الـ API | الطريقة | الوصف |
|--------|--------|-------|
| `/api/v1/social-platforms` | GET | جلب الشبكات المتاحة |
| `/api/v1/social-platforms` | POST | إضافة شبكة للمسابقة |
| `/api/v1/contests/:id/platforms` | GET | جلب شبكات المسابقة |

### APIs المشاركين
| الـ API | الطريقة | الوصف |
|--------|--------|-------|
| `/api/v1/participants/register` | POST | تسجيل مشارك جديد |
| `/api/participants` | GET | جلب المشاركين |
| `/api/participants/:id/progress` | POST | تحديث التقدم |

### APIs الإحصائيات
| الـ API | الطريقة | الوصف |
|--------|--------|-------|
| `/api/stats` | GET | جلب الإحصائيات |
| `/api/draw` | GET | جلب الفائزين |
| `/api/draw` | POST | إجراء السحب |

---

## 🔐 بيانات الدخول الافتراضية

### مسؤول النظام
```
البريد الإلكتروني: admin@landspice.com
كلمة المرور: admin123
```

### شركة تجريبية
```
الاسم: LandSpice Company
البريد الإلكتروني: company@landspice.com
```

---

## 📱 الوصول من الهاتف المحمول

جميع الروابط تعمل على الهاتف المحمول بشكل مثالي!

```
استبدل localhost بـ:
- 127.0.0.1:3000 (من نفس الجهاز)
- أو عنوان IP الجهاز (من جهاز آخر)
```

---

## 🚀 للبدء الفوري

```bash
# 1. تشغيل التطبيق
npm run dev

# 2. الذهاب إلى الصفحة الرئيسية
http://localhost:3000

# 3. اختيار نوع التسجيل
# - تسجيل الشركة
# - تسجيل المشارك
# - تسجيل دخول الإدارة
```

---

**🎉 استمتع باستخدام LandSpice! 🚀**
