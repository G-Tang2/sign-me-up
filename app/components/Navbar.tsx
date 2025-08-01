"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { User as UserIcon } from "lucide-react";
import { useUserContext } from "../context/UserContext";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useUserContext();


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header>
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white relative">
        <Link href="/" className="text-xl font-bold">
          Sign me up!
        </Link>
        <div className="relative">
          {user ? (
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 focus:outline-none"
            >
              <UserIcon className="w-6 h-6" />
            </button>
          ) : (
            <Link href="/login" className="text-sm hover:underline mr-6">
              Login
            </Link>
          )}

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
              {user?.user_metadata.name ? (
              <p className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-400">
                <strong>{user?.user_metadata.name}</strong>
              </p>) : (<></>)}
              <Link
                href="/event"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                My Events
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
