import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
    current: number;
    max: number;
    text: string;
}

export function ProgressIndicator({ current, max, text }: ProgressIndicatorProps) {
    const progressPercentage = Math.min(100, (current / max) * 100);

    return (
        <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                {text}
            </span>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden max-w-xs mx-auto ring-1 ring-slate-900/5 dark:ring-white/5">
                <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
