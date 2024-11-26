# Diabetes Management App (MVP)

A modern web application for diabetes management, focusing on data entry, KPI tracking, and data export capabilities.

## Features

- Patient data management with automated calculations
- KPI dashboards for monitoring health metrics
- Data export functionality for Health Data Center (HDC)
- Automated risk assessment based on health metrics
- Real-time data validation and calculations

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: Shadcn UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Query
- **Form Handling**: React Hook Form
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── lib/                 # Utility functions and configurations
├── types/              # TypeScript type definitions
└── services/           # API and database services
```

## Database Schema

The application uses the following core tables:

- `patients`: Patient demographic and basic information
- `health_records`: Blood glucose, pressure, and other health metrics
- `screenings`: Regular health screening records
- `risk_assessments`: Automated risk calculations