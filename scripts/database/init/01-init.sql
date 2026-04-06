-- PDI Platform Database Initialization Script
-- Version: 1.0.0
-- Database: PostgreSQL 15 + PostGIS 3.4

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- AUTH SERVICE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    cnp VARCHAR(13) UNIQUE,
    user_type VARCHAR(20) NOT NULL DEFAULT 'PERSON',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    department_id UUID,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id, department_id)
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Role permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(512) NOT NULL,
    refresh_token_hash VARCHAR(512),
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trail table
CREATE TABLE IF NOT EXISTS audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADDRESSES (Shared across services)
-- ============================================

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    street_name VARCHAR(255),
    street_number VARCHAR(20),
    building VARCHAR(50),
    staircase VARCHAR(20),
    floor VARCHAR(20),
    apartment VARCHAR(20),
    locality VARCHAR(100),
    county VARCHAR(100),
    postal_code VARCHAR(10),
    location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cnp ON users(cnp);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Audit indexes
CREATE INDEX IF NOT EXISTS idx_audit_trail_user ON audit_trail(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_entity ON audit_trail(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_created ON audit_trail(created_at);

-- Address indexes
CREATE INDEX IF NOT EXISTS idx_addresses_location ON addresses USING GIST(location);

-- ============================================
-- TAX SERVICE TABLES
-- ============================================

-- Tax Categories
CREATE TABLE IF NOT EXISTS tax_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tax_type VARCHAR(20) NOT NULL,
    tax_rate NUMERIC(10, 4),
    calculation_method VARCHAR(20),
    formula JSONB,
    zone_multipliers JSONB,
    valid_from DATE,
    valid_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Properties
CREATE TABLE IF NOT EXISTS tax_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_type VARCHAR(20) NOT NULL,
    owner_id UUID NOT NULL,
    address_id UUID REFERENCES addresses(id),
    cadastral_number VARCHAR(50),
    land_registry_number VARCHAR(50),
    area NUMERIC(12, 3),
    construction_year INTEGER,
    zone VARCHAR(10),
    street_zone_multiplier NUMERIC(5, 2),
    property_value NUMERIC(15, 2),
    yards_area NUMERIC(10, 2),
    is_exempt BOOLEAN DEFAULT false,
    exemption_reason VARCHAR(500),
    exemption_start_date TIMESTAMPTZ,
    exemption_end_date TIMESTAMPTZ,
    additional_data JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Declarations
CREATE TABLE IF NOT EXISTS tax_declarations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    declaration_number VARCHAR(30) UNIQUE,
    contributor_id UUID NOT NULL,
    property_id UUID REFERENCES tax_properties(id),
    declaration_type VARCHAR(30) NOT NULL,
    declaration_status VARCHAR(20) DEFAULT 'DRAFT',
    tax_year INTEGER,
    declaration_data JSONB,
    calculated_tax NUMERIC(15, 2),
    observations TEXT,
    submitted_at TIMESTAMPTZ,
    validated_at TIMESTAMPTZ,
    validated_by UUID,
    rejection_reason VARCHAR(500),
    document_path VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Liabilities
CREATE TABLE IF NOT EXISTS tax_liabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contributor_id UUID NOT NULL,
    property_id UUID REFERENCES tax_properties(id),
    tax_type VARCHAR(30) NOT NULL,
    tax_year INTEGER NOT NULL,
    tax_period VARCHAR(10),
    category_id UUID REFERENCES tax_categories(id),
    gross_tax NUMERIC(15, 2) NOT NULL,
    exemption_amount NUMERIC(15, 2) DEFAULT 0,
    discount_amount NUMERIC(15, 2) DEFAULT 0,
    net_tax NUMERIC(15, 2) NOT NULL,
    penalty_amount NUMERIC(15, 2) DEFAULT 0,
    total_due NUMERIC(15, 2) NOT NULL,
    paid_amount NUMERIC(15, 2) DEFAULT 0,
    remaining_amount NUMERIC(15, 2) DEFAULT 0,
    liability_status VARCHAR(20) DEFAULT 'DUE',
    due_date DATE,
    settlement_date DATE,
    supersolva_balance NUMERIC(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Payments
CREATE TABLE IF NOT EXISTS tax_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_number VARCHAR(30) UNIQUE,
    contributor_id UUID NOT NULL,
    property_id UUID REFERENCES tax_properties(id),
    tax_liability_id UUID REFERENCES tax_liabilities(id),
    payment_type VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,
    payment_date DATE NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    penalty_amount NUMERIC(15, 2) DEFAULT 0,
    discount_amount NUMERIC(15, 2) DEFAULT 0,
    total_amount NUMERIC(15, 2) NOT NULL,
    receipt_number VARCHAR(30),
    transaction_id VARCHAR(100),
    bank_reference VARCHAR(100),
    payment_details TEXT,
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax Indexes
CREATE INDEX IF NOT EXISTS idx_tax_properties_owner ON tax_properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_tax_properties_type ON tax_properties(property_type);
CREATE INDEX IF NOT EXISTS idx_tax_properties_cadastral ON tax_properties(cadastral_number);

CREATE INDEX IF NOT EXISTS idx_tax_declarations_contributor ON tax_declarations(contributor_id);
CREATE INDEX IF NOT EXISTS idx_tax_declarations_property ON tax_declarations(property_id);
CREATE INDEX IF NOT EXISTS idx_tax_declarations_status ON tax_declarations(declaration_status);
CREATE INDEX IF NOT EXISTS idx_tax_declarations_year ON tax_declarations(tax_year);

CREATE INDEX IF NOT EXISTS idx_tax_liabilities_contributor ON tax_liabilities(contributor_id);
CREATE INDEX IF NOT EXISTS idx_tax_liabilities_property ON tax_liabilities(property_id);
CREATE INDEX IF NOT EXISTS idx_tax_liabilities_year ON tax_liabilities(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_liabilities_status ON tax_liabilities(liability_status);
CREATE INDEX IF NOT EXISTS idx_tax_liabilities_due_date ON tax_liabilities(due_date);

CREATE INDEX IF NOT EXISTS idx_tax_payments_contributor ON tax_payments(contributor_id);
CREATE INDEX IF NOT EXISTS idx_tax_payments_property ON tax_payments(property_id);
CREATE INDEX IF NOT EXISTS idx_tax_payments_date ON tax_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_tax_payments_status ON tax_payments(payment_status);

-- Default Tax Categories
INSERT INTO tax_categories (code, name, tax_type, tax_rate, calculation_method, valid_from, valid_to, is_active) VALUES
    ('IMP_CLAD_ART', 'Impozit clădiri - art. 457', 'BUILDING', 0.0015, 'PERCENTAGE', '2024-01-01', NULL, true),
    ('IMP_CLAD_SUB', 'Impozit clădiri - art. 458', 'BUILDING', 0.0025, 'PERCENTAGE', '2024-01-01', NULL, true),
    ('IMP_TEREN_INTRA', 'Impozit teren intravilan', 'LAND', 0.0030, 'PERCENTAGE', '2024-01-01', NULL, true),
    ('IMP_TEREN_EXTRA', 'Impozit teren extravilan', 'LAND', NULL, 'FIXED', '2024-01-01', NULL, true),
    ('IMP_AUTO', 'Impozit mijloace transport', 'VEHICLE', NULL, 'FORMULA', '2024-01-01', NULL, true)
ON CONFLICT (code) DO NOTHING;

-- Comments
COMMENT ON TABLE tax_categories IS 'Categorii fiscale pentru calculul impozitelor';
COMMENT ON TABLE tax_properties IS 'Proprietăți impozabile (clădiri, terenuri, auto)';
COMMENT ON TABLE tax_declarations IS 'Declarații fiscale depuse de contribuabili';
COMMENT ON TABLE tax_liabilities IS 'Obligații fiscale calculate pentru fiecare contribuabil';
COMMENT ON NOT NULL CONSTRAINT tax_liabilities_contributor_id IS 'Legătura cu tabelul de utilizatori';
COMMENT ON TABLE tax_payments IS 'Încasări și plăți efectuate de contribuabili';

-- ============================================
-- URBANISM SERVICE TABLES
-- ============================================

-- Urbanism Registers
CREATE TABLE IF NOT EXISTS urbanism_registers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    register_type VARCHAR(20) NOT NULL,
    register_number VARCHAR(30),
    session_date DATE,
    register_status VARCHAR(20) DEFAULT 'OPEN',
    observations TEXT,
    total_records INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Urbanism UTR (Unitate Teritorială de Referință)
CREATE TABLE IF NOT EXISTS urbanism_utrs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    pot_code INTEGER,
    cut_code INTEGER,
    max_build_height NUMERIC(5, 2),
    pot_percentage INTEGER,
    cut_index NUMERIC(5, 2),
    zoning_type VARCHAR(50),
    regulations TEXT,
    typography TEXT,
    min_lot_area INTEGER,
    max_floors INTEGER,
    additional_conditions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificate of Urbanism (Certificat de Urbanism)
CREATE TABLE IF NOT EXISTS urbanism_cu (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cu_number VARCHAR(30) UNIQUE,
    register_id UUID REFERENCES urbanism_registers(id),
    applicant_id UUID NOT NULL,
    utr_id UUID REFERENCES urbanism_utrs(id),
    address_id UUID REFERENCES addresses(id),
    application_date DATE,
    issue_date DATE,
    expiry_date DATE,
    cu_status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    purpose TEXT,
    legal_regime VARCHAR(500),
    urbanism_certificate_type VARCHAR(50),
    content TEXT,
    conditions TEXT,
    observations TEXT,
    issued_by UUID,
    tax_amount NUMERIC(15, 2),
    tax_paid BOOLEAN DEFAULT false,
    document_path VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authorizations (Autorizație de Construire/Desființare)
CREATE TABLE IF NOT EXISTS urbanism_ac (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ac_number VARCHAR(30) UNIQUE,
    cu_id UUID REFERENCES urbanism_cu(id),
    register_id UUID REFERENCES urbanism_registers(id),
    applicant_id UUID NOT NULL,
    utr_id UUID REFERENCES urbanism_utrs(id),
    authorization_type VARCHAR(20) NOT NULL,
    application_date DATE,
    issue_date DATE,
    expiry_date DATE,
    ac_status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    construction_type VARCHAR(100),
    destination VARCHAR(255),
    built_area NUMERIC(10, 2),
    total_area NUMERIC(10, 2),
    height NUMERIC(5, 2),
    floors INTEGER,
    rooms INTEGER,
    construction_value NUMERIC(15, 2),
    technical_conditions TEXT,
    urbanism_conditions TEXT,
    observations TEXT,
    issued_by UUID,
    tax_amount NUMERIC(15, 2),
    regularization_tax NUMERIC(15, 2),
    tax_paid BOOLEAN DEFAULT false,
    document_path VARCHAR(500),
    completion_date DATE,
    receiving_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificate of Street Nomenclature (Certificat Nomenclatură Stradală)
CREATE TABLE IF NOT EXISTS urbanism_cns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cns_number VARCHAR(30) UNIQUE,
    register_id UUID REFERENCES urbanism_registers(id),
    applicant_id UUID NOT NULL,
    address_id UUID REFERENCES addresses(id),
    street_name VARCHAR(255),
    street_code VARCHAR(20),
    street_number VARCHAR(20),
    block VARCHAR(20),
    entry VARCHAR(20),
    floor VARCHAR(20),
    apartment VARCHAR(20),
    application_date DATE,
    issue_date DATE,
    cns_status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    observations TEXT,
    issued_by UUID,
    tax_amount NUMERIC(15, 2),
    tax_paid BOOLEAN DEFAULT false,
    document_path VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Urbanism Indexes
CREATE INDEX IF NOT EXISTS idx_urbanism_registers_type ON urbanism_registers(register_type);
CREATE INDEX IF NOT EXISTS idx_urbanism_utrs_code ON urbanism_utrs(code);
CREATE INDEX IF NOT EXISTS idx_urbanism_cu_applicant ON urbanism_cu(applicant_id);
CREATE INDEX IF NOT EXISTS idx_urbanism_cu_status ON urbanism_cu(cu_status);
CREATE INDEX IF NOT EXISTS idx_urbanism_ac_applicant ON urbanism_ac(applicant_id);
CREATE INDEX IF NOT EXISTS idx_urbanism_ac_status ON urbanism_ac(ac_status);
CREATE INDEX IF NOT EXISTS idx_urbanism_cns_applicant ON urbanism_cns(applicant_id);

-- Comments
COMMENT ON TABLE urbanism_registers IS 'Registre electronice pentru procese urbanism';
COMMENT ON TABLE urbanism_utrs IS 'Unități Teritoriale de Referință cu regulament urbanistic';
COMMENT ON TABLE urbanism_cu IS 'Certificate de Urbanism eliberate';
COMMENT ON NOT NULL CONSTRAINT urbanism_ac_authorization_type IS 'CONSTRUIRE sau DESFIINTARE';
COMMENT ON TABLE urbanism_cns IS 'Certificate de Nomenclatură Stradală';

-- ============================================
-- AGRICULTURE SERVICE TABLES
-- ============================================

-- Agriculture Households (Cap. 1 - Gospodării)
CREATE TABLE IF NOT EXISTS agriculture_households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_code VARCHAR(30) UNIQUE,
    owner_id UUID NOT NULL,
    owner_name VARCHAR(255),
    address_id UUID REFERENCES addresses(id),
    registration_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agriculture Members (Cap. 1 - Componenta gospodăriei)
CREATE TABLE IF NOT EXISTS agriculture_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL,
    person_id UUID,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cnp VARCHAR(13),
    birth_date DATE,
    member_type VARCHAR(20),
    family_relation VARCHAR(20),
    id_series VARCHAR(20),
    id_number VARCHAR(20),
    id_issue_date DATE,
    id_issued_by VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    observations TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agriculture Parcels (Cap. 2 - Terenuri)
CREATE TABLE IF NOT EXISTS agriculture_parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_number VARCHAR(30),
    household_id UUID NOT NULL,
    owner_id UUID,
    user_id UUID,
    cadastral_number VARCHAR(50),
    land_registry_number VARCHAR(50),
    area NUMERIC(10, 3),
    parcel_category VARCHAR(20),
    usage_type VARCHAR(20),
    irrigation_type VARCHAR(50),
    observations TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agriculture Animals (Cap. 7-8 - Efective animale)
CREATE TABLE IF NOT EXISTS agriculture_animals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL,
    animal_type VARCHAR(30) NOT NULL,
    species VARCHAR(50),
    breed VARCHAR(50),
    tag_number VARCHAR(30),
    passport_number VARCHAR(30),
    birth_date DATE,
    sex VARCHAR(10),
    quantity INTEGER,
    identification_number VARCHAR(50),
    observations TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agriculture Machines (Cap. 9 - Utilaje agricole)
CREATE TABLE IF NOT EXISTS agriculture_machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL,
    machine_type VARCHAR(30) NOT NULL,
    registration_number VARCHAR(20),
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(50),
    registration_date DATE,
    registration_expiry DATE,
    engine_number VARCHAR(50),
    chassis_number VARCHAR(50),
    horse_power INTEGER,
    observations TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agriculture Indexes
CREATE INDEX IF NOT EXISTS idx_agriculture_households_owner ON agriculture_households(owner_id);
CREATE INDEX IF NOT EXISTS idx_agriculture_members_household ON agriculture_members(household_id);
CREATE INDEX IF NOT EXISTS idx_agriculture_parcels_household ON agriculture_parcels(household_id);
CREATE INDEX IF NOT EXISTS idx_agriculture_parcels_cadastral ON agriculture_parcels(cadastral_number);
CREATE INDEX IF NOT EXISTS idx_agriculture_animals_household ON agriculture_animals(household_id);
CREATE INDEX IF NOT EXISTS idx_agriculture_machines_household ON agriculture_machines(household_id);

-- Comments
COMMENT ON TABLE agriculture_households IS 'Gospodării înregistrate în registrul agricol conform HG 1627/2024';
COMMENT ON TABLE agriculture_members IS 'Membrii gospodăriei - componenta familiei';
COMMENT ON TABLE agriculture_parcels IS 'Parcele agricole - suprafețe de teren';
COMMENT ON TABLE agriculture_animals IS 'Efective de animale pe specii și categorii';
COMMENT ON TABLE agriculture_machines IS 'Utilaje agricole înregistrate';

-- ============================================
-- INFRASTRUCTURE SERVICE TABLES
-- ============================================

-- Infrastructure Networks
CREATE TABLE IF NOT EXISTS infrastructure_networks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_type VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    network_status VARCHAR(20) DEFAULT 'ACTIVE',
    total_length NUMERIC(10, 2),
    installation_date DATE,
    technical_specifications TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Infrastructure Assets
CREATE TABLE IF NOT EXISTS infrastructure_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id UUID REFERENCES infrastructure_networks(id),
    asset_type VARCHAR(30) NOT NULL,
    serial_number VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    technical_specifications JSONB,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    installation_date DATE,
    warranty_expiry DATE,
    asset_status VARCHAR(20) DEFAULT 'ACTIVE',
    observations TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Infrastructure Incidents
CREATE TABLE IF NOT EXISTS infrastructure_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id UUID REFERENCES infrastructure_networks(id),
    asset_id UUID REFERENCES infrastructure_assets(id),
    incident_type VARCHAR(30) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    reported_by UUID,
    reported_at TIMESTAMPTZ,
    assigned_to UUID,
    assigned_at TIMESTAMPTZ,
    incident_status VARCHAR(20) DEFAULT 'NEW',
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    observations TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Infrastructure Indexes
CREATE INDEX IF NOT EXISTS idx_infrastructure_networks_type ON infrastructure_networks(network_type);
CREATE INDEX IF NOT EXISTS idx_infrastructure_assets_network ON infrastructure_assets(network_id);
CREATE INDEX IF NOT EXISTS idx_infrastructure_assets_type ON infrastructure_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_infrastructure_incidents_network ON infrastructure_incidents(network_id);
CREATE INDEX IF NOT EXISTS idx_infrastructure_incidents_status ON infrastructure_incidents(incident_status);
CREATE INDEX IF NOT EXISTS idx_infrastructure_incidents_severity ON infrastructure_incidents(severity);

-- Comments
COMMENT ON TABLE infrastructure_networks IS 'Rețele de utilități (apă, canal, electricitate, etc.)';
COMMENT ON TABLE infrastructure_assets IS 'Active/instalații pe rețele (cămine, hidranți, pomp etc.)';
COMMENT ON TABLE infrastructure_incidents IS 'Incidente/avarii raportate pe rețelele de utilități';

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default system roles
INSERT INTO roles (name, description, is_system, is_active) VALUES
    ('ADMIN_SYSTEM', 'Full system administration access', true, true),
    ('ADMIN_PORTAL', 'Portal and user management', true, true),
    ('TAX_INSPECTOR', 'Tax validation and enforcement', true, true),
    ('URBANISM_OFFICER', 'Urbanism certificates and permits', true, true),
    ('AGRICULTURE_OFFICER', 'Agricultural registry management', true, true),
    ('INFRASTRUCTURE_OFFICER', 'Infrastructure management', true, true),
    ('ACCOUNTANT', 'Accounting and payments', true, true),
    ('HR_OFFICER', 'Human resources and payroll', true, true),
    ('DMS_MANAGER', 'Document management', true, true),
    ('CITIZEN', 'Standard citizen access', true, true)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions by module
INSERT INTO permissions (code, name, description, module) VALUES
    -- Auth permissions
    ('AUTH_VIEW', 'View users', 'View user list', 'AUTH'),
    ('AUTH_EDIT', 'Edit users', 'Create/edit users', 'AUTH'),
    ('AUTH_DELETE', 'Delete users', 'Delete users', 'AUTH'),
    ('AUTH_ROLES', 'Manage roles', 'Assign and manage roles', 'AUTH'),
    
    -- Tax permissions
    ('TAX_VIEW', 'View taxes', 'View tax data', 'TAX'),
    ('TAX_EDIT', 'Edit taxes', 'Edit tax declarations', 'TAX'),
    ('TAX_VALIDATE', 'Validate declarations', 'Validate tax declarations', 'TAX'),
    ('TAX_REPORT', 'Tax reports', 'Generate tax reports', 'TAX'),
    ('TAX_ENFORCEMENT', 'Enforcement', 'Manage enforcement cases', 'TAX'),
    
    -- Urbanism permissions
    ('URB_VIEW', 'View urbanism', 'View urbanism data', 'URBANISM'),
    ('URB_EDIT', 'Edit urbanism', 'Edit urbanism documents', 'URBANISM'),
    ('URB_VALIDATE', 'Validate certificates', 'Validate CU/AC/CNS', 'URBANISM'),
    ('URB_REPORT', 'Urbanism reports', 'Generate reports', 'URBANISM'),
    
    -- Agriculture permissions
    ('AGR_VIEW', 'View agriculture', 'View agricultural data', 'AGRICULTURE'),
    ('AGR_EDIT', 'Edit agriculture', 'Edit registry data', 'AGRICULTURE'),
    ('AGR_CERTIFICATES', 'Issue certificates', 'Generate certificates', 'AGRICULTURE'),
    
    -- Infrastructure permissions
    ('INFRA_VIEW', 'View infrastructure', 'View infrastructure', 'INFRASTRUCTURE'),
    ('INFRA_EDIT', 'Edit infrastructure', 'Edit infrastructure data', 'INFRASTRUCTURE'),
    ('INFRA_INTERVENTIONS', 'Manage interventions', 'Record interventions', 'INFRASTRUCTURE'),
    
    -- ERP permissions
    ('ERP_VIEW', 'View ERP data', 'View financial data', 'ERP'),
    ('ERP_EDIT', 'Edit ERP data', 'Edit financial records', 'ERP'),
    ('ERP_APPROVE', 'Approve documents', 'Approve financial documents', 'ERP'),
    ('ERP_REPORT', 'ERP reports', 'Generate financial reports', 'ERP'),
    
    -- DMS permissions
    ('DMS_VIEW', 'View documents', 'View documents', 'DMS'),
    ('DMS_EDIT', 'Edit documents', 'Upload/edit documents', 'DMS'),
    ('DMS_DELETE', 'Delete documents', 'Delete documents', 'DMS'),
    ('DMS_WORKFLOW', 'Manage workflows', 'Manage workflow processes', 'DMS')
ON CONFLICT (code) DO NOTHING;

-- Assign all permissions to ADMIN_SYSTEM role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ADMIN_SYSTEM'
ON CONFLICT DO NOTHING;

-- Create admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Default password hash for 'admin123' using bcrypt
INSERT INTO users (email, password_hash, first_name, last_name, user_type, is_active, email_verified)
VALUES (
    'admin@pdi.ro',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lh3NU9YcW8W8qV8W6', -- admin123
    'Admin',
    'PDI',
    'EMPLOYEE',
    true,
    true
)
ON CONFLICT (email) DO NOTHING;

-- Assign ADMIN_SYSTEM role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'admin@pdi.ro' AND r.name = 'ADMIN_SYSTEM'
AND NOT EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = u.id AND ur.role_id = r.id
);

-- ============================================
-- DMS (DOCUMENT MANAGEMENT) TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS dms_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES dms_folders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500),
    owner_id UUID REFERENCES users(id),
    metadata JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dms_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folder_id UUID REFERENCES dms_folders(id) ON DELETE SET NULL,
    document_type VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size BIGINT DEFAULT 0,
    content_type VARCHAR(100),
    checksum VARCHAR(64),
    version INTEGER DEFAULT 1,
    document_status VARCHAR(20) DEFAULT 'DRAFT',
    owner_id UUID REFERENCES users(id),
    description TEXT,
    tags TEXT,
    retention_date TIMESTAMPTZ,
    retention_policy VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dms_document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES dms_documents(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    created_by UUID REFERENCES users(id),
    change_description TEXT,
    checksum VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dms_document_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES dms_documents(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    is_indexable BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dms_folders_parent ON dms_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_dms_folders_owner ON dms_folders(owner_id);
CREATE INDEX IF NOT EXISTS idx_dms_documents_folder ON dms_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_dms_documents_status ON dms_documents(document_status);
CREATE INDEX IF NOT EXISTS idx_dms_documents_owner ON dms_documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_dms_documents_type ON dms_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_dms_document_versions_doc ON dms_document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_dms_metadata_doc ON dms_document_metadata(document_id);
CREATE INDEX IF NOT EXISTS idx_dms_metadata_key ON dms_document_metadata(key);

-- ============================================
-- DMS WORKFLOW TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS dms_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    workflow_type VARCHAR(50),
    workflow_status VARCHAR(20) DEFAULT 'ACTIVE',
    bpmn_definition TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dms_workflow_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES dms_workflows(id),
    document_id UUID REFERENCES dms_documents(id),
    instance_status VARCHAR(20) DEFAULT 'PENDING',
    current_task VARCHAR(100),
    started_by UUID REFERENCES users(id),
    completed_by UUID REFERENCES users(id),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    variables JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dms_workflow_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instance_id UUID NOT NULL REFERENCES dms_workflow_instances(id),
    task_name VARCHAR(100) NOT NULL,
    task_type VARCHAR(50),
    task_status VARCHAR(20) DEFAULT 'PENDING',
    assigned_to UUID REFERENCES users(id),
    completed_by UUID REFERENCES users(id),
    due_date TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    comments TEXT,
    task_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dms_workflows_type ON dms_workflows(workflow_type);
CREATE INDEX IF NOT EXISTS idx_dms_instances_workflow ON dms_workflow_instances(workflow_id);
CREATE INDEX IF NOT EXISTS idx_dms_instances_doc ON dms_workflow_instances(document_id);
CREATE INDEX IF NOT EXISTS idx_dms_instances_status ON dms_workflow_instances(instance_status);
CREATE INDEX IF NOT EXISTS idx_dms_tasks_instance ON dms_workflow_tasks(instance_id);
CREATE INDEX IF NOT EXISTS idx_dms_tasks_assignee ON dms_workflow_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_dms_tasks_status ON dms_workflow_tasks(task_status);

-- ============================================
-- ERP BUDGET TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS erp_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    source_code VARCHAR(20),
    classification_code VARCHAR(30),
    chapter VARCHAR(10),
    article VARCHAR(10),
    paragraph VARCHAR(10),
    authorized_credit NUMERIC(15, 2),
    budgetary_credit NUMERIC(15, 2),
    revised_credit NUMERIC(15, 2),
    status VARCHAR(20) DEFAULT 'DRAFT',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_budget_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL REFERENCES erp_budgets(id),
    alop_phase VARCHAR(20),
    commitment_number VARCHAR(50),
    commitment_date DATE,
    liquidation_number VARCHAR(50),
    liquidation_date DATE,
    order_number VARCHAR(50),
    order_date DATE,
    payment_number VARCHAR(50),
    payment_date DATE,
    amount NUMERIC(15, 2),
    beneficiary_id UUID REFERENCES users(id),
    contract_id UUID,
    invoice_id UUID,
    expense_purpose TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ERP ACCOUNTING TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS erp_accounting_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal VARCHAR(20),
    entry_date DATE NOT NULL,
    document_number VARCHAR(50),
    document_type VARCHAR(50),
    description TEXT,
    total_debit NUMERIC(15, 2),
    total_credit NUMERIC(15, 2),
    is_posted BOOLEAN DEFAULT false,
    posted_at TIMESTAMPTZ,
    is_reversed BOOLEAN DEFAULT false,
    reversed_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_accounting_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_id UUID NOT NULL REFERENCES erp_accounting_entries(id),
    account_code VARCHAR(20) NOT NULL,
    debit_amount NUMERIC(15, 2),
    credit_amount NUMERIC(15, 2),
    partner_id UUID,
    document_ref VARCHAR(100),
    currency_code VARCHAR(3),
    currency_rate NUMERIC(10, 4),
    analytic_account VARCHAR(50),
    cost_center VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ERP HR TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS erp_hr_employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cnp VARCHAR(13) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    id_card_number VARCHAR(20),
    id_card_issued_by VARCHAR(100),
    id_card_date DATE,
    employment_type VARCHAR(20),
    position VARCHAR(100),
    department VARCHAR(100),
    contract_number VARCHAR(50),
    contract_type VARCHAR(50),
    hire_date DATE,
    termination_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    base_salary NUMERIC(10, 2),
    grade INTEGER,
    work_schedule VARCHAR(20),
    manager_id UUID REFERENCES erp_hr_employees(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_hr_payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES erp_hr_employees(id),
    period DATE NOT NULL,
    base_salary NUMERIC(10, 2),
    overtime_hours INTEGER,
    overtime_pay NUMERIC(10, 2),
    bonuses JSONB,
    gross_salary NUMERIC(10, 2),
    income_tax NUMERIC(10, 2),
    cas NUMERIC(10, 2),
    cass NUMERIC(10, 2),
    cam NUMERIC(10, 2),
    other_deductions NUMERIC(10, 2),
    net_salary NUMERIC(10, 2),
    advance_amount NUMERIC(10, 2),
    settlement_amount NUMERIC(10, 2),
    status VARCHAR(20) DEFAULT 'DRAFT',
    payment_date DATE,
    payment_method VARCHAR(20),
    bank_transfer_id VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ERP INVENTORY TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS erp_inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    unit_of_measure VARCHAR(20),
    quantity NUMERIC(15, 3),
    unit_price NUMERIC(15, 2),
    total_value NUMERIC(15, 2),
    inventory_method VARCHAR(20) DEFAULT 'FIFO',
    warehouse_id UUID,
    min_stock NUMERIC(15, 3),
    max_stock NUMERIC(15, 3),
    reorder_point NUMERIC(15, 3),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_fixed_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_number VARCHAR(50) UNIQUE NOT NULL,
    serial_number VARCHAR(50),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    asset_category VARCHAR(50),
    acquisition_date DATE,
    acquisition_value NUMERIC(15, 2),
    residual_value NUMERIC(15, 2),
    depreciable_value NUMERIC(15, 2),
    useful_life_years INTEGER,
    depreciation_rate NUMERIC(5, 2),
    current_depreciation NUMERIC(15, 2),
    accumulated_depreciation NUMERIC(15, 2),
    book_value NUMERIC(15, 2),
    depreciation_method VARCHAR(20) DEFAULT 'LINEAR',
    location VARCHAR(200),
    responsible_person_id UUID,
    supplier VARCHAR(200),
    invoice_number VARCHAR(50),
    warranty_expiry DATE,
    last_revaluation_date DATE,
    revaluation_value NUMERIC(15, 2),
    status VARCHAR(20) DEFAULT 'IN_USE',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_erp_budgets_year ON erp_budgets(year);
CREATE INDEX IF NOT EXISTS idx_erp_budgets_source ON erp_budgets(source_code);
CREATE INDEX IF NOT EXISTS idx_erp_executions_budget ON erp_budget_executions(budget_id);
CREATE INDEX IF NOT EXISTS idx_erp_entries_date ON erp_accounting_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_erp_entries_posted ON erp_accounting_entries(is_posted);
CREATE INDEX IF NOT EXISTS idx_erp_lines_entry ON erp_accounting_lines(entry_id);
CREATE INDEX IF NOT EXISTS idx_erp_employees_cnp ON erp_hr_employees(cnp);
CREATE INDEX IF NOT EXISTS idx_erp_employees_dept ON erp_hr_employees(department);
CREATE INDEX IF NOT EXISTS idx_erp_payroll_employee ON erp_hr_payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_erp_payroll_period ON erp_hr_payroll(period);
CREATE INDEX IF NOT EXISTS idx_erp_items_code ON erp_inventory_items(code);
CREATE INDEX IF NOT EXISTS idx_erp_items_category ON erp_inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_erp_assets_number ON erp_fixed_assets(inventory_number);
CREATE INDEX IF NOT EXISTS idx_erp_assets_category ON erp_fixed_assets(asset_category);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'Users of the PDI platform - citizens, companies, and employees';
COMMENT ON TABLE roles IS 'System roles for RBAC';
COMMENT ON TABLE permissions IS 'Granular permissions for access control';
COMMENT ON TABLE sessions IS 'Active user sessions for JWT token management';
COMMENT ON TABLE audit_trail IS 'Comprehensive audit log for all system actions';
COMMENT ON TABLE addresses IS 'Shared address table used by multiple services';
COMMENT ON TABLE dms_folders IS 'DMS folder structure for document organization';
COMMENT ON TABLE dms_documents IS 'DMS document metadata and references';
COMMENT ON TABLE dms_document_versions IS 'DMS document version history';
COMMENT ON TABLE dms_document_metadata IS 'DMS document indexed metadata';
COMMENT ON TABLE dms_workflows IS 'DMS workflow definitions (BPMN)';
COMMENT ON TABLE dms_workflow_instances IS 'DMS workflow active instances';
COMMENT ON TABLE dms_workflow_tasks IS 'DMS workflow tasks assigned to users';