// src/app/page.tsx
import Image from "next/image"; // Keep this import, even if not directly used for images in this snippet

export default function Home() {
  return (
    <main className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-yellow-100 py-16 px-4 sm:py-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-yellow-700 leading-tight">
          Welcome to Basha Home Appliances
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-4">
          Trusted for over <strong>25 years</strong> in delivering quality home
          appliances with a commitment to excellence.
        </p>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 sm:py-16 md:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-yellow-700 mb-8 text-center">
          Explore Our Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            { name: "Refrigerators", icon: "🧊" },
            { name: "Air Conditioners", icon: "❄️" },
            { name: "Washing Machines", icon: "🌀" },
            { name: "Microwaves", icon: "🍽️" },
            { name: "Water Purifiers", icon: "💧" },
            { name: "Kitchen Appliances", icon: "🍳" },
          ].map((cat) => (
            <div
              key={cat.name}
              className="bg-yellow-50 border border-yellow-100 shadow-md rounded-2xl p-5 text-center flex flex-col items-center justify-center hover:shadow-lg transition transform hover:scale-105 duration-300"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-lg sm:text-xl font-medium text-yellow-800">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-yellow-50 py-12 px-4 sm:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-800 mb-4">
          Why Choose Us?
        </h2>
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-700 px-4">
          With over 25 years of technical experience, we bring you the best in
          quality, pricing, and support. Our dedicated team ensures every
          product delivers performance and durability for your home.
        </p>
      </section>

      {/* Call to Action */}
      <section className="py-10 bg-white text-center px-4 sm:py-12">
        <p className="text-base sm:text-lg text-gray-700 mb-4">
          Browse our top products or reach out to our support.
        </p>
        <button className="bg-yellow-600 text-white px-6 py-3 rounded-xl shadow hover:bg-yellow-700 transition transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
          Shop Now
        </button>
      </section>
    </main>
  );
}