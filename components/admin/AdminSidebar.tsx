'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    FileText,
    Award,
    Target,
    ClipboardCheck,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = useMemo(() => [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Contributions', href: '/admin/contributions', icon: FileText },
        { name: 'Reviews', href: '/admin/reviews', icon: ClipboardCheck },
        { name: 'Role Fit', href: '/admin/role-fit', icon: Target },
        { name: 'Badges', href: '/admin/badges', icon: Award },
    ], []);

    const isRouteActive = (href: string) => {
        if (href === '/admin') return pathname === href;
        return pathname.startsWith(href);
    };

    const activeRouteHref = useMemo(() => {
        const active = navigation.find((item) => isRouteActive(item.href));
        return active?.href ?? '/admin';
    }, [navigation, pathname]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    return (
        <>
            <div className="lg:hidden">
                <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                            <h1 className="text-base font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen((open) => !open)}
                                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                                aria-expanded={mobileMenuOpen}
                                aria-controls="admin-mobile-menu"
                                aria-label={mobileMenuOpen ? 'Close admin navigation menu' : 'Open admin navigation menu'}
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                            </button>
                        </div>
                    </div>

                    <div className="px-4 pb-3">
                        <label htmlFor="admin-mobile-route" className="sr-only">Go to admin section</label>
                        <select
                            id="admin-mobile-route"
                            value={activeRouteHref}
                            onChange={(event) => {
                                const nextRoute = event.target.value;
                                if (nextRoute && nextRoute !== pathname) {
                                    router.push(nextRoute);
                                }
                            }}
                            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            aria-label="Go to admin section"
                        >
                            {navigation.map((item) => (
                                <option key={item.href} value={item.href}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <nav aria-label="Admin quick navigation" className="overflow-x-auto px-2 pb-3">
                        <ul className="flex min-w-max items-center gap-2">
                            {navigation.map((item) => {
                                const isActive = isRouteActive(item.href);
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={[
                                                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                                                isActive
                                                    ? 'border-primary-600 bg-primary-600 text-white'
                                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                            ].join(' ')}
                                        >
                                            <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-50 lg:hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Admin navigation menu"
                    >
                        <button
                            type="button"
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Close menu overlay"
                        />
                        <div
                            id="admin-mobile-menu"
                            className="absolute right-0 top-0 h-full w-full max-w-xs border-l border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Navigate</h2>
                                <button
                                    type="button"
                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-label="Close admin menu"
                                >
                                    <X className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>

                            <nav aria-label="Admin pages">
                                <ul className="space-y-2">
                                    {navigation.map((item) => {
                                        const isActive = isRouteActive(item.href);
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={[
                                                        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                                                        isActive
                                                            ? 'bg-primary-600 text-white'
                                                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                                    ].join(' ')}
                                                >
                                                    <item.icon
                                                        className={[
                                                            'h-5 w-5 shrink-0',
                                                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-200'
                                                        ].join(' ')}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>

                            <button
                                type="button"
                                onClick={async () => {
                                    setMobileMenuOpen(false);
                                    if (signOut) {
                                        await signOut();
                                    }
                                }}
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                <LogOut className="h-4 w-4" aria-hidden="true" />
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>

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
                                        const isActive = isRouteActive(item.href);
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={`
                                                    group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6
                                                    ${isActive
                                                            ? 'bg-slate-50 text-primary-600 dark:bg-slate-800 dark:text-primary-400'
                                                            : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary-400'
                                                        }
                                                `}
                                                >
                                                    <item.icon
                                                        className={`h-6 w-6 shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-primary-600 dark:text-slate-500 dark:group-hover:text-primary-400'}`}
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
        </>
    );
}
