export default function Home() {
  return (
    <main className="flex-1">
      <section className="bg-gradient-to-r from-[#dc143c] to-[#6B5B95] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Godly Women</h1>
          <p className="text-xl opacity-90">
            A community platform for faith, inspiration, and spiritual growth
          </p>
        </div>
      </section>

      <section className="container-custom py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#dc143c] mb-2">Articles</h2>
            <p className="text-gray-600">
              Read inspiring articles from our community
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#dc143c] mb-2">Marketplace</h2>
            <p className="text-gray-600">
              Discover and share resources
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#dc143c] mb-2">Prayers</h2>
            <p className="text-gray-600">
              Join our community in prayer
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
