-- Create enum types
CREATE TYPE risk_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create patients table
CREATE TABLE patients (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  blood_type TEXT,
  date_of_birth DATE NOT NULL,
  age INTEGER GENERATED ALWAYS AS (
    DATE_PART('year', AGE(CURRENT_DATE, date_of_birth))
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create health_records table
CREATE TABLE health_records (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT REFERENCES patients(id),
  blood_glucose DECIMAL(5,2) NOT NULL, -- mg/dL
  blood_pressure_systolic INTEGER NOT NULL,
  blood_pressure_diastolic INTEGER NOT NULL,
  weight DECIMAL(5,2), -- kg
  recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- Create risk_assessments table
CREATE TABLE risk_assessments (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT REFERENCES patients(id),
  risk_level risk_level NOT NULL,
  assessment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  next_assessment_date TIMESTAMPTZ,
  calculated_score DECIMAL(5,2) NOT NULL
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for patients table
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_patients_name ON patients(last_name, first_name);
CREATE INDEX idx_health_records_patient_recorded ON health_records(patient_id, recorded_at);
CREATE INDEX idx_risk_assessments_patient_date ON risk_assessments(patient_id, assessment_date);
