'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  children: ReactNode
}

/**
 * Enhanced Button Component with animations and multiple variants
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:ring-primary-500',
    secondary: 'bg-secondary-500 text-gray-900 hover:bg-secondary-600 hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:shadow-md hover:scale-105 active:scale-95 focus-visible:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-105 active:scale-95 focus-visible:ring-primary-500',
    gradient: 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-primary-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </button>
  )
}

/**
 * Icon Button - Circular button for icons
 */
export function IconButton({
  size = 'md',
  className = '',
  children,
  ...props
}: Omit<ButtonProps, 'variant' | 'icon' | 'iconPosition'>) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-md hover:shadow-xl hover:scale-110 hover:border-primary-400 dark:hover:border-primary-600 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Link Button - Styled link that looks like a button
 */
export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  children,
  external = false,
}: {
  href: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  className?: string
  children: ReactNode
  external?: boolean
}) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group'
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:ring-primary-500',
    secondary: 'bg-secondary-500 text-gray-900 hover:bg-secondary-600 hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:shadow-md hover:scale-105 active:scale-95 focus-visible:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-105 active:scale-95 focus-visible:ring-primary-500',
    gradient: 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:from-primary-600 hover:to-primary-800 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-primary-500'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const linkProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {}
  
  return (
    <a
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...linkProps}
    >
      {icon && iconPosition === 'left' && (
        <span className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          {icon}
        </span>
      )}
      
      {external && !icon && (
        <svg 
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
          />
        </svg>
      )}
    </a>
  )
}
