"use client"; // Must be at the very top of the file

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Link from "next/link"; // Keep Link for navigation, though not used in direct product links here now

interface Product {
  id?: string; // id is optional as it's not present when creating a new product
  name: string;
  description: string;
  specs: string;
  price: number;
  images: string[];
}

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false); // For form submission/loading
  const [listLoading, setListLoading] = useState(true); // For initial product list loading
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    specs: "",
    price: 0,
    images: [],
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]); // New files to upload

  // Load products
  const loadProducts = async () => {
    setListLoading(true); // Set loading true before fetching
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const prods: Product[] = [];
      querySnapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...(doc.data() as Product) });
      });
      setProducts(prods);
    } catch (error) {
      console.error("Error loading products:", error);
      // Handle error display if needed
    } finally {
      setListLoading(false); // Set loading false after fetching (success or error)
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle input change for text/textarea fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle price input separately (number)
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, price: Number(e.target.value) }));
  };

  // Handle image file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  // Upload images to Firebase Storage
  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    if (imageFiles.length === 0) return urls; // No new images to upload

    for (const file of imageFiles) {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Image upload error:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            urls.push(downloadURL);
            resolve();
          }
        );
      });
    }
    setUploadProgress(0); // Reset progress after all uploads
    return urls;
  };

  // Add or update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = form.images; // Start with existing images

      // If new images selected, upload them and add to the list
      if (imageFiles.length > 0) {
        const uploadedUrls = await uploadImages();
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      const productData = { ...form, images: imageUrls };

      if (editId) {
        // Update existing product
        const productRef = doc(db, "products", editId);
        await updateDoc(productRef, productData);
      } else {
        // Add new product
        await addDoc(collection(db, "products"), productData);
      }

      // Reset form and state
      setForm({
        name: "",
        description: "",
        specs: "",
        price: 0,
        images: [],
      });
      setImageFiles([]);
      setEditId(null);
      await loadProducts(); // Reload products to show the changes
    } catch (err) {
      alert("Failed to save product: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Edit a product: populate form with product data
  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      specs: product.specs,
      price: product.price,
      images: product.images || [], // Ensure images is an array
    });
    setEditId(product.id || null);
    setImageFiles([]); // Clear any previously selected new files when editing
    setUploadProgress(0); // Reset upload progress
  };

  // Delete a product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      await loadProducts(); // Refresh list after deletion
    } catch (error) {
      alert("Failed to delete product: " + (error as Error).message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        Manage Products
      </h1>

      {/* Product Form - Combined Add/Edit */}
      <form onSubmit={handleSubmit} className="bg-yellow-50 p-6 rounded-xl shadow mb-8">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>
        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="name">
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded border border-yellow-300 focus:outline-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full p-3 rounded border border-yellow-300 focus:outline-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="specs">
            Specifications
          </label>
          <textarea
            id="specs"
            name="specs"
            value={form.specs}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded border border-yellow-300 focus:outline-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1" htmlFor="price">
            Price (₹)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            value={form.price}
            onChange={handlePriceChange}
            required
            min={0}
            className="w-full p-3 rounded border border-yellow-300 focus:outline-yellow-500"
          />
        </div>

        {/* Display existing images when editing */}
        {editId && form.images && form.images.length > 0 && (
          <div className="mb-4">
            <label className="block font-semibold mb-1">Current Images:</label>
            <div className="flex flex-wrap gap-2">
              {form.images.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-md border border-yellow-200"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              (Uploading new images will add to these, not replace them unless you manually manage deletion from Firebase Storage.)
            </p>
          </div>
        )}

        <div className="mb-6">
          <label className="block font-semibold mb-1" htmlFor="images">
            Upload New Images
          </label>
          <input
            id="images"
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            className="block"
          />
          {uploadProgress > 0 && (
            <p className="mt-2 text-yellow-700">
              Upload Progress: {uploadProgress.toFixed(0)}%
            </p>
          )}
          {imageFiles.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              ({imageFiles.length} new files selected. These will be added.)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-600 text-white py-3 px-6 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (editId ? "Updating..." : "Adding...") : (editId ? "Update Product" : "Add Product")}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ name: "", description: "", specs: "", price: 0, images: [] });
              setImageFiles([]);
              setUploadProgress(0); // Reset progress on cancel
            }}
            className="ml-4 py-3 px-6 rounded-lg border border-yellow-600 text-yellow-600 hover:bg-yellow-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading} // Disable cancel button during submission
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Products List */}
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">Current Products</h2>
      {listLoading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products added yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-yellow-300 rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-yellow-100 text-yellow-700">
              <th className="border border-yellow-300 px-4 py-2 text-left">Product Name</th>
              <th className="border border-yellow-300 px-4 py-2 text-left">Price (₹)</th>
              <th className="border border-yellow-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-yellow-50 even:bg-yellow-50/50">
                <td className="border border-yellow-300 px-4 py-2">{product.name}</td>
                <td className="border border-yellow-300 px-4 py-2">₹{product.price}</td>
                <td className="border border-yellow-300 px-4 py-2 text-center space-x-4">
                  <button
                    className="text-yellow-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleEdit(product)}
                    disabled={loading} // Disable edit button during form submission
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => product.id && handleDelete(product.id)}
                    disabled={loading} // Disable delete button during form submission
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}