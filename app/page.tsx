import Button from "./components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold">Simple Event Planning Made Easy</h1>
      <p className="mt-4 text-lg">
        Create events in seconds and send a unique link to invite friends. No
        apps, no fuss — just simple, seamless planning from any device.
      </p>
      <Link href="/create">
        <Button text="Create An Event" />
      </Link>
    </main>
  );
}
