# 💻 أمثلة عملية للتطبيق - LandSpice Contest

**التاريخ:** 2025-10-23  
**الهدف:** توفير أمثلة عملية وجاهزة للتطبيق

---

## 📋 جدول المحتويات

1. [مكونات UI متقدمة](#مكونات-ui-متقدمة)
2. [Hooks مخصصة](#hooks-مخصصة)
3. [خدمات وأدوات](#خدمات-وأدوات)
4. [صفحات متقدمة](#صفحات-متقدمة)

---

## 🎨 مكونات UI متقدمة

### 1. زر متقدم (Advanced Button)

```typescript
// src/components/ui/Button.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500',
    secondary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
    ghost: 'text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-2',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
    xl: 'px-8 py-4 text-xl gap-3',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (isDisabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={isDisabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          جاري التحميل...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
}
```

### 2. بطاقة متقدمة (Advanced Card)

```typescript
// src/components/ui/Card.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hover = false,
  shadow = 'md',
  border = true,
  onClick,
}: CardProps) {
  const shadows = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return (
    <div
      className={cn(
        'rounded-lg bg-white p-6',
        shadows[shadow],
        border && 'border border-gray-200',
        hover && 'hover:shadow-lg transition-shadow duration-200 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
```

### 3. نموذج متقدم (Advanced Form)

```typescript
// src/components/ui/Form.tsx
import { ReactNode, FormEvent } from 'react';
import { cn } from '@/lib/utils';

interface FormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
  layout?: 'vertical' | 'horizontal';
}

export function Form({
  onSubmit,
  children,
  className,
  layout = 'vertical',
}: FormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        layout === 'vertical' && 'space-y-6',
        layout === 'horizontal' && 'grid grid-cols-2 gap-6',
        className
      )}
    >
      {children}
    </form>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export function FormField({
  label,
  error,
  required = false,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-600">{hint}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

---

## 🎯 Hooks مخصصة

### 1. Hook لإدارة النموذج (useForm)

```typescript
// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface FormState {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

export function useForm<T extends FormState>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

      setValues(prev => ({
        ...prev,
        [name]: newValue,
      }));

      // مسح الخطأ عند التعديل
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } catch (error: any) {
        setErrors(error.errors || { submit: error.message });
        setIsValid(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit]
  );

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsValid(true);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
  };
}
```

### 2. Hook للبيانات المحلية (useLocalStorage)

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // قراءة من localStorage عند التحميل
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // كتابة إلى localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue, isLoading] as const;
}
```

### 3. Hook للطلبات (useFetch)

```typescript
// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [url, options]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
```

---

## 🛠️ خدمات وأدوات

### 1. خدمة API (API Service)

```typescript
// src/lib/api.ts
export class APIClient {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new APIClient();
```

### 2. خدمة التحقق (Validation Service)

```typescript
// src/lib/validators.ts
export const validators = {
  email: (email: string): string | null => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? null : 'البريد الإلكتروني غير صحيح';
  },

  phone: (phone: string): string | null => {
    const regex = /^7[0-9]{8}$/;
    return regex.test(phone) ? null : 'رقم الهاتف يجب أن يكون 9 أرقام يمنية';
  },

  name: (name: string): string | null => {
    if (name.length < 3) return 'الاسم يجب أن يكون 3 أحرف على الأقل';
    if (name.length > 50) return 'الاسم يجب ألا يتجاوز 50 حرف';
    return null;
  },

  password: (password: string): string | null => {
    if (password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (!/[A-Z]/.test(password)) return 'كلمة المرور يجب أن تحتوي على حرف كبير';
    if (!/[0-9]/.test(password)) return 'كلمة المرور يجب أن تحتوي على رقم';
    return null;
  },
};
```

---

## 📄 صفحات متقدمة

### 1. صفحة تسجيل محسّنة

```typescript
// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Form, FormField } from '@/components/ui/Form';
import { validators } from '@/lib/validators';
import { useNotification } from '@/hooks/useNotification';

export default function RegisterPage() {
  const { showSuccess, showError } = useNotification();
  const [step, setStep] = useState(1);

  const { values, errors, isSubmitting, handleChange, handleSubmit, setFieldError } = useForm(
    {
      name: '',
      email: '',
      phone: '',
      city: '',
      password: '',
      confirmPassword: '',
    },
    async (values) => {
      // التحقق من البيانات
      const nameError = validators.name(values.name);
      const emailError = validators.email(values.email);
      const phoneError = validators.phone(values.phone);
      const passwordError = validators.password(values.password);

      if (nameError || emailError || phoneError || passwordError) {
        if (nameError) setFieldError('name', nameError);
        if (emailError) setFieldError('email', emailError);
        if (phoneError) setFieldError('phone', phoneError);
        if (passwordError) setFieldError('password', passwordError);
        throw new Error('البيانات غير صحيحة');
      }

      if (values.password !== values.confirmPassword) {
        setFieldError('confirmPassword', 'كلمات المرور غير متطابقة');
        throw new Error('كلمات المرور غير متطابقة');
      }

      // إرسال البيانات
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('فشل التسجيل');

      showSuccess('تم التسجيل بنجاح!');
      // إعادة التوجيه
      window.location.href = '/dashboard';
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">إنشاء حساب</h1>

        <Form onSubmit={handleSubmit}>
          {step === 1 ? (
            <>
              <FormField label="الاسم الكامل" error={errors.name} required>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="محمد أحمد"
                />
              </FormField>

              <FormField label="البريد الإلكتروني" error={errors.email} required>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="example@email.com"
                />
              </FormField>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.history.back()} fullWidth>
                  رجوع
                </Button>
                <Button onClick={() => setStep(2)} fullWidth>
                  التالي
                </Button>
              </div>
            </>
          ) : (
            <>
              <FormField label="رقم الهاتف" error={errors.phone} required>
                <input
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="712345678"
                />
              </FormField>

              <FormField label="المدينة" required>
                <select
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">اختر المدينة</option>
                  <option value="صنعاء">صنعاء</option>
                  <option value="عدن">عدن</option>
                  <option value="تعز">تعز</option>
                </select>
              </FormField>

              <FormField label="كلمة المرور" error={errors.password} required>
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="••••••••"
                />
              </FormField>

              <FormField label="تأكيد كلمة المرور" error={errors.confirmPassword} required>
                <input
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="••••••••"
                />
              </FormField>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} fullWidth>
                  السابق
                </Button>
                <Button type="submit" isLoading={isSubmitting} fullWidth>
                  إنشاء الحساب
                </Button>
              </div>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
}
```

---

**هذه الأمثلة جاهزة للاستخدام والتطبيق الفوري!** ✅
