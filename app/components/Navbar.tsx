import Link from "next/link";

export default function Navbar() {
    return (
        <header>
            <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
                <Link href="/" className="text-xl font-bold">
                    Sign me up!
                </Link>
            </ nav>
        </header>
    );
}