import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          blood_type: string | null;
          date_of_birth: string;
          age: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Tables['patients']['Row'], 'id' | 'age' | 'created_at' | 'updated_at'>;
        Update: Partial<Tables['patients']['Insert']>;
      };
      health_records: {
        Row: {
          id: number;
          patient_id: number;
          blood_glucose: number;
          blood_pressure_systolic: number;
          blood_pressure_diastolic: number;
          weight: number;
          recorded_at: string;
          notes: string | null;
        };
        Insert: Omit<Tables['health_records']['Row'], 'id'>;
        Update: Partial<Tables['health_records']['Insert']>;
      };
      risk_assessments: {
        Row: {
          id: number;
          patient_id: number;
          risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
          assessment_date: string;
          next_assessment_date: string;
          calculated_score: number;
        };
        Insert: Omit<Tables['risk_assessments']['Row'], 'id'>;
        Update: Partial<Tables['risk_assessments']['Insert']>;
      };
    };
  };
};
