import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ReactNode } from 'react';

interface ConfirmDialogProps {
    /** Text or element that opens the dialog */
    trigger?: ReactNode;
    /** Title of the dialog */
    title?: string;
    /** Description message below the title */
    description?: string;
    /** Callback for when user confirms the action */
    onConfirm: () => void;
    /** Optional label for confirm button */
    confirmLabel?: string;
    /** Optional label for cancel button */
    cancelLabel?: string;
    /** Optional controlled state handler */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function ConfirmDialog({
    trigger,
    title = 'Confirm Action',
    description = 'Are you sure you want to proceed?',
    onConfirm,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    open,
    onOpenChange,
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
