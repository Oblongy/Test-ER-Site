import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-4xl font-bold">Modern Chat Room</h1>

      <Link href="/login" className="rounded-md bg-neutral-900 px-6 py-3 text-white transition hover:bg-neutral-700">
        Get started
      </Link>
    </main>
  )
}
