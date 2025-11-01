import { about, dashboard, login, register } from '@/routes';
import patients from '@/routes/patients';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const isUser = user && user.role === 'user';
    const patientId = user && typeof user.patient_id === 'string' ? user.patient_id : null;

    const dashboardLink = isUser && patientId ? patients.show(patientId) : dashboard();
    const dashboardLabel = isUser ? 'My Health' : 'Dashboard';

    return (
        <>
            <Head title="UniHealth - Unified Health Platform">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                {/* Navigation Header */}
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-5xl">
                    <nav className="flex w-full items-center justify-between gap-4">
                        {/* Logo/Brand */}
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-gradient-to-br from-green-500 to-teal-600 text-xs font-bold text-white">
                                UH
                            </div>
                            <span className="text-primary sm:inline">UniHealth</span>
                        </div>

                        {/* Right Navigation */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={about()}
                                className="inline-block rounded-sm border border-[#19140035] px-4 py-1.5 text-xs leading-normal text-[#1b1b18] transition-colors hover:border-[#1915014a] sm:text-sm dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                About
                            </Link>
                            {auth.user ? (
                                <Link
                                    href={dashboardLink}
                                    className="inline-block rounded-sm bg-gradient-to-r from-green-500 to-teal-600 px-4 py-1.5 text-xs leading-normal font-medium text-white transition-all hover:from-green-600 hover:to-teal-700 sm:text-sm"
                                >
                                    {dashboardLabel}
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-sm border border-transparent px-4 py-1.5 text-xs leading-normal text-[#1b1b18] transition-colors hover:border-[#19140035] sm:text-sm dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#1b1b18] bg-[#1b1b18] px-4 py-1.5 text-xs leading-normal font-medium text-white transition-colors hover:bg-black sm:text-sm dark:border-[#3E3E3A] dark:bg-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#4E4E4A]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Main Content */}
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse gap-0 lg:max-w-5xl lg:flex-row lg:gap-0">
                        {/* Left Content */}
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-10 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            {/* Title */}
                            <h1 className="mb-2 text-2xl font-bold text-[#1b1b18] lg:text-3xl dark:text-white">UniHealth</h1>
                            <p className="mb-4 text-base font-medium text-green-600 dark:text-green-400">
                                Unified Healthcare Platform for the Philippines
                            </p>

                            {/* Subtitle and Description */}
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A]">
                                Connecting Regional Health Units, Inventory Management, and Citizen Access in one seamless platform.
                            </p>

                            {/* Key Features */}
                            <div className="mb-8 space-y-4">
                                <div className="mb-3 font-semibold text-[#1b1b18] dark:text-white">Key Features</div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                                        <span className="text-sm">
                                            <strong className="text-[#1b1b18] dark:text-white">Healthcare Access:</strong> Easy citizen access to
                                            health services and appointments at Regional Health Units
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
                                        <span className="text-sm">
                                            <strong className="text-[#1b1b18] dark:text-white">Inventory Management:</strong> Real-time medication and
                                            medical supply tracking across facilities
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                        <span className="text-sm">
                                            <strong className="text-[#1b1b18] dark:text-white">Unified System:</strong> Centralized platform for
                                            coordinating Regional Health Units and services
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                                        <span className="text-sm">
                                            <strong className="text-[#1b1b18] dark:text-white">Prescription Management:</strong> Digital prescription
                                            tracking and medication request system
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* User Types */}
                            <div className="mb-8">
                                <div className="mb-3 font-semibold text-[#1b1b18] dark:text-white">Who Can Use UniHealth?</div>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                                        <div className="font-semibold text-green-900 dark:text-green-100">Citizens</div>
                                        <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                                            Access health services and track prescriptions
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-950">
                                        <div className="font-semibold text-teal-900 dark:text-teal-100">Health Staff</div>
                                        <p className="mt-1 text-xs text-teal-700 dark:text-teal-300">Manage patient care and prescriptions</p>
                                    </div>
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
                                        <div className="font-semibold text-blue-900 dark:text-blue-100">Inventory Staff</div>
                                        <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">Track and manage medical supplies</p>
                                    </div>
                                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950">
                                        <div className="font-semibold text-purple-900 dark:text-purple-100">Administrators</div>
                                        <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">Oversee system and regional units</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex gap-3">
                                {!auth.user && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm bg-gradient-to-r from-green-500 to-teal-600 px-5 py-2 text-sm leading-normal font-medium text-white transition-all hover:from-green-600 hover:to-teal-700"
                                    >
                                        Get Started
                                    </Link>
                                )}
                                <Link
                                    href={about()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-2 text-sm leading-normal text-[#1b1b18] transition-colors hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        {/* Right Visual Section */}
                        <div className="relative -mb-px flex aspect-[335/376] w-full shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-br from-green-100 to-teal-100 lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[420px] lg:rounded-t-none lg:rounded-r-lg dark:from-green-950 dark:to-teal-950">
                            {/* Decorative Content */}
                            <div className="px-6 text-center">
                                <div className="mb-6">
                                    <svg
                                        className="mx-auto mb-4 h-20 w-20 text-green-600 dark:text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-green-900 dark:text-green-100">Healthcare Simplified</h3>
                                <p className="mb-6 text-sm text-green-700 dark:text-green-300">
                                    Streamlined management of health services, inventory, and citizen access across all Regional Health Units.
                                </p>
                                <div className="space-y-2 text-xs text-green-600 dark:text-green-400">
                                    <p>✓ Secure Patient Records</p>
                                    <p>✓ Real-time Inventory Tracking</p>
                                    <p>✓ Prescription Management</p>
                                    <p>✓ Multi-facility Coordination</p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
