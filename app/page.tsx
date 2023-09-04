import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="mb-8 text-2xl font-bold">Home</h1>
      <div className="flex space-x-4">
        <Link href="/create" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">

          Create

        </Link>
        <Link href="/join" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">

          Join

        </Link>
      </div>
    </div>
  );
}