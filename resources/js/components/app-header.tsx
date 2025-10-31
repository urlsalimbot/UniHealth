import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import inventory from '@/routes/inventory';
import patients from '@/routes/patients';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { InertiaLinkProps, Link, usePage } from '@inertiajs/react';
import { Bell, CheckCircle2, Clipboard, LayoutGrid, Menu, Pill, User } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import NotificationsPanel from './notifications';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Patients',
        href: patients.index(),
        icon: User,
    },
    {
        title: 'Inventory',
        href: inventory.index(),

        icon: Pill,
    },
    {
        title: 'Users',
        href: admin.dashboard(),
        icon: Clipboard,
    },
    {
        title: 'Audits',
        href: admin.audits.index(),
        icon: CheckCircle2,
    },
];

export const hrefToString = (href: NonNullable<InertiaLinkProps['href']>): string => {
    if (typeof href === 'string') return href;
    if (typeof href === 'object' && 'url' in href && typeof href.url === 'string') {
        return href.url;
    }
    console.warn('Unexpected href type:', href);
    return '';
};

const rightNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const user = auth?.user;
    const userRole = user?.role ?? 'guest';
    const patientId = user?.patient_id;

    const getInitials = useInitials();

    const notifications = user?.notifications ?? [];

    const isActiveRoute = (href: string) => {
        const normalize = (url: string) => url.replace(/\/+$/, '').toLowerCase();
        if (href === '/') return normalize(page.url) === '/';
        return normalize(page.url).startsWith(normalize(href));
    };

    // Base navigation items
    const allNavItems: Record<string, NavItem[]> = {
        administrator: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
            { title: 'Patients', href: patients.index(), icon: User },
            { title: 'Inventory', href: inventory.index(), icon: Pill },
            { title: 'Users', href: admin.dashboard(), icon: Clipboard },
            { title: 'Audits', href: admin.audits.index(), icon: CheckCircle2 },
        ],
        'patient-intake': [{ title: 'Patients', href: patients.index(), icon: User }],
        doctor: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
            { title: 'Patients', href: patients.index(), icon: User },
            { title: 'Inventory', href: inventory.index(), icon: Pill },
        ],
        pharmacist: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
            { title: 'Inventory', href: inventory.index(), icon: Pill },
        ],
        patient: [
            { title: 'Patient', href: `/patients/${patientId ?? '#'}`, icon: User },
            { title: 'Inventory', href: inventory.index(), icon: Pill },
        ],
        guest: [],
    };

    const visibleNavItems = allNavItems[userRole] ?? [];

    const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

    const isGuest = userRole === 'guest';
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]" disabled={isGuest}>
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {visibleNavItems.map((item) => (
                                                <Link key={item.title} href={item.href} className="flex items-center space-x-2 font-medium">
                                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    {isGuest ? (
                        // Non-clickable logo when guest
                        <div className="flex items-center select-none">
                            <AppLogo />
                        </div>
                    ) : (
                        // Clickable logo for authenticated users
                        <Link href="/dashboard" className="flex items-center">
                            <AppLogo />
                        </Link>
                    )}

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        {!isGuest && (
                            <NavigationMenu className="flex h-full items-stretch">
                                <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                    {visibleNavItems.map((item, index) => {
                                        const isActive = isActiveRoute(hrefToString(item.href));
                                        return (
                                            <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        navigationMenuTriggerStyle(),
                                                        isActive && activeItemStyles,
                                                        'h-9 cursor-pointer px-3',
                                                    )}
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                    {item.title}
                                                </Link>
                                                {isActive && (
                                                    <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white" />
                                                )}
                                            </NavigationMenuItem>
                                        );
                                    })}
                                </NavigationMenuList>
                            </NavigationMenu>
                        )}
                    </div>

                    {/* Right side (Notifications + Avatar) */}
                    <div className="ml-auto flex items-center space-x-2">
                        {!isGuest && (
                            <div className="relative flex items-center space-x-1">
                                {/* Notifications */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                                            <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <NotificationsPanel auth={auth} notifications={auth?.user?.notifications} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        {/* Avatar (disabled for guest) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild disabled={isGuest}>
                                <Button variant="ghost" className={cn('size-10 rounded-full p-1', isGuest && 'cursor-not-allowed opacity-60')}>
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={user?.avatar} alt={user?.name ?? 'Guest'} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(user?.name ?? 'Guest')}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            {!isGuest && (
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={user} />
                                </DropdownMenuContent>
                            )}
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
