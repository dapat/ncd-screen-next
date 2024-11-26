"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import debounce from 'lodash/debounce';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
}

export default function PatientSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const searchPatients = debounce(async (term: string) => {
    if (!term.trim()) {
      setPatients([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name')
        .or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%,id.eq.${isNaN(parseInt(term)) ? -1 : term}`)
        .limit(5);

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error searching patients:', error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchPatients(term);
  };

  const selectPatient = (patientId: number) => {
    router.push(`/health-records/new?patient_id=${patientId}`);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search patient by name or ID..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {patients.length > 0 && (
        <div className="absolute mt-1 w-full max-w-xl bg-white rounded-md shadow-lg z-10">
          <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {patients.map((patient) => (
              <li
                key={patient.id}
                onClick={() => selectPatient(patient.id)}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
              >
                <div className="flex items-center">
                  <span className="font-normal truncate">
                    {patient.first_name} {patient.last_name}
                  </span>
                  <span className="ml-2 truncate text-gray-500">
                    ID: {patient.id}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
