"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setImageUrl(data.imageUrl || "");
      } else {
        alert("Product not found!");
        router.push("/admin/dashboard/products");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let updatedImageUrl = imageUrl;

    if (newImage) {
      const imageRef = ref(storage, `products/${Date.now()}-${newImage.name}`);
      await uploadBytes(imageRef, newImage);
      updatedImageUrl = await getDownloadURL(imageRef);
    }

    try {
      await updateDoc(doc(db, "products", id as string), {
        name,
        price,
        description,
        imageUrl: updatedImageUrl,
      });
      router.push("/admin/dashboard/products");
    } catch (error: any) {
      alert("Failed to update product: " + error.message);
    }

    setLoading(false);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-yellow-700">Edit Product</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full p-3 border rounded"
          required
        />

        {imageUrl && (
          <div className="mb-2">
            <img src={imageUrl} alt="Current" className="w-40 rounded shadow" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files?.[0] || null)}
          className="w-full"
        />

        <button
          type="submit"
          className="bg-yellow-600 text-white px-6 py-3 rounded hover:bg-yellow-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
