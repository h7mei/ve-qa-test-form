-- Migration: Add food_print_tests field to qa_test_reports table
-- This migration adds a dedicated field for FoodPrint test results

-- Add food_print_tests column to qa_test_reports table
ALTER TABLE qa_test_reports 
ADD COLUMN food_print_tests JSONB NOT NULL DEFAULT '{"status": "not-tested", "notes": ""}';

-- Add comment to the new column
COMMENT ON COLUMN qa_test_reports.food_print_tests IS 'JSON object containing FoodPrint test result';

-- Update the qa_test_summary view to include food_print_tests
DROP VIEW IF EXISTS qa_test_summary;

CREATE OR REPLACE VIEW qa_test_summary AS
SELECT 
    id,
    tester_name,
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
    (CASE WHEN food_print_tests->>'status' = 'fail' THEN 1 ELSE 0 END) as food_print_failed
FROM qa_test_reports;

-- Add a comment to the updated view
COMMENT ON VIEW qa_test_summary IS 'Summary view of QA test results with pass/fail counts including FoodPrint tests'; 