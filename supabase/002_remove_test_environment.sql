-- Migration: Remove test_environment column from qa_test_reports table
-- Since environment is no longer user-configurable and defaults to a static value

-- First, update any existing records that might have NULL values
UPDATE qa_test_reports 
SET test_environment = 'Default' 
WHERE test_environment IS NULL;

-- Drop the test_environment column
ALTER TABLE qa_test_reports 
DROP COLUMN IF EXISTS test_environment;

-- Remove the index that was created for test_environment if it exists
-- (There wasn't one in the original schema, but this is defensive)
DROP INDEX IF EXISTS idx_qa_test_reports_test_environment; 