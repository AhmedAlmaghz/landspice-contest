# 🗺️ نظام الملاحة والصلاحيات

**التاريخ:** 2025-10-23  
**الحالة:** ✅ **مكتمل وجاهز للاستخدام**

---

## 📍 خريطة الملاحة

### الصفحات الرئيسية

```
/                          - الصفحة الرئيسية
├── /register              - صفحة الاختيار
│   ├── /register/company      - تسجيل الشركة
│   └── /register/participant  - تسجيل المشارك
├── /admin                 - لوحة الإدارة
│   ├── /admin/login           - تسجيل دخول الإدارة
│   ├── /admin/companies       - إدارة الشركات
│   ├── /admin/contests        - إدارة المسابقات
│   └── /admin/platforms       - إدارة الشبكات
├── /company               - لوحة الشركة
│   ├── /company/login         - تسجيل دخول الشركة
│   ├── /company/dashboard     - لوحة التحكم
│   ├── /company/contests      - المسابقات
│   ├── /company/platforms     - الشبكات الاجتماعية
│   ├── /company/participants  - المشاركون
│   └── /company/analytics     - التحليلات
└── /participant           - لوحة المشارك
    ├── /participant/dashboard     - لوحة التحكم
    ├── /participant/contests      - المسابقات
    ├── /participant/profile       - الملف الشخصي
    └── /participant/referrals     - الإحالات
```

---

## 🔐 نظام الصلاحيات

### الأدوار (Roles)

#### 1️⃣ **مسؤول النظام (SUPER_ADMIN)**
- إدارة كاملة للنظام
- إدارة جميع الشركات
- إدارة جميع المسابقات
- عرض جميع التقارير

#### 2️⃣ **مسؤول الشركة (COMPANY_ADMIN)**
- إنشاء وتعديل المسابقات
- إدارة الشبكات الاجتماعية
- إدارة المشاركين
- عرض التحليلات
- إدارة الفريق
- إدارة الفواتير

#### 3️⃣ **مدير الشركة (COMPANY_MANAGER)**
- إنشاء وتعديل المسابقات
- إدارة الشبكات الاجتماعية
- عرض المشاركين
- عرض التحليلات
- إجراء السحب

#### 4️⃣ **عارض الشركة (COMPANY_VIEWER)**
- عرض المسابقات
- عرض المشاركين
- عرض الفائزين
- عرض التحليلات

#### 5️⃣ **المشارك (PARTICIPANT)**
- عرض المسابقات
- متابعة الشبكات الاجتماعية
- عرض التقدم الشخصي

---

### الصلاحيات (Permissions)

#### صلاحيات المسابقات
- `create_contest` - إنشاء مسابقة
- `edit_contest` - تعديل المسابقة
- `delete_contest` - حذف المسابقة
- `view_contest` - عرض المسابقة
- `publish_contest` - نشر المسابقة

#### صلاحيات الشبكات الاجتماعية
- `manage_platforms` - إدارة الشبكات
- `add_platform` - إضافة شبكة
- `edit_platform` - تعديل الشبكة
- `delete_platform` - حذف الشبكة

#### صلاحيات المشاركين
- `view_participants` - عرض المشاركين
- `export_participants` - تصدير المشاركين
- `manage_participants` - إدارة المشاركين
- `delete_participant` - حذف المشارك

#### صلاحيات السحب والفائزين
- `manage_draw` - إجراء السحب
- `view_winners` - عرض الفائزين
- `announce_winners` - إعلان الفائزين

#### صلاحيات الإعدادات
- `manage_settings` - إدارة الإعدادات
- `manage_team` - إدارة الفريق
- `manage_billing` - إدارة الفواتير

#### صلاحيات التحليلات
- `view_analytics` - عرض التحليلات
- `export_analytics` - تصدير التحليلات

#### صلاحيات الإدارة العامة
- `manage_companies` - إدارة الشركات
- `manage_users` - إدارة المستخدمين
- `view_system_logs` - عرض السجلات
- `manage_subscriptions` - إدارة الاشتراكات

---

## 🔗 الروابط والملاحة

### مكونات الملاحة

#### 1. **Navigation Component**
```tsx
<Navigation userRole="admin" userName="أحمد محمد" />
```
- عرض القائمة الرئيسية
- عرض بيانات المستخدم
- زر تسجيل الخروج
- دعم الهاتف المحمول

#### 2. **Breadcrumb Component**
```tsx
<Breadcrumb />
```
- عرض المسار الحالي
- روابط للعودة للصفحات السابقة
- تحديث تلقائي حسب الصفحة الحالية

#### 3. **ProtectedRoute Component**
```tsx
<ProtectedRoute requiredRole={UserRole.COMPANY_ADMIN}>
  <CompanyDashboard />
</ProtectedRoute>
```
- حماية الصفحات المحمية
- التحقق من الأدوار والصلاحيات
- إعادة التوجيه للصفحة المناسبة

---

## 📊 جدول الصلاحيات حسب الدور

| الصلاحية | Super Admin | Company Admin | Company Manager | Company Viewer | Participant |
|---------|-------------|---------------|-----------------|----------------|-------------|
| create_contest | ✅ | ✅ | ✅ | ❌ | ❌ |
| edit_contest | ✅ | ✅ | ✅ | ❌ | ❌ |
| delete_contest | ✅ | ✅ | ❌ | ❌ | ❌ |
| view_contest | ✅ | ✅ | ✅ | ✅ | ✅ |
| publish_contest | ✅ | ✅ | ✅ | ❌ | ❌ |
| manage_platforms | ✅ | ✅ | ✅ | ❌ | ❌ |
| view_participants | ✅ | ✅ | ✅ | ✅ | ❌ |
| manage_draw | ✅ | ✅ | ✅ | ❌ | ❌ |
| view_winners | ✅ | ✅ | ✅ | ✅ | ❌ |
| manage_settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| view_analytics | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 🎯 تدفق الملاحة

### تدفق المشارك الجديد

```
الصفحة الرئيسية (/)
    ↓
زر التسجيل
    ↓
صفحة الاختيار (/register)
    ↓
تسجيل المشارك (/register/participant)
    ↓
ملء النموذج
    ↓
تسجيل ناجح
    ↓
لوحة المشارك (/participant/dashboard)
```

### تدفق الشركة الجديدة

```
الصفحة الرئيسية (/)
    ↓
زر التسجيل
    ↓
صفحة الاختيار (/register)
    ↓
تسجيل الشركة (/register/company)
    ↓
ملء النموذج
    ↓
تسجيل ناجح
    ↓
لوحة الشركة (/company/dashboard)
```

### تدفق الإدارة

```
الصفحة الرئيسية (/)
    ↓
زر تسجيل الدخول
    ↓
تسجيل دخول الإدارة (/admin/login)
    ↓
إدخال بيانات المسؤول
    ↓
تسجيل ناجح
    ↓
لوحة الإدارة (/admin)
    ↓
إدارة الشركات/المسابقات/الشبكات
```

---

## 🔄 الملاحة بين الصفحات

### من الصفحة الرئيسية

| الزر | الوجهة | الشرط |
|------|--------|-------|
| تسجيل | `/register` | للجميع |
| تسجيل الدخول | `/admin/login` | للجميع |
| لوحة التحكم | `/participant/dashboard` | للمشاركين المسجلين |
| الإدارة | `/admin` | لمسؤولي النظام |

### من لوحة الإدارة

| الرابط | الوجهة | الدور المطلوب |
|--------|--------|---------------|
| الشركات | `/admin/companies` | Super Admin |
| المسابقات | `/admin/contests` | Super Admin |
| الشبكات | `/admin/platforms` | Super Admin |
| الإحصائيات | `/admin/analytics` | Super Admin |

### من لوحة الشركة

| الرابط | الوجهة | الدور المطلوب |
|--------|--------|---------------|
| المسابقات | `/company/contests` | Company Admin+ |
| الشبكات | `/company/platforms` | Company Admin+ |
| المشاركون | `/company/participants` | Company Admin+ |
| التحليلات | `/company/analytics` | Company Admin+ |

---

## 📱 الملاحة على الهاتف المحمول

- ✅ قائمة جانبية قابلة للطي
- ✅ أيقونات واضحة
- ✅ نصوص مختصرة
- ✅ أزرار كبيرة وسهلة الضغط
- ✅ دعم اللمس الكامل

---

## 🔒 الحماية والأمان

### التحقق من الصلاحيات

```typescript
// التحقق من دور واحد
<ProtectedRoute requiredRole={UserRole.COMPANY_ADMIN}>
  <AdminPanel />
</ProtectedRoute>

// التحقق من أدوار متعددة
<ProtectedRoute requiredRole={[UserRole.COMPANY_ADMIN, UserRole.COMPANY_MANAGER]}>
  <ManagementPanel />
</ProtectedRoute>

// التحقق من صلاحية محددة
<ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_DRAW}>
  <DrawSystem />
</ProtectedRoute>
```

### إعادة التوجيه التلقائي

- إذا كان المستخدم غير مصرح → إعادة توجيه للصفحة الرئيسية
- إذا انتهت الجلسة → إعادة توجيه لتسجيل الدخول
- إذا لم يكن لديه صلاحيات → عرض رسالة خطأ

---

## ✅ الميزات المطبقة

- [x] نظام ملاحة شامل
- [x] نظام صلاحيات متقدم
- [x] مكون Navigation
- [x] مكون Breadcrumb
- [x] مكون ProtectedRoute
- [x] روابط في الصفحة الرئيسية
- [x] روابط في جميع الصفحات
- [x] دعم الهاتف المحمول
- [x] حماية الصفحات المحمية
- [x] إعادة توجيه تلقائي

---

## 🚀 الحالة الحالية

**نظام الملاحة والصلاحيات:**
- ✅ **مكتمل 100%**
- ✅ **جميع الروابط موجودة**
- ✅ **جميع الصلاحيات محددة**
- ✅ **جاهز للاستخدام الفوري**

---

**🎉 نظام الملاحة والصلاحيات جاهز للإنتاج! 🚀**
