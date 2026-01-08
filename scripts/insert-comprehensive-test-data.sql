-- ============================================
-- CLEAR ALL DATA
-- ============================================
-- Delete in order to respect foreign key constraints

-- First: tables that depend on datasets
DELETE FROM raw_data_batches;
DELETE FROM raw_datasets;
DELETE FROM quality_validity_alerts;
DELETE FROM dataset_comments;
DELETE FROM data_related_requests;
DELETE FROM data_entries;
DELETE FROM comments;
DELETE FROM datasets;

-- Then: schemas and related
DELETE FROM properties;
DELETE FROM concepts;
DELETE FROM primitive_type;
DELETE FROM types;
DELETE FROM constraints;
DELETE FROM schemas;

-- Then: catalogs (handle hierarchy)
DO $$
    DECLARE
        deleted_count INTEGER := 1;
    BEGIN
        WHILE deleted_count > 0 LOOP
                DELETE FROM catalogs
                WHERE id NOT IN (SELECT DISTINCT parent_id FROM catalogs WHERE parent_id IS NOT NULL);
                GET DIAGNOSTICS deleted_count = ROW_COUNT;
            END LOOP;
        DELETE FROM catalogs;
    END $$;

-- Then: users, data_owners, data_suppliers (depend on agents)
DELETE FROM users;
DELETE FROM data_owners;
DELETE FROM data_suppliers;

-- Then: agents (depend on agent_types)
DELETE FROM agents;

DELETE FROM agent_types;

-- ============================================
-- AGENT TYPES
-- ============================================
INSERT INTO agent_types (id, name, description)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Organization', 'Organization or company'),
    ('a0000000-0000-0000-0000-000000000002', 'Person', 'Individual person'),
    ('a0000000-0000-0000-0000-000000000003', 'System', 'Automated system or service')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- AGENTS
-- ============================================
INSERT INTO agents (id, name, email, type_id)
VALUES
    -- Organization agents
    ('b0000000-0000-0000-0000-000000000001', 'Anthropic Research Lab', 'research@anthropic.com', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000002', 'Data Analytics Corp', 'contact@dataanalytics.com', 'a0000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000003', 'Science Institute', 'info@scienceinst.org', 'a0000000-0000-0000-0000-000000000001'),
    -- Person agents
    ('b0000000-0000-0000-0000-000000000010', 'John Smith', 'john.smith@example.com', 'a0000000-0000-0000-0000-000000000002'),
    ('b0000000-0000-0000-0000-000000000011', 'Jane Doe', 'jane.doe@example.com', 'a0000000-0000-0000-0000-000000000002'),
    ('b0000000-0000-0000-0000-000000000012', 'Bob Wilson', 'bob.wilson@example.com', 'a0000000-0000-0000-0000-000000000002'),
    ('b0000000-0000-0000-0000-000000000013', 'Alice Brown', 'alice.brown@example.com', 'a0000000-0000-0000-0000-000000000002'),
    ('b0000000-0000-0000-0000-000000000014', 'Charlie Davis', 'charlie.davis@example.com', 'a0000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- USERS
-- ============================================
INSERT INTO users (id, username, password, roles, auth_token, agent_id)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'admin', '{noop}password', ARRAY[0,1,2,3,4,5,6]::smallint[], 'admin-token-001', 'b0000000-0000-0000-0000-000000000010'),
    ('00000000-0000-0000-0000-000000000002', 'metadata_manager', '{noop}password', ARRAY[0]::smallint[], 'metadata-manager-token-002', 'b0000000-0000-0000-0000-000000000011'),
    ('00000000-0000-0000-0000-000000000003', 'data_quality_manager', '{noop}password', ARRAY[2]::smallint[], 'data-quality-manager-token-003', 'b0000000-0000-0000-0000-000000000012'),
    ('00000000-0000-0000-0000-000000000004', 'data_supplier', '{noop}password', ARRAY[3]::smallint[], 'data-supplier-token-004', 'b0000000-0000-0000-0000-000000000013'),
    ('00000000-0000-0000-0000-000000000005', 'data_user', '{noop}password', ARRAY[4]::smallint[], 'data-user-token-005', 'b0000000-0000-0000-0000-000000000014')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DATA OWNERS
-- ============================================
INSERT INTO data_owners (id, name, owner_agent_id)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Research Division', 'b0000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000002', 'Business Analytics Team', 'b0000000-0000-0000-0000-000000000002'),
    ('c0000000-0000-0000-0000-000000000003', 'Archive Department', 'b0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DATA SUPPLIERS
-- ============================================
INSERT INTO data_suppliers (id, name, supplier_agent_id)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'Lab Equipment Systems', 'b0000000-0000-0000-0000-000000000001'),
    ('d0000000-0000-0000-0000-000000000002', 'Sales Platform Integration', 'b0000000-0000-0000-0000-000000000002'),
    ('d0000000-0000-0000-0000-000000000003', 'Legacy Data Migration Service', 'b0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PRIMITIVE TYPES (Foundation for Properties)
-- ============================================
-- String
INSERT INTO types (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440001', 'String')
ON CONFLICT (id) DO NOTHING;
INSERT INTO primitive_type (id) VALUES ('550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- Integer
INSERT INTO types (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440002', 'Integer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO primitive_type (id) VALUES ('550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Boolean
INSERT INTO types (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440003', 'Boolean')
ON CONFLICT (id) DO NOTHING;
INSERT INTO primitive_type (id) VALUES ('550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;

-- Date
INSERT INTO types (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440004', 'Date')
ON CONFLICT (id) DO NOTHING;
INSERT INTO primitive_type (id) VALUES ('550e8400-e29b-41d4-a716-446655440004')
ON CONFLICT (id) DO NOTHING;

-- Decimal
INSERT INTO types (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440005', 'Decimal')
ON CONFLICT (id) DO NOTHING;
INSERT INTO primitive_type (id) VALUES ('550e8400-e29b-41d4-a716-446655440005')
ON CONFLICT (id) DO NOTHING;

-- Timestamp
INSERT INTO types (id, name) VALUES ('550e8400-e29b-41d4-a716-446655440006', 'Timestamp')
ON CONFLICT (id) DO NOTHING;
INSERT INTO primitive_type (id) VALUES ('550e8400-e29b-41d4-a716-446655440006')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SCHEMAS
-- ============================================
INSERT INTO schemas (id, title, description)
VALUES
    ('82477822-0ee6-4c18-aebb-500697d36c71', 'Scientific Data Schema', 'Schema for scientific research datasets'),
    ('82477822-0ee6-4c18-aebb-500697d36c72', 'Business Data Schema', 'Schema for business and analytics datasets'),
    ('82477822-0ee6-4c18-aebb-500697d36c73', 'Archive Data Schema', 'Schema for historical and archived datasets')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CONCEPTS (Types that belong to Schemas)
-- ============================================

-- ----------------------------------------
-- Concepts for Scientific Data Schema
-- ----------------------------------------

-- Experiment concept
INSERT INTO types (id, name) VALUES ('11111111-1111-1111-1111-111111111101', 'Experiment')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('11111111-1111-1111-1111-111111111101', '82477822-0ee6-4c18-aebb-500697d36c71')
ON CONFLICT (id) DO NOTHING;

-- Measurement concept
INSERT INTO types (id, name) VALUES ('11111111-1111-1111-1111-111111111102', 'Measurement')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('11111111-1111-1111-1111-111111111102', '82477822-0ee6-4c18-aebb-500697d36c71')
ON CONFLICT (id) DO NOTHING;

-- Sample concept
INSERT INTO types (id, name) VALUES ('11111111-1111-1111-1111-111111111103', 'Sample')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('11111111-1111-1111-1111-111111111103', '82477822-0ee6-4c18-aebb-500697d36c71')
ON CONFLICT (id) DO NOTHING;

-- Researcher concept
INSERT INTO types (id, name) VALUES ('11111111-1111-1111-1111-111111111104', 'Researcher')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('11111111-1111-1111-1111-111111111104', '82477822-0ee6-4c18-aebb-500697d36c71')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Concepts for Business Data Schema
-- ----------------------------------------

-- Customer concept
INSERT INTO types (id, name) VALUES ('22222222-2222-2222-2222-222222222201', 'Customer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('22222222-2222-2222-2222-222222222201', '82477822-0ee6-4c18-aebb-500697d36c72')
ON CONFLICT (id) DO NOTHING;

-- Transaction concept
INSERT INTO types (id, name) VALUES ('22222222-2222-2222-2222-222222222202', 'Transaction')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('22222222-2222-2222-2222-222222222202', '82477822-0ee6-4c18-aebb-500697d36c72')
ON CONFLICT (id) DO NOTHING;

-- Product concept
INSERT INTO types (id, name) VALUES ('22222222-2222-2222-2222-222222222203', 'Product')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('22222222-2222-2222-2222-222222222203', '82477822-0ee6-4c18-aebb-500697d36c72')
ON CONFLICT (id) DO NOTHING;

-- Campaign concept
INSERT INTO types (id, name) VALUES ('22222222-2222-2222-2222-222222222204', 'Campaign')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('22222222-2222-2222-2222-222222222204', '82477822-0ee6-4c18-aebb-500697d36c72')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Concepts for Archive Data Schema
-- ----------------------------------------

-- ArchivedRecord concept
INSERT INTO types (id, name) VALUES ('33333333-3333-3333-3333-333333333301', 'ArchivedRecord')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('33333333-3333-3333-3333-333333333301', '82477822-0ee6-4c18-aebb-500697d36c73')
ON CONFLICT (id) DO NOTHING;

-- MigrationLog concept
INSERT INTO types (id, name) VALUES ('33333333-3333-3333-3333-333333333302', 'MigrationLog')
ON CONFLICT (id) DO NOTHING;
INSERT INTO concepts (id, schema_id) VALUES ('33333333-3333-3333-3333-333333333302', '82477822-0ee6-4c18-aebb-500697d36c73')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PROPERTIES FOR CONCEPTS
-- ============================================

-- ----------------------------------------
-- Properties for Experiment concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('44444444-4444-4444-4444-444444440101', 'experimentId', '11111111-1111-1111-1111-111111111101', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440102', 'title', '11111111-1111-1111-1111-111111111101', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440103', 'hypothesis', '11111111-1111-1111-1111-111111111101', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440104', 'startDate', '11111111-1111-1111-1111-111111111101', '550e8400-e29b-41d4-a716-446655440004'),
                                                           ('44444444-4444-4444-4444-444444440105', 'endDate', '11111111-1111-1111-1111-111111111101', '550e8400-e29b-41d4-a716-446655440004'),
                                                           ('44444444-4444-4444-4444-444444440106', 'isCompleted', '11111111-1111-1111-1111-111111111101', '550e8400-e29b-41d4-a716-446655440003'),
                                                           ('44444444-4444-4444-4444-444444440107', 'leadResearcher', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111104')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Properties for Measurement concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('44444444-4444-4444-4444-444444440201', 'measurementId', '11111111-1111-1111-1111-111111111102', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440202', 'value', '11111111-1111-1111-1111-111111111102', '550e8400-e29b-41d4-a716-446655440005'),
                                                           ('44444444-4444-4444-4444-444444440203', 'unit', '11111111-1111-1111-1111-111111111102', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440204', 'timestamp', '11111111-1111-1111-1111-111111111102', '550e8400-e29b-41d4-a716-446655440006'),
                                                           ('44444444-4444-4444-4444-444444440205', 'uncertainty', '11111111-1111-1111-1111-111111111102', '550e8400-e29b-41d4-a716-446655440005'),
                                                           ('44444444-4444-4444-4444-444444440206', 'isValid', '11111111-1111-1111-1111-111111111102', '550e8400-e29b-41d4-a716-446655440003'),
                                                           ('44444444-4444-4444-4444-444444440207', 'sample', '11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111103')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Properties for Sample concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('44444444-4444-4444-4444-444444440301', 'sampleId', '11111111-1111-1111-1111-111111111103', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440302', 'name', '11111111-1111-1111-1111-111111111103', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440303', 'collectionDate', '11111111-1111-1111-1111-111111111103', '550e8400-e29b-41d4-a716-446655440004'),
                                                           ('44444444-4444-4444-4444-444444440304', 'location', '11111111-1111-1111-1111-111111111103', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440305', 'quantity', '11111111-1111-1111-1111-111111111103', '550e8400-e29b-41d4-a716-446655440005')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Properties for Researcher concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('44444444-4444-4444-4444-444444440401', 'researcherId', '11111111-1111-1111-1111-111111111104', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440402', 'fullName', '11111111-1111-1111-1111-111111111104', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440403', 'email', '11111111-1111-1111-1111-111111111104', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440404', 'department', '11111111-1111-1111-1111-111111111104', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('44444444-4444-4444-4444-444444440405', 'isActive', '11111111-1111-1111-1111-111111111104', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Properties for Customer concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('55555555-5555-5555-5555-555555550101', 'customerId', '22222222-2222-2222-2222-222222222201', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550102', 'fullName', '22222222-2222-2222-2222-222222222201', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550103', 'email', '22222222-2222-2222-2222-222222222201', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550104', 'registrationDate', '22222222-2222-2222-2222-222222222201', '550e8400-e29b-41d4-a716-446655440004'),
                                                           ('55555555-5555-5555-5555-555555550105', 'isActive', '22222222-2222-2222-2222-222222222201', '550e8400-e29b-41d4-a716-446655440003'),
                                                           ('55555555-5555-5555-5555-555555550106', 'totalPurchases', '22222222-2222-2222-2222-222222222201', '550e8400-e29b-41d4-a716-446655440002'),
                                                           ('55555555-5555-5555-5555-555555550107', 'lifetimeValue', '22222222-2222-2222-2222-222222222201', '550e8400-e29b-41d4-a716-446655440005')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Properties for Transaction concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('55555555-5555-5555-5555-555555550201', 'transactionId', '22222222-2222-2222-2222-222222222202', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550202', 'transactionDate', '22222222-2222-2222-2222-222222222202', '550e8400-e29b-41d4-a716-446655440006'),
                                                           ('55555555-5555-5555-5555-555555550203', 'amount', '22222222-2222-2222-2222-222222222202', '550e8400-e29b-41d4-a716-446655440005'),
                                                           ('55555555-5555-5555-5555-555555550204', 'currency', '22222222-2222-2222-2222-222222222202', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550205', 'status', '22222222-2222-2222-2222-222222222202', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550206', 'customer', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222201'),
                                                           ('55555555-5555-5555-5555-555555550207', 'product', '22222222-2222-2222-2222-222222222202', '22222222-2222-2222-2222-222222222203')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Properties for Product concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('55555555-5555-5555-5555-555555550301', 'productId', '22222222-2222-2222-2222-222222222203', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550302', 'name', '22222222-2222-2222-2222-222222222203', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550303', 'description', '22222222-2222-2222-2222-222222222203', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550304', 'price', '22222222-2222-2222-2222-222222222203', '550e8400-e29b-41d4-a716-446655440005'),
                                                           ('55555555-5555-5555-5555-555555550305', 'stockQuantity', '22222222-2222-2222-2222-222222222203', '550e8400-e29b-41d4-a716-446655440002'),
                                                           ('55555555-5555-5555-5555-555555550306', 'isAvailable', '22222222-2222-2222-2222-222222222203', '550e8400-e29b-41d4-a716-446655440003'),
                                                           ('55555555-5555-5555-5555-555555550307', 'category', '22222222-2222-2222-2222-222222222203', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Properties for Campaign concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('55555555-5555-5555-5555-555555550401', 'campaignId', '22222222-2222-2222-2222-222222222204', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550402', 'name', '22222222-2222-2222-2222-222222222204', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('55555555-5555-5555-5555-555555550403', 'startDate', '22222222-2222-2222-2222-222222222204', '550e8400-e29b-41d4-a716-446655440004'),
                                                           ('55555555-5555-5555-5555-555555550404', 'endDate', '22222222-2222-2222-2222-222222222204', '550e8400-e29b-41d4-a716-446655440004'),
                                                           ('55555555-5555-5555-5555-555555550405', 'budget', '22222222-2222-2222-2222-222222222204', '550e8400-e29b-41d4-a716-446655440005'),
                                                           ('55555555-5555-5555-5555-555555550406', 'impressions', '22222222-2222-2222-2222-222222222204', '550e8400-e29b-41d4-a716-446655440002'),
                                                           ('55555555-5555-5555-5555-555555550407', 'conversions', '22222222-2222-2222-2222-222222222204', '550e8400-e29b-41d4-a716-446655440002'),
                                                           ('55555555-5555-5555-5555-555555550408', 'isActive', '22222222-2222-2222-2222-222222222204', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Properties for ArchivedRecord concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('66666666-6666-6666-6666-666666660101', 'recordId', '33333333-3333-3333-3333-333333333301', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('66666666-6666-6666-6666-666666660102', 'originalSource', '33333333-3333-3333-3333-333333333301', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('66666666-6666-6666-6666-666666660103', 'archivedDate', '33333333-3333-3333-3333-333333333301', '550e8400-e29b-41d4-a716-446655440006'),
                                                           ('66666666-6666-6666-6666-666666660104', 'retentionPeriod', '33333333-3333-3333-3333-333333333301', '550e8400-e29b-41d4-a716-446655440002'),
                                                           ('66666666-6666-6666-6666-666666660105', 'dataType', '33333333-3333-3333-3333-333333333301', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('66666666-6666-6666-6666-666666660106', 'isEncrypted', '33333333-3333-3333-3333-333333333301', '550e8400-e29b-41d4-a716-446655440003'),
                                                           ('66666666-6666-6666-6666-666666660107', 'checksum', '33333333-3333-3333-3333-333333333301', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------
-- Properties for MigrationLog concept
-- ----------------------------------------
INSERT INTO properties (id, name, concept_id, type_id) VALUES
                                                           ('66666666-6666-6666-6666-666666660201', 'logId', '33333333-3333-3333-3333-333333333302', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('66666666-6666-6666-6666-666666660202', 'sourceSystem', '33333333-3333-3333-3333-333333333302', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('66666666-6666-6666-6666-666666660203', 'targetSystem', '33333333-3333-3333-3333-333333333302', '550e8400-e29b-41d4-a716-446655440001'),
                                                           ('66666666-6666-6666-6666-666666660204', 'migrationDate', '33333333-3333-3333-3333-333333333302', '550e8400-e29b-41d4-a716-446655440006'),
                                                           ('66666666-6666-6666-6666-666666660205', 'recordsProcessed', '33333333-3333-3333-3333-333333333302', '550e8400-e29b-41d4-a716-446655440002'),
                                                           ('66666666-6666-6666-6666-666666660206', 'recordsFailed', '33333333-3333-3333-3333-333333333302', '550e8400-e29b-41d4-a716-446655440002'),
                                                           ('66666666-6666-6666-6666-666666660207', 'isSuccessful', '33333333-3333-3333-3333-333333333302', '550e8400-e29b-41d4-a716-446655440003'),
                                                           ('66666666-6666-6666-6666-666666660208', 'errorMessage', '33333333-3333-3333-3333-333333333302', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CONSTRAINTS
-- ============================================
INSERT INTO constraints (id, rule, schema_id) VALUES
                                                  (gen_random_uuid(), 'Measurement.value must be a valid number', '82477822-0ee6-4c18-aebb-500697d36c71'),
                                                  (gen_random_uuid(), 'Experiment.startDate <= Experiment.endDate', '82477822-0ee6-4c18-aebb-500697d36c71'),
                                                  (gen_random_uuid(), 'Transaction.amount > 0', '82477822-0ee6-4c18-aebb-500697d36c72'),
                                                  (gen_random_uuid(), 'Product.price >= 0', '82477822-0ee6-4c18-aebb-500697d36c72'),
                                                  (gen_random_uuid(), 'Campaign.budget >= 0', '82477822-0ee6-4c18-aebb-500697d36c72'),
                                                  (gen_random_uuid(), 'ArchivedRecord.retentionPeriod > 0', '82477822-0ee6-4c18-aebb-500697d36c73'),
                                                  (gen_random_uuid(), 'MigrationLog.recordsProcessed >= MigrationLog.recordsFailed', '82477822-0ee6-4c18-aebb-500697d36c73')
ON CONFLICT DO NOTHING;

-- ============================================
-- CATALOGS (Hierarchical Structure)
-- ============================================
INSERT INTO catalogs (id, title, description, parent_id, issued, modified, creator_agent_id, publisher_agent_id)
VALUES
    -- Root Level
    ('650e8400-e29b-41d4-a716-446655440001', 'Science & Research', 'Main catalog for scientific data', NULL, NOW(), NOW(), 'b0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000001'),
    ('650e8400-e29b-41d4-a716-446655440002', 'Business Intelligence', 'Business and analytics data', NULL, NOW(), NOW(), 'b0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002'),
    ('650e8400-e29b-41d4-a716-446655440003', 'Archive', 'Historical and archived data', NULL, NOW(), NOW(), 'b0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000003'),

    -- Level 2 - Children of Science & Research
    ('650e8400-e29b-41d4-a716-446655440010', 'Physics', 'Physics research data', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001'),
    ('650e8400-e29b-41d4-a716-446655440011', 'Chemistry', 'Chemistry research data', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001'),
    ('650e8400-e29b-41d4-a716-446655440012', 'Biology', 'Biology research data', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001'),

    -- Level 2 - Children of Business Intelligence
    ('650e8400-e29b-41d4-a716-446655440020', 'Sales Data', 'Sales metrics and analytics', '650e8400-e29b-41d4-a716-446655440002', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002'),
    ('650e8400-e29b-41d4-a716-446655440021', 'Marketing Data', 'Marketing campaigns and metrics', '650e8400-e29b-41d4-a716-446655440002', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002'),
    ('650e8400-e29b-41d4-a716-446655440022', 'Financial Data', 'Financial reports and analysis', '650e8400-e29b-41d4-a716-446655440002', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002'),

    -- Level 3 - Grandchildren of Science & Research
    ('650e8400-e29b-41d4-a716-446655440030', 'Quantum Physics', 'Quantum mechanics data', '650e8400-e29b-41d4-a716-446655440010', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001'),
    ('650e8400-e29b-41d4-a716-446655440031', 'Particle Physics', 'Particle physics experiments', '650e8400-e29b-41d4-a716-446655440010', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001'),
    ('650e8400-e29b-41d4-a716-446655440032', 'Organic Chemistry', 'Organic chemistry research', '650e8400-e29b-41d4-a716-446655440011', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001'),
    ('650e8400-e29b-41d4-a716-446655440033', 'Genetics', 'Genetics and genomics data', '650e8400-e29b-41d4-a716-446655440012', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001'),

    -- Level 3 - Grandchildren of Business Intelligence
    ('650e8400-e29b-41d4-a716-446655440040', 'Q1 Sales', 'First quarter sales data', '650e8400-e29b-41d4-a716-446655440020', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002'),
    ('650e8400-e29b-41d4-a716-446655440041', 'Q2 Sales', 'Second quarter sales data', '650e8400-e29b-41d4-a716-446655440020', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002'),
    ('650e8400-e29b-41d4-a716-446655440042', 'Social Media Marketing', 'Social media campaign data', '650e8400-e29b-41d4-a716-446655440021', NOW(), NOW(), 'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DATASETS
-- ============================================
INSERT INTO datasets (
    id, title, description, status,
    quality_controllable, raw_data_available,
    schema_id, user_owner_id, catalog_id,
    data_owner_id, data_supplier_id,
    contact_point_agent_id, publisher_agent_id,
    issued_date, modified_date
)
VALUES
    -- Physics datasets
    ('750e8400-e29b-41d4-a716-446655440001', 'LHC Experiment Run 2024', 'Large Hadron Collider experiment data from 2024', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '00000000-0000-0000-0000-000000000002', '650e8400-e29b-41d4-a716-446655440010',
     'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440002', 'Quantum Entanglement Study', 'Quantum entanglement measurement results', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '00000000-0000-0000-0000-000000000002', '650e8400-e29b-41d4-a716-446655440030',
     'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440003', 'Higgs Boson Analysis', 'Analysis data for Higgs boson detection', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '00000000-0000-0000-0000-000000000002', '650e8400-e29b-41d4-a716-446655440031',
     'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001',
     CURRENT_DATE, CURRENT_DATE),

    -- Chemistry datasets
    ('750e8400-e29b-41d4-a716-446655440010', 'Organic Synthesis Results', 'Results from organic synthesis experiments', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '00000000-0000-0000-0000-000000000002', '650e8400-e29b-41d4-a716-446655440032',
     'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440011', 'Molecular Structure Database', 'Database of molecular structures', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '00000000-0000-0000-0000-000000000002', '650e8400-e29b-41d4-a716-446655440011',
     'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001',
     CURRENT_DATE, CURRENT_DATE),

    -- Biology datasets
    ('750e8400-e29b-41d4-a716-446655440020', 'Human Genome Sequencing', 'Complete human genome sequencing data', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '00000000-0000-0000-0000-000000000002', '650e8400-e29b-41d4-a716-446655440033',
     'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440021', 'Protein Folding Analysis', 'Analysis of protein folding patterns', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '00000000-0000-0000-0000-000000000002', '650e8400-e29b-41d4-a716-446655440012',
     'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440022', 'CRISPR Experiment Results', 'CRISPR gene editing experiment data', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c71', '00000000-0000-0000-0000-000000000002', '650e8400-e29b-41d4-a716-446655440033',
     'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001',
     CURRENT_DATE, CURRENT_DATE),

    -- Sales datasets
    ('750e8400-e29b-41d4-a716-446655440030', 'Sales Transactions Q1 2024', 'All sales transactions from Q1 2024', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440040',
     'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440031', 'Customer Demographics', 'Customer demographic information', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440020',
     'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440032', 'Product Performance Metrics', 'Metrics on product sales performance', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440041',
     'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002',
     CURRENT_DATE, CURRENT_DATE),

    -- Marketing datasets
    ('750e8400-e29b-41d4-a716-446655440040', 'Email Campaign Results', 'Results from email marketing campaigns', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440021',
     'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440041', 'Social Media Engagement', 'Social media engagement metrics', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440042',
     'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440042', 'A/B Test Results', 'Results from A/B testing campaigns', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440042',
     'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002',
     CURRENT_DATE, CURRENT_DATE),

    -- Financial datasets
    ('750e8400-e29b-41d4-a716-446655440050', 'Quarterly Financial Reports', 'Quarterly financial statement data', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440022',
     'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440051', 'Budget Analysis', 'Budget planning and analysis data', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440022',
     'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440052', 'Investment Portfolio', 'Investment portfolio tracking data', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c72', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440022',
     'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002',
     CURRENT_DATE, CURRENT_DATE),

    -- Archive datasets
    ('750e8400-e29b-41d4-a716-446655440060', 'Historical Sales Data 2020', 'Sales data archive from 2020', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c73', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440003',
     'c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000003',
     CURRENT_DATE, CURRENT_DATE),

    ('750e8400-e29b-41d4-a716-446655440061', 'Legacy System Migration', 'Data migrated from legacy systems', 'ACTIVE',
     true, false, '82477822-0ee6-4c18-aebb-500697d36c73', '00000000-0000-0000-0000-000000000001', '650e8400-e29b-41d4-a716-446655440003',
     'c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000003',
     CURRENT_DATE, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Agent Types' as table_name, COUNT(*) as count FROM agent_types
UNION ALL
SELECT 'Agents', COUNT(*) FROM agents
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Data Owners', COUNT(*) FROM data_owners
UNION ALL
SELECT 'Data Suppliers', COUNT(*) FROM data_suppliers
UNION ALL
SELECT 'Primitive Types', COUNT(*) FROM primitive_type
UNION ALL
SELECT 'Schemas', COUNT(*) FROM schemas
UNION ALL
SELECT 'Concepts', COUNT(*) FROM concepts
UNION ALL
SELECT 'Properties', COUNT(*) FROM properties
UNION ALL
SELECT 'Constraints', COUNT(*) FROM constraints
UNION ALL
SELECT 'Catalogs', COUNT(*) FROM catalogs
UNION ALL
SELECT 'Datasets', COUNT(*) FROM datasets;

-- Show schema structure with concepts and properties
SELECT
    s.title AS schema_title,
    t.name AS concept_name,
    p.name AS property_name,
    pt.name AS property_type
FROM schemas s
         JOIN concepts c ON c.schema_id = s.id
         JOIN types t ON t.id = c.id
         LEFT JOIN properties p ON p.concept_id = c.id
         LEFT JOIN types pt ON pt.id = p.type_id
ORDER BY s.title, t.name, p.name;

-- Show catalog hierarchy with dataset counts
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
    (SELECT COUNT(*) FROM datasets WHERE catalog_id = c.id) as dataset_count
FROM catalogs c
ORDER BY
    CASE WHEN c.parent_id IS NULL THEN c.title ELSE '' END,
    c.parent_id,
    c.title;