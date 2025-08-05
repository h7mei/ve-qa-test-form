-- Migration: Create qa_test_reports table
-- This migration creates the main table for storing QA test reports

-- Create qa_test_reports table
CREATE TABLE IF NOT EXISTS qa_test_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tester_name VARCHAR(255) NOT NULL,
    test_date DATE NOT NULL,
    application_version VARCHAR(100) NOT NULL,
    auth_tests JSONB NOT NULL DEFAULT '{}',
    main_section_tests JSONB NOT NULL DEFAULT '{}',
    side_mission_tests JSONB NOT NULL DEFAULT '{}',
    leaderboard JSONB NOT NULL DEFAULT '{}',
    toko JSONB NOT NULL DEFAULT '{}',
    komunitas JSONB NOT NULL DEFAULT '{}',
    hasil_user JSONB NOT NULL DEFAULT '{}',
    sertifikat JSONB NOT NULL DEFAULT '{}',
    user_profile JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_qa_test_reports_tester_name ON qa_test_reports(tester_name);
CREATE INDEX IF NOT EXISTS idx_qa_test_reports_test_date ON qa_test_reports(test_date);
CREATE INDEX IF NOT EXISTS idx_qa_test_reports_created_at ON qa_test_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_qa_test_reports_application_version ON qa_test_reports(application_version);

-- Enable Row Level Security (RLS)
ALTER TABLE qa_test_reports ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on qa_test_reports" ON qa_test_reports
    FOR ALL USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_qa_test_reports_updated_at 
    BEFORE UPDATE ON qa_test_reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
