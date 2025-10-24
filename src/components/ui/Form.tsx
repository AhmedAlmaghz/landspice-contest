// src/components/ui/Form.tsx
import { ReactNode } from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export function Form({ children, className = '', ...props }: FormProps) {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  );
}

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  helperText?: string;
}

export function FormField({
  label,
  error,
  required = false,
  children,
  helperText,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export function Select({ error, options = [], className = '', ...props }: SelectProps) {
  return (
    <select
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
