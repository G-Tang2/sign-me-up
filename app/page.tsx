"use client";

import { supabase } from "./lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./components/ui/Button";
import Spinner from "./components/ui/Spinner";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setLoading(false);

    if (user) {
      router.push("/create");
    } else {
      router.push("/login");
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Simple Event Planning Made Easy</h1>
      <p className="mt-4 text-lg">
        Create events in seconds and send a unique link to invite friends. No
        apps, no fuss — just simple, seamless planning from any device.
      </p>
      {loading ? (
        <div className="mt-6">
          <Spinner />
        </div>
      ) : (
        <Button text="Get Started" onClick={handleClick} />
      )}
    </main>
  );
}
