import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import PatientSort from '@/components/PatientSort';

interface Patient {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: { sort?: string; risk?: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  
  // Build the query based on search params
  let query = supabase.from('patients').select('*');
  
  // Apply sorting
  if (searchParams.sort === 'name') {
    query = query.order('last_name').order('first_name');
  } else if (searchParams.sort === 'risk') {
    query = query.order('risk_level');
  } else {
    // Default sort by recent
    query = query.order('created_at', { ascending: false });
  }
  
  // Apply risk filter
  if (searchParams.risk) {
    query = query.eq('risk_level', searchParams.risk.toUpperCase());
  }
  
  const { data: patients, error } = await query;

  if (error) {
    console.error('Error fetching patients:', error);
    return <div>Error loading patients</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all patients including their name, age, risk level, and last update.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/patients/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Add patient
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex space-x-2">
          <Link
            href="/patients"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              !searchParams.risk ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </Link>
          <Link
            href="/patients?risk=high"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              searchParams.risk === 'high' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            High Risk
          </Link>
          <Link
            href="/patients?risk=medium"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              searchParams.risk === 'medium' ? 'bg-yellow-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Medium Risk
          </Link>
          <Link
            href="/patients?risk=low"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              searchParams.risk === 'low' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Low Risk
          </Link>
        </div>
        <div className="mt-4 sm:mt-0">
          <label htmlFor="sort" className="sr-only">Sort by</label>
          <div className="w-48">
            <PatientSort />
          </div>
        </div>
      </div>

      <div className="mt-8 -mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Name
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Age
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Gender
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Risk Level
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Last Update
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {patients?.map((patient) => (
              <tr key={patient.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  <div>
                    <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                    <div className="text-gray-500 text-xs">ID: {patient.id}</div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {patient.age}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${patient.gender === 'M' ? 'bg-blue-100 text-blue-800' : 
                      patient.gender === 'F' ? 'bg-pink-100 text-pink-800' :
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Not Specified'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      patient.risk_level === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : patient.risk_level === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {patient.risk_level}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {formatDistanceToNow(new Date(patient.created_at), { addSuffix: true })}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end space-x-4">
                    <Link
                      href={`/screening/new?patient_id=${patient.id}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Add Screening
                    </Link>
                    <Link
                      href={`/diabetes-metrics/new?patient_id=${patient.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Add Metrics
                    </Link>
                    <Link
                      href={`/health-records/${patient.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View History
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
