import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import HealthRecordForm from '@/components/HealthRecordForm';
import PatientSearch from '@/components/PatientSearch';

export default async function NewHealthRecord({
  searchParams,
}: {
  searchParams: { patient_id?: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  
  // If no patient_id is provided, show patient search
  if (!searchParams.patient_id) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              New Health Record
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search for a patient to add a new health record
            </p>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <PatientSearch />
          </div>
        </div>
      </div>
    );
  }

  const patientId = parseInt(searchParams.patient_id);
  
  // Fetch patient details
  const { data: patient } = await supabase
    .from('patients')
    .select('first_name, last_name')
    .eq('id', patientId)
    .single();

  if (!patient) {
    redirect('/health-records/new');
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            New Health Record
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Patient: {patient.first_name} {patient.last_name}
          </p>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <HealthRecordForm 
            patientId={patientId}
            onSuccess={() => redirect('/health-records')}
          />
        </div>
      </div>
    </div>
  );
}
