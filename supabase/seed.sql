-- Seed data for qa_test_reports table
-- This file will be executed after all migrations are applied

INSERT INTO qa_test_reports (
    tester_name,
    test_date,
    application_version,
    auth_tests,
    main_section_tests,
    side_mission_tests,
    leaderboard,
    toko,
    komunitas,
    hasil_user,
    sertifikat,
    user_profile
) VALUES 
(
    'John Doe',
    '2024-01-15',
    'v1.2.0',
    '{
        "login": {"status": "passed", "notes": "Login functionality works correctly"},
        "register": {"status": "passed", "notes": "Registration process completed successfully"},
        "logout": {"status": "passed", "notes": "Logout clears session properly"},
        "password_reset": {"status": "passed", "notes": "Password reset email sent successfully"}
    }',
    '{
        "navigation": {"status": "passed", "notes": "All navigation links work properly"},
        "content_loading": {"status": "passed", "notes": "Content loads without issues"},
        "responsive_design": {"status": "passed", "notes": "Design responsive on all devices"},
        "performance": {"status": "passed", "notes": "Page load times are acceptable"}
    }',
    '{
        "mission_creation": {"status": "passed", "notes": "Users can create new missions"},
        "mission_completion": {"status": "passed", "notes": "Mission completion tracking works"},
        "progress_saving": {"status": "passed", "notes": "Progress is saved correctly"}
    }',
    '{"status": "passed", "notes": "Leaderboard displays correctly", "type": "global"}',
    '{"status": "passed", "notes": "Toko section functions properly"}',
    '{"status": "passed", "notes": "Komunitas features work as expected"}',
    '{"status": "passed", "notes": "User results are displayed correctly"}',
    '{"status": "passed", "notes": "Certificate generation works properly"}',
    '{"status": "passed", "notes": "User profile management functions correctly"}'
),
(
    'Jane Smith',
    '2024-01-16',
    'v1.2.1',
    '{
        "login": {"status": "passed", "notes": "Login works with new credentials"},
        "register": {"status": "failed", "notes": "Email validation issue on registration"},
        "logout": {"status": "passed", "notes": "Logout functionality works"},
        "password_reset": {"status": "passed", "notes": "Password reset process completed"}
    }',
    '{
        "navigation": {"status": "passed", "notes": "Navigation menu responsive"},
        "content_loading": {"status": "passed", "notes": "Content loads efficiently"},
        "responsive_design": {"status": "passed", "notes": "Mobile layout works well"},
        "performance": {"status": "passed", "notes": "Good performance metrics"}
    }',
    '{
        "mission_creation": {"status": "passed", "notes": "Mission creation interface intuitive"},
        "mission_completion": {"status": "passed", "notes": "Completion tracking accurate"},
        "progress_saving": {"status": "passed", "notes": "Auto-save feature works"}
    }',
    '{"status": "passed", "notes": "Leaderboard updates in real-time", "type": "weekly"}',
    '{"status": "passed", "notes": "Toko transactions processed correctly"}',
    '{"status": "passed", "notes": "Community features accessible"}',
    '{"status": "passed", "notes": "Results calculation accurate"}',
    '{"status": "passed", "notes": "Certificate download works"}',
    '{"status": "passed", "notes": "Profile editing functions properly"}'
),
(
    'Mike Johnson',
    '2024-01-17',
    'v1.2.2',
    '{
        "login": {"status": "passed", "notes": "SSO integration working"},
        "register": {"status": "passed", "notes": "Social login options available"},
        "logout": {"status": "passed", "notes": "Session cleanup successful"},
        "password_reset": {"status": "passed", "notes": "Reset flow completed"}
    }',
    '{
        "navigation": {"status": "passed", "notes": "Breadcrumb navigation helpful"},
        "content_loading": {"status": "passed", "notes": "Lazy loading implemented"},
        "responsive_design": {"status": "passed", "notes": "Tablet layout optimized"},
        "performance": {"status": "passed", "notes": "Caching improves performance"}
    }',
    '{
        "mission_creation": {"status": "passed", "notes": "Mission templates available"},
        "mission_completion": {"status": "passed", "notes": "Achievement system works"},
        "progress_saving": {"status": "passed", "notes": "Cloud sync functional"}
    }',
    '{"status": "passed", "notes": "Leaderboard filters working", "type": "monthly"}',
    '{"status": "passed", "notes": "Toko inventory management good"}',
    '{"status": "passed", "notes": "Community moderation tools effective"}',
    '{"status": "passed", "notes": "Analytics dashboard functional"}',
    '{"status": "passed", "notes": "Certificate verification works"}',
    '{"status": "passed", "notes": "Profile privacy settings working"}'
); 