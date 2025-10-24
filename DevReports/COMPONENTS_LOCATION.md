# 📍 موقع المكونات والـ Hooks - LandSpice Contest SaaS

**التاريخ:** 2025-10-23  
**الحالة:** ✅ جميع المكونات موجودة

---

## 🎯 المكونات الأساسية (UI Components)

### 1. Button Component
**المسار:** `src/components/ui/Button.tsx`

```typescript
import { Button } from '@/components/ui/Button';

// الاستخدام:
<Button variant="primary" size="md" isLoading={false} fullWidth>
  اضغط هنا
</Button>
```

**الخصائص:**
- `variant`: primary | secondary | outline | ghost | danger
- `size`: sm | md | lg | xl
- `isLoading`: boolean
- `isDisabled`: boolean
- `fullWidth`: boolean
- `icon`: ReactNode
- `iconPosition`: left | right

---

### 2. Card Component
**المسار:** `src/components/ui/Card.tsx`

```typescript
import { Card } from '@/components/ui/Card';

// الاستخدام:
<Card>
  محتوى البطاقة
</Card>
```

**الخصائص:**
- `children`: ReactNode
- `className`: string (اختياري)

---

### 3. Form Components
**المسار:** `src/components/ui/Form.tsx`

#### Form
```typescript
import { Form } from '@/components/ui/Form';

<Form onSubmit={handleSubmit}>
  {/* محتوى النموذج */}
</Form>
```

#### FormField
```typescript
import { FormField } from '@/components/ui/Form';

<FormField label="البريد الإلكتروني" error={error} required>
  <input type="email" />
</FormField>
```

**الخصائص:**
- `label`: string
- `error`: string
- `required`: boolean
- `helperText`: string
- `children`: ReactNode

#### Input
```typescript
import { Input } from '@/components/ui/Form';

<Input type="text" placeholder="أدخل النص" error={false} />
```

#### Textarea
```typescript
import { Textarea } from '@/components/ui/Form';

<Textarea placeholder="أدخل النص الطويل" rows={4} />
```

#### Select
```typescript
import { Select } from '@/components/ui/Form';

<Select 
  options={[
    { value: 'option1', label: 'الخيار 1' },
    { value: 'option2', label: 'الخيار 2' },
  ]}
/>
```

---

### 4. NotificationContainer Component
**المسار:** `src/components/ui/NotificationContainer.tsx`

```typescript
import { NotificationContainer } from '@/components/ui/NotificationContainer';

// أضفه في الـ Layout الرئيسي
<NotificationContainer />
```

---

## 🎣 Hooks

### 1. useNotification Hook
**المسار:** `src/hooks/useNotification.ts`

```typescript
import { useNotification } from '@/hooks/useNotification';

export function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const handleClick = () => {
    showSuccess('تم بنجاح!');
    showError('حدث خطأ');
    showWarning('تحذير');
    showInfo('معلومة');
  };

  return <button onClick={handleClick}>اضغط</button>;
}
```

**الدوال المتاحة:**
- `showSuccess(message, duration?)`: عرض رسالة نجاح
- `showError(message, duration?)`: عرض رسالة خطأ
- `showWarning(message, duration?)`: عرض رسالة تحذير
- `showInfo(message, duration?)`: عرض رسالة معلومة
- `removeNotification(id)`: إزالة إشعار محدد

---

## 📁 هيكل المجلدات

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx ✅
│   │   ├── Card.tsx ✅
│   │   ├── Form.tsx ✅
│   │   ├── NotificationContainer.tsx ✅
│   │   └── index.ts ✅
│   └── admin/
│       ├── CompanyForm.tsx ✅
│       ├── CompanyDashboard.tsx ✅
│       ├── PlatformManager.tsx ✅
│       ├── ContestForm.tsx ✅
│       ├── AnalyticsDashboard.tsx ✅
│       ├── PaymentForm.tsx ✅
│       └── SettingsPage.tsx ✅
└── hooks/
    └── useNotification.ts ✅
```

---

## 🚀 كيفية الاستخدام

### مثال 1: استخدام Button و Card
```typescript
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function Example() {
  return (
    <Card>
      <h2>مثال</h2>
      <Button variant="primary" fullWidth>
        اضغط هنا
      </Button>
    </Card>
  );
}
```

### مثال 2: استخدام Form
```typescript
import { Form, FormField, Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { useNotification } from '@/hooks/useNotification';

export function LoginForm() {
  const { showSuccess, showError } = useNotification();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('البريد الإلكتروني مطلوب');
      showError('البريد الإلكتروني مطلوب');
      return;
    }

    showSuccess('تم تسجيل الدخول بنجاح');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField label="البريد الإلكتروني" error={error} required>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="أدخل بريدك الإلكتروني"
        />
      </FormField>
      <Button type="submit" fullWidth>
        تسجيل الدخول
      </Button>
    </Form>
  );
}
```

### مثال 3: استخدام NotificationContainer
```typescript
// في app/layout.tsx أو الـ Layout الرئيسي
import { NotificationContainer } from '@/components/ui/NotificationContainer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <NotificationContainer />
        {children}
      </body>
    </html>
  );
}
```

---

## ✅ قائمة المكونات المكتملة

| المكون | المسار | الحالة |
|--------|--------|--------|
| **Button** | `src/components/ui/Button.tsx` | ✅ |
| **Card** | `src/components/ui/Card.tsx` | ✅ |
| **Form** | `src/components/ui/Form.tsx` | ✅ |
| **Input** | `src/components/ui/Form.tsx` | ✅ |
| **Textarea** | `src/components/ui/Form.tsx` | ✅ |
| **Select** | `src/components/ui/Form.tsx` | ✅ |
| **FormField** | `src/components/ui/Form.tsx` | ✅ |
| **NotificationContainer** | `src/components/ui/NotificationContainer.tsx` | ✅ |
| **useNotification** | `src/hooks/useNotification.ts` | ✅ |

---

## 🎯 الخطوة التالية

الآن يمكنك استخدام هذه المكونات في جميع الملفات:

```typescript
// في أي ملف
import { Button, Card, Form, FormField, Input } from '@/components/ui';
import { useNotification } from '@/hooks/useNotification';
```

---

**جميع المكونات والـ Hooks جاهزة للاستخدام! ✅**
