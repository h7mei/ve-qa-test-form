-- Drop existing table if it exists (for clean migration)
DROP TABLE IF EXISTS internal_testing_cases;

-- Create internal_testing_cases table with new structure
CREATE TABLE internal_testing_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    test_name TEXT NOT NULL,
    sections JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create storage bucket for testing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('testing-images', 'testing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS (Row Level Security) for internal_testing_cases table
ALTER TABLE internal_testing_cases ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access
CREATE POLICY "Allow public read access"
ON internal_testing_cases
FOR SELECT
TO public
USING (true);

-- Policy to allow public insert access
CREATE POLICY "Allow public insert access"
ON internal_testing_cases
FOR INSERT
TO public
WITH CHECK (true);

-- Policy to allow public update access
CREATE POLICY "Allow public update access"
ON internal_testing_cases
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Set up storage policies for testing-images bucket
CREATE POLICY "Allow public uploads to testing-images bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'testing-images');

CREATE POLICY "Allow public read access to testing-images bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'testing-images');

CREATE POLICY "Allow public delete access to testing-images bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'testing-images');

-- Create index on created_at for better query performance
CREATE INDEX idx_internal_testing_cases_created_at ON internal_testing_cases(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_internal_testing_cases_updated_at
    BEFORE UPDATE ON internal_testing_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();