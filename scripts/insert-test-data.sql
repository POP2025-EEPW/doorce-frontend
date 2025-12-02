-- Insert test user
-- Note: roles is smallint[], mapping roles to integers (check your backend enum order)
-- Common mapping: 0=MetadataManager, 1=AcquisitionAppManager, 2=DataQualityManager, 3=DataSupplier, 4=DataUser, 5=AccessAppDeveloper, 6=Admin
-- Note: Passwords are stored as plain text with {noop} prefix for Spring Security
-- Format: {noop}password
INSERT INTO users (id, username, password, roles, auth_token)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'testuser', '{noop}password', ARRAY[4]::smallint[], 'test-token-123')
ON CONFLICT (id) DO NOTHING;

-- Insert test catalogs
INSERT INTO catalogs (id, title, description, parent_id, issued, modified)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', 'Root Catalog 1', 'First root catalog for testing', NULL, NOW(), NOW()),
  ('650e8400-e29b-41d4-a716-446655440002', 'Root Catalog 2', 'Second root catalog', NULL, NOW(), NOW()),
  ('650e8400-e29b-41d4-a716-446655440003', 'Child Catalog 1', 'Child of Root Catalog 1', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
  ('650e8400-e29b-41d4-a716-446655440004', 'Child Catalog 2', 'Another child of Root Catalog 1', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify inserted data
SELECT id, title, description, parent_id, issued FROM catalogs ORDER BY issued;

