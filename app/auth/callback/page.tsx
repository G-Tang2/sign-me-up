"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import Spinner from "@/app/components/ui/Spinner"; // Optional: add spinner

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const insertNewUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("No user found after authentication");
        return;
      }

      console.log("User authenticated:", user.id, user.user_metadata.full_name);

      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
        if (fetchError) {
        console.error("Error fetching user:", fetchError.message);
        return;}

      if (!existingUser) {
        await supabase.from("users").insert({
          id: user.id,
          name: user.user_metadata.full_name || "user",
        });
      }
      router.push("/create");
    };
    insertNewUser();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <p className="text-xl font-medium text-gray-700 mb-4">
          Signing you in...
        </p>
        <Spinner />
      </div>
    </div>
  );
}
