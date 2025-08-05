-- Migration: Add additional database improvements
-- This migration adds additional features and optimizations

-- Add a comment to the table for documentation
COMMENT ON TABLE qa_test_reports IS 'Stores QA test reports with detailed test results for different application sections';

-- Add comments to important columns
COMMENT ON COLUMN qa_test_reports.tester_name IS 'Name of the QA tester who performed the tests';
COMMENT ON COLUMN qa_test_reports.test_date IS 'Date when the tests were performed';
COMMENT ON COLUMN qa_test_reports.application_version IS 'Version of the application being tested';
COMMENT ON COLUMN qa_test_reports.auth_tests IS 'JSON object containing authentication test results';
COMMENT ON COLUMN qa_test_reports.main_section_tests IS 'JSON object containing main application section test results';
COMMENT ON COLUMN qa_test_reports.side_mission_tests IS 'JSON object containing side mission test results';

-- Create a view for easier querying of test results
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
    (SELECT COUNT(*) FROM jsonb_each(side_mission_tests) WHERE value->>'status' = 'failed') as side_failed
FROM qa_test_reports;

-- Add a comment to the view
COMMENT ON VIEW qa_test_summary IS 'Summary view of QA test results with pass/fail counts';

-- Create a function to get test statistics
CREATE OR REPLACE FUNCTION get_test_statistics()
RETURNS TABLE (
    total_reports BIGINT,
    total_testers BIGINT,
    latest_test_date DATE,
    most_tested_version VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_reports,
        COUNT(DISTINCT tester_name) as total_testers,
        MAX(test_date) as latest_test_date,
        (SELECT application_version 
         FROM qa_test_reports 
         GROUP BY application_version 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as most_tested_version
    FROM qa_test_reports;
END;
$$ LANGUAGE plpgsql;

-- Add a comment to the function
COMMENT ON FUNCTION get_test_statistics() IS 'Returns summary statistics about QA test reports'; 