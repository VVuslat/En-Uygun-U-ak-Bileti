/**
 * Input Component - Reusable input field with labels and validation
 * Giriş Bileşeni - Etiketli ve doğrulamalı yeniden kullanılabilir giriş alanı
 */

import React from 'react';

interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'date' | 'email' | 'number' | 'tel';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

/**
 * Accessible input component with label and error handling
 * Etiketli ve hata yönetimli erişilebilir giriş bileşeni
 */
const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  label,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="gerekli">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`
          px-3 py-2 border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      />
      {error && (
        <span 
          id={`${id}-error`} 
          className="text-sm text-red-500"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
