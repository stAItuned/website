import { forwardRef } from 'react'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-full font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2'
    const variants = {
      primary:
        'bg-primary-400 text-white hover:bg-primary-500 focus:ring-primary-300',
      secondary:
        'border border-white/20 bg-white/5 text-white hover:bg-white/10 focus:ring-white',
    }
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
