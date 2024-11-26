import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ScreeningForm from '@/components/ScreeningForm';

export default async function NewScreeningPage({
  searchParams,
}: {
  searchParams: { patient_id?: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  const patientId = searchParams.patient_id;

  if (!patientId) {
    notFound();
  }

  const { data: patient } = await supabase
    .from('patients')
    .select('first_name, last_name')
    .eq('id', patientId)
    .single();

  if (!patient) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          New Screening Record for {patient.first_name} {patient.last_name}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Record new screening results for this patient.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ScreeningForm patientId={parseInt(patientId)} />
        </div>
      </div>
    </div>
  );
}
