"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';

const healthRecordSchema = z.object({
  patient_id: z.number(),
  blood_glucose: z.number().min(0).max(999),
  blood_pressure_systolic: z.number().min(70).max(250),
  blood_pressure_diastolic: z.number().min(40).max(150),
  weight: z.number().optional(),
  notes: z.string().optional(),
});

type HealthRecordFormData = z.infer<typeof healthRecordSchema>;

interface HealthRecordFormProps {
  patientId: number;
  onSuccess?: () => void;
}

export default function HealthRecordForm({ patientId, onSuccess }: HealthRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<HealthRecordFormData>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      patient_id: patientId,
    },
  });

  const onSubmit = async (data: HealthRecordFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('health_records')
        .insert([{
          ...data,
          recorded_at: new Date().toISOString(),
        }]);

      if (error) throw error;
      
      reset();
      onSuccess?.();
      
      // Trigger risk assessment calculation
      await calculateRiskAssessment(patientId);
    } catch (error) {
      console.error('Error adding health record:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateRiskAssessment = async (patientId: number) => {
    try {
      // Fetch recent health records
      const { data: records } = await supabase
        .from('health_records')
        .select('*')
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false })
        .limit(5);

      if (!records?.length) return;

      // Calculate risk score based on latest readings
      const latestRecord = records[0];
      let riskScore = 0;
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

      // Blood glucose risk assessment
      if (latestRecord.blood_glucose > 200) {
        riskScore += 3;
      } else if (latestRecord.blood_glucose > 140) {
        riskScore += 2;
      } else if (latestRecord.blood_glucose < 70) {
        riskScore += 3;
      }

      // Blood pressure risk assessment
      if (latestRecord.blood_pressure_systolic > 140 || latestRecord.blood_pressure_diastolic > 90) {
        riskScore += 2;
      }

      // Determine risk level
      if (riskScore >= 4) {
        riskLevel = 'HIGH';
      } else if (riskScore >= 2) {
        riskLevel = 'MEDIUM';
      }

      // Calculate next assessment date (30 days for high risk, 60 for medium, 90 for low)
      const daysUntilNext = riskLevel === 'HIGH' ? 30 : riskLevel === 'MEDIUM' ? 60 : 90;
      const nextAssessmentDate = new Date();
      nextAssessmentDate.setDate(nextAssessmentDate.getDate() + daysUntilNext);

      // Update risk assessment
      await supabase
        .from('risk_assessments')
        .insert([{
          patient_id: patientId,
          risk_level: riskLevel,
          calculated_score: riskScore,
          next_assessment_date: nextAssessmentDate.toISOString(),
        }]);
    } catch (error) {
      console.error('Error calculating risk assessment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Blood Glucose (mg/dL)
        </label>
        <input
          type="number"
          step="0.1"
          {...register('blood_glucose', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.blood_glucose && (
          <p className="mt-1 text-sm text-red-600">{errors.blood_glucose.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Blood Pressure (Systolic)
        </label>
        <input
          type="number"
          {...register('blood_pressure_systolic', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.blood_pressure_systolic && (
          <p className="mt-1 text-sm text-red-600">{errors.blood_pressure_systolic.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Blood Pressure (Diastolic)
        </label>
        <input
          type="number"
          {...register('blood_pressure_diastolic', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.blood_pressure_diastolic && (
          <p className="mt-1 text-sm text-red-600">{errors.blood_pressure_diastolic.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Weight (kg)
        </label>
        <input
          type="number"
          step="0.1"
          {...register('weight', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          {...register('notes')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Record Health Data'}
      </button>
    </form>
  );
}
