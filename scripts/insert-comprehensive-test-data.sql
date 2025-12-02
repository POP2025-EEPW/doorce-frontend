-- ============================================
-- CLEAR ALL DATA
-- ============================================
-- Delete in order to respect foreign key constraints
DELETE FROM catalogs_datasets;
DELETE FROM datasets;
DELETE FROM schemas;
-- Delete catalogs (handle parent-child relationships)
-- First delete leaf catalogs, then parent catalogs
DO
$$
DECLARE
deleted_count INTEGER := 1;
BEGIN
    -- Keep deleting catalogs with children until no more deletions occur
    WHILE
deleted_count > 0 LOOP
DELETE
FROM catalogs
WHERE id NOT IN (SELECT DISTINCT parent_id FROM catalogs WHERE parent_id IS NOT NULL);
GET DIAGNOSTICS deleted_count = ROW_COUNT;
END LOOP;
    -- Delete remaining root catalogs
DELETE
FROM catalogs;
END $$;
-- Delete test users
DELETE
FROM users
WHERE username IN ('testuser', 'admin', 'manager', 'developer', 'supplier');

-- ============================================
-- USERS
-- ============================================
-- Role mapping (check your backend enum): 
-- 0=MetadataManager, 1=AcquisitionAppManager, 2=DataQualityManager, 
-- 3=DataSupplier, 4=DataUser, 5=AccessAppDeveloper, 6=Admin
-- Note: Passwords are stored as plain text (not encrypted)

INSERT INTO users (id, username, password, roles, auth_token)
VALUES
    -- Admin user
    ('550e8400-e29b-41d4-a716-446655440001', 'admin', '{noop}password', ARRAY[6]::smallint[], 'admin-token-001'),
    -- Manager user
    ('550e8400-e29b-41d4-a716-446655440002', 'manager', '{noop}password', ARRAY[0, 2]::smallint[], 'manager-token-002'),
    -- Developer user
    ('550e8400-e29b-41d4-a716-446655440003', 'developer', '{noop}password', ARRAY[5]::smallint[],
     'developer-token-003'),
    -- Regular user
    ('550e8400-e29b-41d4-a716-446655440004', 'testuser', '{noop}password', ARRAY[4]::smallint[], 'testuser-token-004'),
    -- Supplier user
    ('550e8400-e29b-41d4-a716-446655440005', 'supplier', '{noop}password', ARRAY[3]::smallint[],
     'supplier-token-005') ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CATALOGS (Hierarchical Structure)
-- ============================================
INSERT INTO catalogs (id, title, description, parent_id, issued, modified)
VALUES
    -- Root Level 1
    ('650e8400-e29b-41d4-a716-446655440001', 'Science & Research', 'Main catalog for scientific data', NULL, NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440002', 'Business Intelligence', 'Business and analytics data', NULL, NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440003', 'Archive', 'Historical and archived data', NULL, NOW(), NOW()),

    -- Level 2 - Children of Science & Research
    ('650e8400-e29b-41d4-a716-446655440010', 'Physics', 'Physics research data', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440011', 'Chemistry', 'Chemistry research data', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440012', 'Biology', 'Biology research data', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),

    -- Level 2 - Children of Business Intelligence
    ('650e8400-e29b-41d4-a716-446655440020', 'Sales Data', 'Sales metrics and analytics', '650e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440021', 'Marketing Data', 'Marketing campaigns and metrics', '650e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440022', 'Financial Data', 'Financial reports and analysis', '650e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),

    -- Level 3 - Grandchildren of Science & Research
    ('650e8400-e29b-41d4-a716-446655440030', 'Quantum Physics', 'Quantum mechanics data', '650e8400-e29b-41d4-a716-446655440010', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440031', 'Particle Physics', 'Particle physics experiments', '650e8400-e29b-41d4-a716-446655440010', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440032', 'Organic Chemistry', 'Organic chemistry research', '650e8400-e29b-41d4-a716-446655440011', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440033', 'Genetics', 'Genetics and genomics data', '650e8400-e29b-41d4-a716-446655440012', NOW(), NOW()),

    -- Level 3 - Grandchildren of Business Intelligence
    ('650e8400-e29b-41d4-a716-446655440040', 'Q1 Sales', 'First quarter sales data', '650e8400-e29b-41d4-a716-446655440020', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440041', 'Q2 Sales', 'Second quarter sales data', '650e8400-e29b-41d4-a716-446655440020', NOW(), NOW()),
    ('650e8400-e29b-41d4-a716-446655440042', 'Social Media Marketing', 'Social media campaign data', '650e8400-e29b-41d4-a716-446655440021', NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SCHEMAS
-- ============================================
-- Note: Adjust column names based on your actual schema table structure
INSERT INTO schemas (id)
VALUES
    ('82477822-0ee6-4c18-aebb-500697d36c71'),
    ('82477822-0ee6-4c18-aebb-500697d36c72'),
    ('82477822-0ee6-4c18-aebb-500697d36c73')
    ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DATASETS
-- ============================================
INSERT INTO datasets (id, title, description, status, quality_controllable, raw_data_available, schema_id, owner_id)
VALUES
    -- Physics datasets (Scientific Schema)
    ('750e8400-e29b-41d4-a716-446655440001', 'LHC Experiment Run 2024', 'Large Hadron Collider experiment data from 2024', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440002', 'Quantum Entanglement Study', 'Quantum entanglement measurement results', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440003', 'Higgs Boson Analysis', 'Analysis data for Higgs boson detection', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '550e8400-e29b-41d4-a716-446655440001'),

    -- Chemistry datasets (Scientific Schema)
    ('750e8400-e29b-41d4-a716-446655440010', 'Organic Synthesis Results', 'Results from organic synthesis experiments', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440011', 'Molecular Structure Database', 'Database of molecular structures', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '550e8400-e29b-41d4-a716-446655440001'),

    -- Biology datasets (Scientific Schema)
    ('750e8400-e29b-41d4-a716-446655440020', 'Human Genome Sequencing', 'Complete human genome sequencing data', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440021', 'Protein Folding Analysis', 'Analysis of protein folding patterns', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440022', 'CRISPR Experiment Results', 'CRISPR gene editing experiment data', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '550e8400-e29b-41d4-a716-446655440001'),

    -- Sales datasets (Business Schema)
    ('750e8400-e29b-41d4-a716-446655440030', 'Sales Transactions Q1 2024', 'All sales transactions from Q1 2024', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440031', 'Customer Demographics', 'Customer demographic information', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440032', 'Product Performance Metrics', 'Metrics on product sales performance', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '550e8400-e29b-41d4-a716-446655440001'),

    -- Marketing datasets (Business Schema)
    ('750e8400-e29b-41d4-a716-446655440040', 'Email Campaign Results', 'Results from email marketing campaigns', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440041', 'Social Media Engagement', 'Social media engagement metrics', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440042', 'A/B Test Results', 'Results from A/B testing campaigns', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '550e8400-e29b-41d4-a716-446655440001'),

    -- Financial datasets (Business Schema)
    ('750e8400-e29b-41d4-a716-446655440050', 'Quarterly Financial Reports', 'Quarterly financial statement data', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440051', 'Budget Analysis', 'Budget planning and analysis data', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440052', 'Investment Portfolio', 'Investment portfolio tracking data', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '550e8400-e29b-41d4-a716-446655440001'),

    -- Archive datasets (Archive Schema)
    ('750e8400-e29b-41d4-a716-446655440060', 'Historical Sales Data 2020', 'Sales data archive from 2020', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c73', '550e8400-e29b-41d4-a716-446655440001'),
    ('750e8400-e29b-41d4-a716-446655440061', 'Legacy System Migration', 'Data migrated from legacy systems', 'ACTIVE', true, false, '82477822-0ee6-4c18-aebb-500697d36c73', '550e8400-e29b-41d4-a716-446655440001')
    ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CATALOG-DATASET RELATIONSHIPS
-- ============================================
INSERT INTO catalogs_datasets (catalog_id, datasets_id)
VALUES
    -- Physics catalog datasets
    ('650e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440001'),
    ('650e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440002'),
    ('650e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440003'),
    ('650e8400-e29b-41d4-a716-446655440030', '750e8400-e29b-41d4-a716-446655440002'),
    ('650e8400-e29b-41d4-a716-446655440031', '750e8400-e29b-41d4-a716-446655440001'),
    ('650e8400-e29b-41d4-a716-446655440031', '750e8400-e29b-41d4-a716-446655440003'),

    -- Chemistry catalog datasets
    ('650e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440010'),
    ('650e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440011'),
    ('650e8400-e29b-41d4-a716-446655440032', '750e8400-e29b-41d4-a716-446655440010'),

    -- Biology catalog datasets
    ('650e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440020'),
    ('650e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440021'),
    ('650e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440022'),
    ('650e8400-e29b-41d4-a716-446655440033', '750e8400-e29b-41d4-a716-446655440020'),
    ('650e8400-e29b-41d4-a716-446655440033', '750e8400-e29b-41d4-a716-446655440022'),

    -- Sales catalog datasets
    ('650e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440030'),
    ('650e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440031'),
    ('650e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440032'),
    ('650e8400-e29b-41d4-a716-446655440040', '750e8400-e29b-41d4-a716-446655440030'),
    ('650e8400-e29b-41d4-a716-446655440041', '750e8400-e29b-41d4-a716-446655440031'),

    -- Marketing catalog datasets
    ('650e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440040'),
    ('650e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440041'),
    ('650e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440042'),
    ('650e8400-e29b-41d4-a716-446655440042', '750e8400-e29b-41d4-a716-446655440041'),
    ('650e8400-e29b-41d4-a716-446655440042', '750e8400-e29b-41d4-a716-446655440042'),

    -- Financial catalog datasets
    ('650e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440050'),
    ('650e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440051'),
    ('650e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440052'),

    -- Archive catalog datasets
    ('650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440060'),
    ('650e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440061')
    ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Catalogs', COUNT(*) FROM catalogs
UNION ALL
SELECT 'Datasets', COUNT(*) FROM datasets
UNION ALL
SELECT 'Catalog-Dataset Links', COUNT(*) FROM catalogs_datasets;

-- Show catalog hierarchy
SELECT
    c.id,
    c.title,
    c.parent_id,
    CASE
        WHEN c.parent_id IS NULL THEN 'Root'
        WHEN EXISTS (SELECT 1 FROM catalogs WHERE parent_id = c.id) THEN 'Branch'
        ELSE 'Leaf'
        END as node_type,
    (SELECT COUNT(*) FROM catalogs WHERE parent_id = c.id) as child_count,
    (SELECT COUNT(*) FROM catalogs_datasets WHERE catalog_id = c.id) as dataset_count
FROM catalogs c
ORDER BY
    CASE WHEN c.parent_id IS NULL THEN c.title ELSE '' END,
    c.parent_id,
    c.title;

