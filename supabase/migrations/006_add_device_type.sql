-- Migration: Add device_type field to qa_test_reports table
-- This migration adds a device_type field to track whether tests were performed on iOS or Android

-- Add device_type column to qa_test_reports table
ALTER TABLE qa_test_reports 
ADD COLUMN device_type VARCHAR(10) NOT NULL DEFAULT 'ios' CHECK (device_type IN ('ios', 'android'));

-- Add comment to the new column
COMMENT ON COLUMN qa_test_reports.device_type IS 'Device type used for testing: ios or android';

-- Create index for better query performance on device_type
CREATE INDEX IF NOT EXISTS idx_qa_test_reports_device_type ON qa_test_reports(device_type);

-- Update the qa_test_summary view to include device_type
DROP VIEW IF EXISTS qa_test_summary;

CREATE OR REPLACE VIEW qa_test_summary AS
SELECT 
    id,
    tester_name,
    device_type,
    test_date,
    application_version,
    created_at,
    -- Count passed tests in each section
    (SELECT COUNT(*) FROM jsonb_each(auth_tests) WHERE value->>'status' = 'passed') as auth_passed,
    (SELECT COUNT(*) FROM jsonb_each(auth_tests) WHERE value->>'status' = 'failed') as auth_failed,
    (SELECT COUNT(*) FROM jsonb_each(main_section_tests) WHERE value->>'status' = 'passed') as main_passed,
    (SELECT COUNT(*) FROM jsonb_each(main_section_tests) WHERE value->>'status' = 'failed') as main_failed,
    (SELECT COUNT(*) FROM jsonb_each(side_mission_tests) WHERE value->>'status' = 'passed') as side_passed,
    (SELECT COUNT(*) FROM jsonb_each(side_mission_tests) WHERE value->>'status' = 'failed') as side_failed,
    (CASE WHEN food_print_tests->>'status' = 'pass' THEN 1 ELSE 0 END) as food_print_passed,
    (CASE WHEN food_print_tests->>'status' = 'fail' THEN 1 ELSE 0 END) as food_print_failed,
    (SELECT COUNT(*) FROM jsonb_each(referral_tests) WHERE value->>'status' = 'pass') as referral_passed,
    (SELECT COUNT(*) FROM jsonb_each(referral_tests) WHERE value->>'status' = 'fail') as referral_failed
FROM qa_test_reports;

-- Add a comment to the updated view
COMMENT ON VIEW qa_test_summary IS 'Summary view of QA test results with pass/fail counts including device type, FoodPrint and Referral tests';
