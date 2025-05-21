// src/components/Footer.tsx
export default function Footer() {
    return (
      <footer className="bg-yellow-50 text-center text-sm py-6 mt-10 border-t border-yellow-100">
        <p className="text-gray-700">
          © {new Date().getFullYear()} Basha Home Appliances. All rights reserved.
        </p>
      </footer>
    );
  }
  