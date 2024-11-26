import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function HealthRecords() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: patients } = await supabase
    .from('patients')
    .select(`
      id,
      first_name,
      last_name,
      health_records (
        id,
        blood_glucose,
        blood_pressure_systolic,
        blood_pressure_diastolic,
        weight,
        recorded_at
      )
    `)
    .order('last_name');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/health-records/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add New Record
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Patient Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Latest Blood Glucose
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Latest Blood Pressure
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Latest Weight
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Last Updated
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {patients?.map((patient) => {
                    const latestRecord = patient.health_records?.[0];
                    return (
                      <tr key={patient.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {patient.first_name} {patient.last_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {latestRecord?.blood_glucose ? `${latestRecord.blood_glucose} mg/dL` : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {latestRecord?.blood_pressure_systolic && latestRecord?.blood_pressure_diastolic
                            ? `${latestRecord.blood_pressure_systolic}/${latestRecord.blood_pressure_diastolic} mmHg`
                            : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {latestRecord?.weight ? `${latestRecord.weight} kg` : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {latestRecord?.recorded_at
                            ? new Date(latestRecord.recorded_at).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            href={`/health-records/${patient.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View History
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
