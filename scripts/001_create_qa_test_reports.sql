-- Create qa_test_reports table
CREATE TABLE IF NOT EXISTS qa_test_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tester_name VARCHAR(255) NOT NULL,
    test_date DATE NOT NULL,
    application_version VARCHAR(100) NOT NULL,
    test_environment VARCHAR(100) NOT NULL,
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

-- Create an index on tester_name for faster queries
CREATE INDEX IF NOT EXISTS idx_qa_test_reports_tester_name ON qa_test_reports(tester_name);

-- Create an index on test_date for faster queries
CREATE INDEX IF NOT EXISTS idx_qa_test_reports_test_date ON qa_test_reports(test_date);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_qa_test_reports_created_at ON qa_test_reports(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE qa_test_reports ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on qa_test_reports" ON qa_test_reports
    FOR ALL USING (true);
