export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-gradient-to-br from-green-500 to-teal-600 text-xs font-bold text-white">
                    UH
                </div>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">UniHealth</span>
            </div>
        </>
    );
}
