"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/admin");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="mb-6">
  <Link
    href="/admin/dashboard/products"
    className="inline-block bg-yellow-600 text-white px-5 py-3 rounded hover:bg-yellow-700 transition"
  >
    Manage Products
  </Link>
</div>
  );
}
