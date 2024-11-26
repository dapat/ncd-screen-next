"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const diabetesMetricsSchema = z.object({
  blood_glucose_level: z.number()
    .min(0, 'Blood glucose must be positive')
    .max(999.99, 'Blood glucose too high'),
  blood_pressure_systolic: z.number()
    .min(70, 'Systolic pressure too low')
    .max(250, 'Systolic pressure too high'),
  blood_pressure_diastolic: z.number()
    .min(40, 'Diastolic pressure too low')
    .max(150, 'Diastolic pressure too high'),
  bmi: z.number()
    .min(10, 'BMI too low')
    .max(99.99, 'BMI too high')
    .optional(),
  screen_location: z.string()
    .min(1, 'Screen location is required'),
  record_by: z.string()
    .min(1, 'Record by is required'),
});

type DiabetesMetricsFormData = z.infer<typeof diabetesMetricsSchema>;

interface DiabetesMetricsFormProps {
  patientId: number;
  onSuccess?: () => void;
}

export default function DiabetesMetricsForm({ patientId, onSuccess }: DiabetesMetricsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DiabetesMetricsFormData>({
    resolver: zodResolver(diabetesMetricsSchema),
  });

  const onSubmit = async (data: DiabetesMetricsFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('diabetes_metrics')
        .insert([
          {
            patient_id: patientId,
            ...data,
          },
        ]);

      if (supabaseError) throw supabaseError;

      reset();
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="blood_glucose_level" className="block text-sm font-medium text-gray-700">
            Blood Glucose Level (mg/dL)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('blood_glucose_level', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.blood_glucose_level && (
            <p className="mt-1 text-sm text-red-600">{errors.blood_glucose_level.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="blood_pressure_systolic" className="block text-sm font-medium text-gray-700">
            Blood Pressure (Systolic)
          </label>
          <input
            type="number"
            {...register('blood_pressure_systolic', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.blood_pressure_systolic && (
            <p className="mt-1 text-sm text-red-600">{errors.blood_pressure_systolic.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="blood_pressure_diastolic" className="block text-sm font-medium text-gray-700">
            Blood Pressure (Diastolic)
          </label>
          <input
            type="number"
            {...register('blood_pressure_diastolic', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.blood_pressure_diastolic && (
            <p className="mt-1 text-sm text-red-600">{errors.blood_pressure_diastolic.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bmi" className="block text-sm font-medium text-gray-700">
            BMI (optional)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('bmi', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.bmi && (
            <p className="mt-1 text-sm text-red-600">{errors.bmi.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="screen_location" className="block text-sm font-medium text-gray-700">
            Screen Location
          </label>
          <select
            {...register('screen_location')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select location</option>
            <option value="At Home">At Home</option>
            <option value="Clinic">Clinic</option>
            <option value="Hospital">Hospital</option>
            <option value="Mobile Unit">Mobile Unit</option>
          </select>
          {errors.screen_location && (
            <p className="mt-1 text-sm text-red-600">{errors.screen_location.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="record_by" className="block text-sm font-medium text-gray-700">
            Recorded By
          </label>
          <input
            type="text"
            {...register('record_by')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.record_by && (
            <p className="mt-1 text-sm text-red-600">{errors.record_by.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Metrics'}
        </button>
      </div>
    </form>
  );
}
