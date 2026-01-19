'use client'

interface SegmentedControlOption {
    value: string
    label: React.ReactNode
}

interface SegmentedControlProps {
    options: SegmentedControlOption[]
    value: string
    onChange: (value: string) => void
    size?: 'sm' | 'md'
    className?: string
}

export function SegmentedControl({ options, value, onChange, size = 'md', className = '' }: SegmentedControlProps) {
    const isSmall = size === 'sm'

    return (
        <div className={`inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full p-1 shadow-inner ${className}`}>
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`
                        rounded-full font-bold transition-all whitespace-nowrap
                        ${isSmall ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}
                        ${value === option.value
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }
                    `}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}
