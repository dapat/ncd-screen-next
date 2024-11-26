"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const screeningSchema = z.object({
  screen_type: z.string()
    .min(1, 'Screening type is required'),
  result: z.number()
    .min(0, 'Result must be positive')
    .max(999.99, 'Result too high'),
  result_status: z.string()
    .min(1, 'Result status is required'),
});

type ScreeningFormData = z.infer<typeof screeningSchema>;

interface ScreeningFormProps {
  patientId: number;
  onSuccess?: () => void;
}

export default function ScreeningForm({ patientId, onSuccess }: ScreeningFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ScreeningFormData>({
    resolver: zodResolver(screeningSchema),
  });

  const onSubmit = async (data: ScreeningFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('screening_history')
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

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="screen_type" className="block text-sm font-medium text-gray-700">
            Screening Type
          </label>
          <select
            {...register('screen_type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select screening type</option>
            <option value="Blood Glucose Test">Blood Glucose Test</option>
            <option value="Blood Pressure Check">Blood Pressure Check</option>
            <option value="HbA1c Test">HbA1c Test</option>
            <option value="Lipid Panel">Lipid Panel</option>
            <option value="Kidney Function Test">Kidney Function Test</option>
          </select>
          {errors.screen_type && (
            <p className="mt-1 text-sm text-red-600">{errors.screen_type.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="result" className="block text-sm font-medium text-gray-700">
            Result
          </label>
          <input
            type="number"
            step="0.01"
            {...register('result', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.result && (
            <p className="mt-1 text-sm text-red-600">{errors.result.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="result_status" className="block text-sm font-medium text-gray-700">
            Result Status
          </label>
          <select
            {...register('result_status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select status</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
            <option value="Critical">Critical</option>
          </select>
          {errors.result_status && (
            <p className="mt-1 text-sm text-red-600">{errors.result_status.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Screening'}
        </button>
      </div>
    </form>
  );
}
