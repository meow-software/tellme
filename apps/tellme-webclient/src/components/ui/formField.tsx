import React, { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
interface FormFieldProps {
    id: string
    label: string
    type: string
    placeholder: string
    required?: boolean
    isPassword?: boolean
    value?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    pattern?: RegExp
    error?: string
}
export const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    type,
    placeholder,
    required = false,
    isPassword = false,
    value = "",
    onChange,
    className,
    pattern,
    error,
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type={actualType}
                    id={id}
                    value={value}
                    pattern={pattern?.source}
                    onChange={onChange}
                    className={
                        className ||
                        `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 transform hover:scale-[1.01]
                        ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500'}`
                    }
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
                
                {/* Show/hide password icon */}
                {isPassword && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                )}

                {/* Error message */}
                {error && (
                    <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}
