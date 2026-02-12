'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Award,
    Target,
    logOut
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export function AdminSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    const navigation = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Contributions', href: '/admin/contributions', icon: FileText },
        { name: 'Role Fit', href: '/admin/role-fit', icon: Target },
        { name: 'Badges', href: '/admin/badges', icon: Award },
    ];

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex h-16 shrink-0 items-center">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={`
                                                    group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                                                    ${isActive
                                                        ? 'bg-slate-50 text-purple-600 dark:bg-slate-800 dark:text-purple-400'
                                                        : 'text-slate-700 hover:bg-slate-50 hover:text-purple-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-purple-400'
                                                    }
                                                `}
                                            >
                                                <item.icon
                                                    className={`h-6 w-6 shrink-0 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 group-hover:text-purple-600 dark:text-slate-500 dark:group-hover:text-purple-400'}`}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
