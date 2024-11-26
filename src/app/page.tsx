import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Patient Information Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
            <p className="mt-1 text-sm text-gray-500">Manage patient records and details</p>
            <div className="mt-4">
              <Link 
                href="/patients"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                View Patients
              </Link>
            </div>
          </div>
        </div>

        {/* Health Records Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Health Records</h3>
            <p className="mt-1 text-sm text-gray-500">Record and track health metrics</p>
            <div className="mt-4">
              <Link 
                href="/health-records"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Record Health Data
              </Link>
            </div>
          </div>
        </div>

        {/* Risk Assessment Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Risk Assessment</h3>
            <p className="mt-1 text-sm text-gray-500">View automated risk calculations</p>
            <div className="mt-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700">
                View Risk Profile
              </button>
            </div>
          </div>
        </div>

        {/* Data Export Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Data Export</h3>
            <p className="mt-1 text-sm text-gray-500">Export data for HDC system</p>
            <div className="mt-4">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
