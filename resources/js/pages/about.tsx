import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { dashboard, home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function About() {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();

    const teamMembers = [
        {
            name: 'Mark Manuel T. Lupangco',
            email: 'mark.lupangco@example.com',
            role: 'Project Manager',
            avatar: '',
        },
        {
            name: 'John Kenneth S. Benaojan',
            email: 'john.ken@example.com',
            role: 'Tester/Researcher',
            avatar: '',
        },
        {
            name: 'Marianne P. Nicolas',
            email: 'marianne.nicolas@example.com',
            role: 'Researcher/Documentation',
            avatar: '',
        },
        {
            name: 'Mervin O. Palad',
            email: 'mervin.palad@example.com',
            role: 'Researcher/Tester',
            avatar: '',
        },
        {
            name: 'John Earl Reinen L. Salimbot',
            email: 'john.s@example.com',
            role: 'Fullstack Developer',
            avatar: '',
        },
    ];

    const lead = teamMembers[0];
    const others = teamMembers.slice(1);

    return (
        <>
            <Head title="About">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-start lg:p-12 dark:bg-[#0a0a0a]">
                {/* Navbar */}
                <header className="mb-10 w-full max-w-6xl text-sm">
                    <nav className="flex w-full items-center justify-between gap-4">
                        {/* Left side */}
                        <div className="flex items-center gap-4">
                            <Link
                                href={home()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Home
                            </Link>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Team Section */}
                <main className="w-full max-w-6xl">
                    <h1 className="mb-8 text-center text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Meet the UniHealth Team</h1>

                    {/* Lead member card centered */}
                    <div className="mb-10 flex justify-center">
                        <div className="flex w-full max-w-sm flex-col items-center rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:bg-[#161615] dark:shadow-[0_2px_10px_rgba(255,255,255,0.08)]">
                            <Avatar className="mb-4 h-20 w-20">
                                <AvatarImage src={lead.avatar} alt={lead.name} />
                                <AvatarFallback className="rounded-full bg-neutral-200 text-lg font-medium text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(lead.name)}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="mb-1 text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">{lead.name}</h2>
                            <p className="mb-1 text-sm text-muted-foreground">{lead.email}</p>
                            <span className="text-xs font-medium tracking-wide text-[#6b7280] uppercase dark:text-[#9ca3af]">{lead.role}</span>
                        </div>
                    </div>

                    {/* Other members grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {others.map((user, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:bg-[#161615] dark:shadow-[0_2px_10px_rgba(255,255,255,0.08)]"
                            >
                                <Avatar className="mb-4 h-16 w-16">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-full bg-neutral-200 text-lg font-medium text-black dark:bg-neutral-700 dark:text-white">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="mb-1 text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">{user.name}</h2>
                                <p className="mb-1 text-sm text-muted-foreground">{user.email}</p>
                                <span className="text-xs font-medium tracking-wide text-[#6b7280] uppercase dark:text-[#9ca3af]">{user.role}</span>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
