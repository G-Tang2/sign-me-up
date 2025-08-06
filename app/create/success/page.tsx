import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-4xl font-bold mb-4">Event Created Successfully!</h1>
      <p className="text-lg mb-6">
        Your event has been created. You can now share the link with your friends.
      </p>
      <Link href="/event" className="text-blue-500 hover:underline">
        View My Events
      </Link>
    </div>
  );
}