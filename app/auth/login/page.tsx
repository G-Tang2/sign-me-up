// app/login/page.tsx
'use client';

import { supabase } from '@/app/lib/supabase';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) alert(error.message);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>Login</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-white text-grey px-4 py-2 rounded shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center"
      >
        Login with Google 
        <img src="/google.svg" alt="Google Icon" className="inline-block ml-2 w-5 h-5" />
      </button>
    </div>
  );
}
