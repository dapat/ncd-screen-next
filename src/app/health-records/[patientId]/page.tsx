import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default async function PatientHealthHistory({
  params,
}: {
  params: { patientId: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  const patientId = parseInt(params.patientId);
  
  // Fetch patient details and health records
  const [patientResponse, recordsResponse] = await Promise.all([
    supabase
      .from('patients')
      .select('first_name, last_name')
      .eq('id', patientId)
      .single(),
    supabase
      .from('health_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('recorded_at', { ascending: true })
  ]);

  const patient = patientResponse.data;
  const records = recordsResponse.data || [];

  // Format data for charts
  const chartData = records.map(record => ({
    date: new Date(record.recorded_at).toLocaleDateString(),
    glucose: record.blood_glucose,
    systolic: record.blood_pressure_systolic,
    diastolic: record.blood_pressure_diastolic,
    weight: record.weight,
  }));

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Health History: {patient?.first_name} {patient?.last_name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View historical health data and trends
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href={`/health-records/new?patient_id=${patientId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add New Record
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Blood Glucose Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Glucose History</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="glucose" stroke="#8884d8" name="Blood Glucose (mg/dL)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Pressure Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Pressure History</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="systolic" stroke="#82ca9d" name="Systolic (mmHg)" />
                <Line type="monotone" dataKey="diastolic" stroke="#ffc658" name="Diastolic (mmHg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weight History</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#ff7300" name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Records History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Blood Glucose</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Blood Pressure</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(record.recorded_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {record.blood_glucose} mg/dL
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {record.blood_pressure_systolic}/{record.blood_pressure_diastolic} mmHg
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {record.weight} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
