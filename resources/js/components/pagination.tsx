import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

type PaginationProps = {
    links: { url: string | null; label: string; active: boolean }[];
};

export default function Pagination({ links }: PaginationProps) {
    if (!links.length) return null;

    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {links.map((link, i) => {
                const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');

                return (
                    <Button
                        key={i}
                        size="sm"
                        variant={link.active ? 'default' : 'outline'}
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url)}
                    >
                        {label}
                    </Button>
                );
            })}
        </div>
    );
}
