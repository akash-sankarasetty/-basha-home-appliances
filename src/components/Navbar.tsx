// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b border-yellow-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-yellow-700">
          Basha Home
        </Link>
        <nav className="space-x-6 text-yellow-700 font-medium">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
