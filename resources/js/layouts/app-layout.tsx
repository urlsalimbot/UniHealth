import FlashMessages from '@/components/flash-messages';
import { Toaster } from 'sonner';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <FlashMessages />
        {children}
        <Toaster position="top-center" richColors expand={false} />
    </AppLayoutTemplate>
);
