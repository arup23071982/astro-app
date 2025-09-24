export default function SimpleDashboard() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-300">
            Welcome to the admin dashboard for Jai Guru Astro Remedy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Total Users</h3>
            <p className="text-3xl font-bold">156</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Monthly Revenue</h3>
            <p className="text-3xl font-bold">₹48,500</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Consultations</h3>
            <p className="text-3xl font-bold">89</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-400 mb-2">Home Tuitions</h3>
            <p className="text-3xl font-bold">23</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-all">
            <h3 className="text-lg font-semibold mb-2">Client Management</h3>
            <p className="text-sm text-gray-400">Manage user accounts and profiles</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-all">
            <h3 className="text-lg font-semibold mb-2">Consultations</h3>
            <p className="text-sm text-gray-400">View and manage consultations</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-all">
            <h3 className="text-lg font-semibold mb-2">Courses</h3>
            <p className="text-sm text-gray-400">Manage online courses</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700 transition-all">
            <h3 className="text-lg font-semibold mb-2">Products</h3>
            <p className="text-sm text-gray-400">Manage product catalog</p>
          </div>
        </div>
      </div>
    </div>
  );
}