-- PDI Platform Database Initialization Script
-- Creates tables, roles and default users

-- Enable UUID and PostGIS extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Note: Using VARCHAR instead of PostgreSQL ENUM for Hibernate compatibility

-- ============================================
-- CREATE TABLES FIRST
-- ============================================

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    cnp VARCHAR(13) UNIQUE,
    user_type VARCHAR(30) DEFAULT 'PERSON',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- Role Permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_code VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cnp ON users(cnp);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- ============================================
-- DEFAULT ROLES
-- ============================================
INSERT INTO roles (id, name, description, is_system, is_active, created_at, updated_at)
VALUES 
    (uuid_generate_v4(), 'ADMIN', 'Administrator sistem', true, true, NOW(), NOW()),
    (uuid_generate_v4(), 'EMPLOYEE', 'Angajat primarie', true, true, NOW(), NOW()),
    (uuid_generate_v4(), 'CITIZEN', 'Cetatean', true, true, NOW(), NOW()),
    (uuid_generate_v4(), 'ACCOUNTANT', 'Contabil', true, true, NOW(), NOW()),
    (uuid_generate_v4(), 'URBANISM', 'Specialist urbanism', true, true, NOW(), NOW()),
    (uuid_generate_v4(), 'AGRICULTURE', 'Specialist agricultura', true, true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- DEFAULT USERS
-- ============================================

-- 1. ADMIN - Sistem
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, cnp, user_type, is_active, email_verified, phone_verified, two_factor_enabled, created_at, updated_at)
VALUES 
    (uuid_generate_v4(), 'admin@pdi.ro', '$2a$10$lJgMyAqTDH527uqtbekR.utrOY5/1Zfj6tmj07SNrhVeJx5c9JHwe', 'Administrator', 'Sistem', '+40712345678', '1801011234567', 'PERSON', true, true, false, false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 2. EMPLOYEE - Primarie Nucet
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, cnp, user_type, is_active, email_verified, phone_verified, two_factor_enabled, created_at, updated_at)
VALUES 
    (uuid_generate_v4(), 'ion.popescu@primarianucet.ro', '$2a$10$lJgMyAqTDH527uqtbekR.utrOY5/1Zfj6tmj07SNrhVeJx5c9JHwe', 'Ion', 'Popescu', '+40723456789', '1801011234568', 'PERSON', true, true, false, false, NOW(), NOW()),
    (uuid_generate_v4(), 'maria.iliescu@primarianucet.ro', '$2a$10$lJgMyAqTDH527uqtbekR.utrOY5/1Zfj6tmj07SNrhVeJx5c9JHwe', 'Maria', 'Iliescu', '+40723456790', '1801011234569', 'PERSON', true, true, false, false, NOW(), NOW()),
    (uuid_generate_v4(), 'george.dumitrescu@primarianucet.ro', '$2a$10$lJgMyAqTDH527uqtbekR.utrOY5/1Zfj6tmj07SNrhVeJx5c9JHwe', 'George', 'Dumitrescu', '+40723456791', '1801011234570', 'PERSON', true, true, false, false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 3. ACCOUNTANT - Contabil
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, cnp, user_type, is_active, email_verified, phone_verified, two_factor_enabled, created_at, updated_at)
VALUES 
    (uuid_generate_v4(), 'elena.stancu@primarianucet.ro', '$2a$10$lJgMyAqTDH527uqtbekR.utrOY5/1Zfj6tmj07SNrhVeJx5c9JHwe', 'Elena', 'Stancu', '+40723456792', '1801011234571', 'PERSON', true, true, false, false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 4. CITIZENS - Cetateni Nucet
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, cnp, user_type, is_active, email_verified, phone_verified, two_factor_enabled, created_at, updated_at)
VALUES 
    (uuid_generate_v4(), 'vasile.ion@example.com', '$2a$10$lJgMyAqTDH527uqtbekR.utrOY5/1Zfj6tmj07SNrhVeJx5c9JHwe', 'Vasile', 'Ion', '+40734567890', '1801011234572', 'PERSON', true, true, false, false, NOW(), NOW()),
    (uuid_generate_v4(), 'gheorghe.petrescu@example.com', '$2a$10$lJgMyAqTDH527uqtbekR.utrOY5/1Zfj6tmj07SNrhVeJx5c9JHwe', 'Gheorghe', 'Petrescu', '+40734567891', '1801011234573', 'PERSON', true, true, false, false, NOW(), NOW()),
    (uuid_generate_v4(), 'floarea.georgescu@example.com', '$2a$10$lJgMyAqTDH527uqtbekR.utrOY5/1Zfj6tmj07SNrhVeJx5c9JHwe', 'Floarea', 'Georgescu', '+40734567892', '1801011234574', 'PERSON', true, true, false, false, NOW(), NOW()),
    (uuid_generate_v4(), 'default@citizen.ro', '$2a$10$lJgMyAqTDH527uqtbekR.utrOY5/1Zfj6tmj07SNrhVeJx5c9JHwe', 'Cetatean', 'Demo', '+40730000000', '1801011200001', 'PERSON', true, true, false, false, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Note: All passwords are "Password123!" (hashed with bcrypt)

-- ============================================
-- ASSIGN ROLES TO USERS
-- ============================================

DO $$
DECLARE
    admin_role_id uuid;
    employee_role_id uuid;
    citizen_role_id uuid;
    accountant_role_id uuid;
    urbanism_role_id uuid;
    agriculture_role_id uuid;
    
    admin_user_id uuid;
    ion_user_id uuid;
    maria_user_id uuid;
    george_user_id uuid;
    elena_user_id uuid;
    vasile_user_id uuid;
    gheorghe_user_id uuid;
    floarea_user_id uuid;
    default_citizen_id uuid;
BEGIN
    -- Get role IDs
    SELECT id INTO admin_role_id FROM roles WHERE name = 'ADMIN';
    SELECT id INTO employee_role_id FROM roles WHERE name = 'EMPLOYEE';
    SELECT id INTO citizen_role_id FROM roles WHERE name = 'CITIZEN';
    SELECT id INTO accountant_role_id FROM roles WHERE name = 'ACCOUNTANT';
    SELECT id INTO urbanism_role_id FROM roles WHERE name = 'URBANISM';
    SELECT id INTO agriculture_role_id FROM roles WHERE name = 'AGRICULTURE';
    
    -- Get user IDs
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@pdi.ro';
    SELECT id INTO ion_user_id FROM users WHERE email = 'ion.popescu@primarianucet.ro';
    SELECT id INTO maria_user_id FROM users WHERE email = 'maria.iliescu@primarianucet.ro';
    SELECT id INTO george_user_id FROM users WHERE email = 'george.dumitrescu@primarianucet.ro';
    SELECT id INTO elena_user_id FROM users WHERE email = 'elena.stancu@primarianucet.ro';
    SELECT id INTO vasile_user_id FROM users WHERE email = 'vasile.ion@example.com';
    SELECT id INTO gheorghe_user_id FROM users WHERE email = 'gheorghe.petrescu@example.com';
    SELECT id INTO floarea_user_id FROM users WHERE email = 'floarea.georgescu@example.com';
    SELECT id INTO default_citizen_id FROM users WHERE email = 'default@citizen.ro';
    
    -- Assign roles
    IF admin_user_id IS NOT NULL AND admin_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at) 
        VALUES (admin_user_id, admin_role_id, NOW()) 
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF ion_user_id IS NOT NULL AND employee_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at) 
        VALUES (ion_user_id, employee_role_id, NOW()) 
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF maria_user_id IS NOT NULL AND urbanism_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at) 
        VALUES (maria_user_id, urbanism_role_id, NOW()) 
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF george_user_id IS NOT NULL AND agriculture_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at) 
        VALUES (george_user_id, agriculture_role_id, NOW()) 
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF elena_user_id IS NOT NULL AND accountant_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at) 
        VALUES (elena_user_id, accountant_role_id, NOW()) 
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF vasile_user_id IS NOT NULL AND citizen_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at) 
        VALUES (vasile_user_id, citizen_role_id, NOW()) 
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF gheorghe_user_id IS NOT NULL AND citizen_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at) 
        VALUES (gheorghe_user_id, citizen_role_id, NOW()) 
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF floarea_user_id IS NOT NULL AND citizen_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at) 
        VALUES (floarea_user_id, citizen_role_id, NOW()) 
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF default_citizen_id IS NOT NULL AND citizen_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id, assigned_at) 
        VALUES (default_citizen_id, citizen_role_id, NOW()) 
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ============================================
-- CREATE ADDITIONAL TABLES (not auto-created by Hibernate)
-- ============================================

-- System Settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    setting_key VARCHAR(255) NOT NULL,
    setting_value TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (category, setting_key)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(30),
    priority VARCHAR(20),
    start_date DATE,
    end_date DATE,
    progress INTEGER,
    manager_id UUID,
    manager_name VARCHAR(255),
    budget NUMERIC(15, 2),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Tasks table
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(30),
    priority VARCHAR(20),
    assignee_id UUID,
    assignee_name VARCHAR(255),
    start_date DATE,
    due_date DATE,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    progress INTEGER,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(30),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Time Entries table
CREATE TABLE IF NOT EXISTS project_time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    task_id UUID,
    user_id UUID,
    user_name VARCHAR(255),
    hours NUMERIC(6, 2),
    description TEXT,
    entry_date DATE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Documents table
CREATE TABLE IF NOT EXISTS project_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(500),
    file_size BIGINT,
    status VARCHAR(30),
    uploaded_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- GIS Layers table
CREATE TABLE IF NOT EXISTS gis_layers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    layer_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    visible BOOLEAN DEFAULT true NOT NULL,
    min_zoom INTEGER,
    max_zoom INTEGER,
    style TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- GIS Features table
CREATE TABLE IF NOT EXISTS gis_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    layer_id VARCHAR(100) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geometry_geojson TEXT,
    properties_json TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_time_entries_project_id ON project_time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_project_documents_project_id ON project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_gis_layers_layer_id ON gis_layers(layer_id);
CREATE INDEX IF NOT EXISTS idx_gis_features_layer_id ON gis_features(layer_id);

-- ============================================
-- CREATE TABLES FOR SERVICE ENTITIES
-- (Normally created by Hibernate ddl-auto, but
--  needed here because seed data runs first)
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
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tax Properties
CREATE TABLE IF NOT EXISTS tax_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_type VARCHAR(20) NOT NULL,
    owner_id UUID NOT NULL,
    address_id UUID,
    cadastral_number VARCHAR(50),
    land_registry_number VARCHAR(50),
    area NUMERIC(12, 3),
    construction_year INTEGER,
    zone VARCHAR(10),
    street_zone_multiplier NUMERIC(5, 2),
    property_value NUMERIC(15, 2),
    yards_area NUMERIC(10, 2),
    is_exempt BOOLEAN NOT NULL DEFAULT false,
    exemption_reason VARCHAR(500),
    exemption_start_date TIMESTAMP,
    exemption_end_date TIMESTAMP,
    additional_data JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tax Liabilities
CREATE TABLE IF NOT EXISTS tax_liabilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contributor_id UUID NOT NULL,
    property_id UUID,
    tax_type VARCHAR(30) NOT NULL,
    tax_year INTEGER NOT NULL,
    tax_period VARCHAR(10),
    category_id UUID,
    gross_tax NUMERIC(15, 2) NOT NULL,
    exemption_amount NUMERIC(15, 2) DEFAULT 0,
    discount_amount NUMERIC(15, 2) DEFAULT 0,
    net_tax NUMERIC(15, 2) NOT NULL,
    penalty_amount NUMERIC(15, 2) DEFAULT 0,
    total_due NUMERIC(15, 2) NOT NULL,
    paid_amount NUMERIC(15, 2) DEFAULT 0,
    remaining_amount NUMERIC(15, 2) DEFAULT 0,
    liability_status VARCHAR(20) NOT NULL DEFAULT 'DUE',
    due_date DATE,
    settlement_date DATE,
    supersolva_balance NUMERIC(15, 2) DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tax Payments
CREATE TABLE IF NOT EXISTS tax_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_number VARCHAR(30) UNIQUE,
    contributor_id UUID NOT NULL,
    property_id UUID,
    tax_liability_id UUID,
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
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    processed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tax Declarations
CREATE TABLE IF NOT EXISTS tax_declarations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    declaration_number VARCHAR(30) UNIQUE,
    contributor_id UUID NOT NULL,
    property_id UUID,
    declaration_type VARCHAR(30) NOT NULL,
    declaration_status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    tax_year INTEGER,
    declaration_data JSONB,
    calculated_tax NUMERIC(15, 2),
    observations TEXT,
    submitted_at TIMESTAMP,
    validated_at TIMESTAMP,
    validated_by UUID,
    rejection_reason VARCHAR(500),
    document_path VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agriculture Households
CREATE TABLE IF NOT EXISTS agriculture_households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_code VARCHAR(30) UNIQUE,
    owner_id UUID NOT NULL,
    owner_name VARCHAR(255),
    address_id UUID,
    registration_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agriculture Parcels
CREATE TABLE IF NOT EXISTS agriculture_parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parcel_number VARCHAR(30),
    household_id UUID,
    owner_id UUID,
    user_id UUID,
    cadastral_number VARCHAR(50),
    land_registry_number VARCHAR(50),
    area NUMERIC(10, 3),
    category VARCHAR(20),
    usage_type VARCHAR(20),
    irrigation_type VARCHAR(50),
    observations TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agriculture Members
CREATE TABLE IF NOT EXISTS agriculture_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL,
    person_id UUID,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cnp VARCHAR(13),
    birth_date DATE,
    type VARCHAR(20),
    relation VARCHAR(20),
    id_series VARCHAR(20),
    id_number VARCHAR(20),
    id_issue_date DATE,
    id_issued_by VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    observations TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Agriculture Animals
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
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Agriculture Machines
CREATE TABLE IF NOT EXISTS agriculture_machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL,
    machine_type VARCHAR(30) NOT NULL,
    registration_number VARCHAR(20),
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(50),
    registration_date DATE,
    "registrationExpiry" DATE,
    engine_number VARCHAR(50),
    chassis_number VARCHAR(50),
    horse_power INTEGER,
    observations TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Infrastructure Assets
CREATE TABLE IF NOT EXISTS infrastructure_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id UUID,
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
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Infrastructure Incidents
CREATE TABLE IF NOT EXISTS infrastructure_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id UUID,
    asset_id UUID,
    incident_type VARCHAR(30) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    reported_by UUID,
    reported_at TIMESTAMP,
    assigned_to UUID,
    assigned_at TIMESTAMP,
    incident_status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    observations TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ERP Employees
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
    manager_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ERP Budgets
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
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ERP Accounting Entries
CREATE TABLE IF NOT EXISTS erp_accounting_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal VARCHAR(20),
    entry_date DATE NOT NULL,
    document_number VARCHAR(50),
    document_type VARCHAR(50),
    description TEXT,
    total_debit NUMERIC(15, 2),
    total_credit NUMERIC(15, 2),
    is_posted BOOLEAN NOT NULL DEFAULT false,
    posted_at TIMESTAMP,
    is_reversed BOOLEAN NOT NULL DEFAULT false,
    reversed_by UUID,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ERP Inventory Items
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
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- DMS Folders
CREATE TABLE IF NOT EXISTS dms_folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID,
    name VARCHAR(255) NOT NULL,
    path VARCHAR(500),
    owner_id UUID,
    metadata JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- DMS Documents
CREATE TABLE IF NOT EXISTS dms_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    folder_id UUID,
    document_type VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_size BIGINT,
    content_type VARCHAR(100),
    checksum VARCHAR(64),
    version INTEGER DEFAULT 1,
    document_status VARCHAR(20) DEFAULT 'DRAFT',
    owner_id UUID,
    description TEXT,
    tags TEXT,
    retention_date TIMESTAMP,
    retention_policy VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Urbanism UTR Zones
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
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Urbanism Registers
CREATE TABLE IF NOT EXISTS urbanism_registers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    register_type VARCHAR(20) NOT NULL,
    register_number VARCHAR(30),
    session_date DATE,
    register_status VARCHAR(20) DEFAULT 'OPEN',
    observations TEXT,
    total_records INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Urbanism Certificates (CU)
CREATE TABLE IF NOT EXISTS urbanism_cu (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cu_number VARCHAR(30) UNIQUE,
    register_id UUID,
    applicant_id UUID NOT NULL,
    utr_id UUID,
    address_id UUID,
    application_date DATE,
    issue_date DATE,
    expiry_date DATE,
    cu_status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    purpose TEXT,
    legal_regime VARCHAR(500),
    urbanism_certificate_type VARCHAR(50),
    content TEXT,
    conditions TEXT,
    observations TEXT,
    issued_by UUID,
    tax_amount NUMERIC(15, 2),
    tax_paid BOOLEAN NOT NULL DEFAULT false,
    document_path VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Urbanism Authorizations (AC)
CREATE TABLE IF NOT EXISTS urbanism_ac (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ac_number VARCHAR(30) UNIQUE,
    cu_id UUID,
    register_id UUID,
    applicant_id UUID NOT NULL,
    utr_id UUID,
    authorization_type VARCHAR(20) NOT NULL,
    application_date DATE,
    issue_date DATE,
    expiry_date DATE,
    ac_status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
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
    tax_paid BOOLEAN NOT NULL DEFAULT false,
    document_path VARCHAR(500),
    completion_date DATE,
    receiving_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SEED DATA FOR ALL SERVICES
-- ============================================

DO $$
DECLARE
    -- User IDs (looked up from seeded users)
    v_admin_id UUID;
    v_ion_id UUID;
    v_maria_id UUID;
    v_george_id UUID;
    v_elena_id UUID;
    v_vasile_id UUID;
    v_gheorghe_id UUID;
    v_floarea_id UUID;

    -- Fixed UUIDs for Tax Categories
    v_cat_cladiri UUID := 'a0000001-0000-0000-0000-000000000001';
    v_cat_teren UUID := 'a0000001-0000-0000-0000-000000000002';
    v_cat_auto UUID := 'a0000001-0000-0000-0000-000000000003';
    v_cat_salubrizare UUID := 'a0000001-0000-0000-0000-000000000004';

    -- Fixed UUIDs for Tax Properties
    v_prop1 UUID := 'a0000002-0000-0000-0000-000000000001';
    v_prop2 UUID := 'a0000002-0000-0000-0000-000000000002';
    v_prop3 UUID := 'a0000002-0000-0000-0000-000000000003';
    v_prop4 UUID := 'a0000002-0000-0000-0000-000000000004';

    -- Fixed UUIDs for Tax Liabilities
    v_liab1 UUID := 'a0000003-0000-0000-0000-000000000001';
    v_liab2 UUID := 'a0000003-0000-0000-0000-000000000002';
    v_liab3 UUID := 'a0000003-0000-0000-0000-000000000003';
    v_liab4 UUID := 'a0000003-0000-0000-0000-000000000004';
    v_liab5 UUID := 'a0000003-0000-0000-0000-000000000005';

    -- Fixed UUIDs for Agriculture Households
    v_hh1 UUID := 'b0000001-0000-0000-0000-000000000001';
    v_hh2 UUID := 'b0000001-0000-0000-0000-000000000002';
    v_hh3 UUID := 'b0000001-0000-0000-0000-000000000003';

    -- Fixed UUIDs for Infrastructure Networks
    v_net_water UUID := 'c0000001-0000-0000-0000-000000000001';
    v_net_sewer UUID := 'c0000001-0000-0000-0000-000000000002';
    v_net_elec UUID := 'c0000001-0000-0000-0000-000000000003';

    -- Fixed UUIDs for Infrastructure Assets
    v_asset1 UUID := 'c0000002-0000-0000-0000-000000000001';
    v_asset2 UUID := 'c0000002-0000-0000-0000-000000000002';
    v_asset3 UUID := 'c0000002-0000-0000-0000-000000000003';
    v_asset4 UUID := 'c0000002-0000-0000-0000-000000000004';
    v_asset5 UUID := 'c0000002-0000-0000-0000-000000000005';

    -- Fixed UUIDs for DMS Folders
    v_folder1 UUID := 'd0000001-0000-0000-0000-000000000001';
    v_folder2 UUID := 'd0000001-0000-0000-0000-000000000002';
    v_folder3 UUID := 'd0000001-0000-0000-0000-000000000003';

    -- Fixed UUIDs for Urbanism UTRs
    v_utr1 UUID := 'e0000001-0000-0000-0000-000000000001';
    v_utr2 UUID := 'e0000001-0000-0000-0000-000000000002';
    v_utr3 UUID := 'e0000001-0000-0000-0000-000000000003';
    v_utr4 UUID := 'e0000001-0000-0000-0000-000000000004';

    -- Fixed UUIDs for Urbanism Registers
    v_ureg1 UUID := 'e0000002-0000-0000-0000-000000000001';
    v_ureg2 UUID := 'e0000002-0000-0000-0000-000000000002';
    v_ureg3 UUID := 'e0000002-0000-0000-0000-000000000003';

    -- Fixed UUIDs for Urbanism Certificates
    v_cu1 UUID := 'e0000003-0000-0000-0000-000000000001';
    v_cu2 UUID := 'e0000003-0000-0000-0000-000000000002';
    v_cu3 UUID := 'e0000003-0000-0000-0000-000000000003';

    -- Fixed UUIDs for Urbanism Authorizations
    v_ac1 UUID := 'e0000004-0000-0000-0000-000000000001';
    v_ac2 UUID := 'e0000004-0000-0000-0000-000000000002';
    v_ac3 UUID := 'e0000004-0000-0000-0000-000000000003';

    -- Fixed UUIDs for Projects
    v_proj1 UUID := 'f0000001-0000-0000-0000-000000000001';
    v_proj2 UUID := 'f0000001-0000-0000-0000-000000000002';
    v_proj3 UUID := 'f0000001-0000-0000-0000-000000000003';

    -- Fixed UUIDs for ERP Employees
    v_emp1 UUID := 'f1000001-0000-0000-0000-000000000001';
    v_emp2 UUID := 'f1000001-0000-0000-0000-000000000002';
    v_emp3 UUID := 'f1000001-0000-0000-0000-000000000003';
    v_emp4 UUID := 'f1000001-0000-0000-0000-000000000004';
    v_emp5 UUID := 'f1000001-0000-0000-0000-000000000005';

    -- Fixed UUIDs for ERP Budgets
    v_bud1 UUID := 'f1000002-0000-0000-0000-000000000001';
    v_bud2 UUID := 'f1000002-0000-0000-0000-000000000002';

    -- Fixed UUIDs for GIS Layers
    v_layer1 UUID := 'f2000001-0000-0000-0000-000000000001';
    v_layer2 UUID := 'f2000001-0000-0000-0000-000000000002';
    v_layer3 UUID := 'f2000001-0000-0000-0000-000000000003';
    v_layer4 UUID := 'f2000001-0000-0000-0000-000000000004';
    v_layer5 UUID := 'f2000001-0000-0000-0000-000000000005';
    v_layer6 UUID := 'f2000001-0000-0000-0000-000000000006';

BEGIN
    -- Look up user IDs
    SELECT id INTO v_admin_id FROM users WHERE email = 'admin@pdi.ro';
    SELECT id INTO v_ion_id FROM users WHERE email = 'ion.popescu@primarianucet.ro';
    SELECT id INTO v_maria_id FROM users WHERE email = 'maria.iliescu@primarianucet.ro';
    SELECT id INTO v_george_id FROM users WHERE email = 'george.dumitrescu@primarianucet.ro';
    SELECT id INTO v_elena_id FROM users WHERE email = 'elena.stancu@primarianucet.ro';
    SELECT id INTO v_vasile_id FROM users WHERE email = 'vasile.ion@example.com';
    SELECT id INTO v_gheorghe_id FROM users WHERE email = 'gheorghe.petrescu@example.com';
    SELECT id INTO v_floarea_id FROM users WHERE email = 'floarea.georgescu@example.com';

    -- ============================================
    -- 1. SYSTEM SETTINGS
    -- ============================================
    INSERT INTO system_settings (id, category, setting_key, setting_value, is_active, created_at, updated_at) VALUES
        (uuid_generate_v4(), 'institution', 'name', 'Primaria Comunei Nucet', true, NOW(), NOW()),
        (uuid_generate_v4(), 'institution', 'cui', '4567890', true, NOW(), NOW()),
        (uuid_generate_v4(), 'institution', 'address', 'Str. Principala Nr. 1, Nucet, Dambovita', true, NOW(), NOW()),
        (uuid_generate_v4(), 'institution', 'phone', '0245123456', true, NOW(), NOW()),
        (uuid_generate_v4(), 'institution', 'email', 'primaria@nucet.ro', true, NOW(), NOW()),
        (uuid_generate_v4(), 'notifications', 'emailEnabled', 'true', true, NOW(), NOW()),
        (uuid_generate_v4(), 'notifications', 'smsEnabled', 'false', true, NOW(), NOW()),
        (uuid_generate_v4(), 'notifications', 'pushEnabled', 'true', true, NOW(), NOW()),
        (uuid_generate_v4(), 'security', 'sessionTimeout', '30', true, NOW(), NOW()),
        (uuid_generate_v4(), 'security', 'require2FA', 'false', true, NOW(), NOW()),
        (uuid_generate_v4(), 'security', 'minPasswordLength', '8', true, NOW(), NOW())
    ON CONFLICT (category, setting_key) DO NOTHING;

    -- ============================================
    -- 2. TAX SERVICE SEED DATA
    -- ============================================

    -- Tax Categories
    INSERT INTO tax_categories (id, code, name, tax_type, tax_rate, calculation_method, valid_from, is_active, created_at, updated_at) VALUES
        (v_cat_cladiri, 'IMPOZIT_CLADIRI', 'Impozit pe Cladiri', 'BUILDING', 0.0800, 'PERCENTAGE', '2024-01-01', true, NOW(), NOW()),
        (v_cat_teren, 'IMPOZIT_TEREN', 'Impozit pe Teren', 'LAND', 0.0000, 'FORMULA', '2024-01-01', true, NOW(), NOW()),
        (v_cat_auto, 'IMPOZIT_AUTO', 'Impozit pe Mijloace de Transport', 'VEHICLE', 0.0000, 'FORMULA', '2024-01-01', true, NOW(), NOW()),
        (v_cat_salubrizare, 'TAXA_SALUBRIZARE', 'Taxa de Salubrizare', 'OTHER', 0.0000, 'FIXED', '2024-01-01', true, NOW(), NOW())
    ON CONFLICT (code) DO NOTHING;

    -- Tax Properties (2 buildings, 1 land, 1 vehicle)
    INSERT INTO tax_properties (id, property_type, owner_id, cadastral_number, land_registry_number, area, construction_year, zone, property_value, is_exempt, is_active, created_at, updated_at) VALUES
        (v_prop1, 'CLADIRE', v_vasile_id, '12345', 'CF-1001', 120.000, 1985, 'A', 180000.00, false, true, NOW(), NOW()),
        (v_prop2, 'CLADIRE', v_gheorghe_id, '12346', 'CF-1002', 95.500, 2010, 'B', 320000.00, false, true, NOW(), NOW()),
        (v_prop3, 'TEREN', v_vasile_id, '12347', 'CF-1003', 2500.000, NULL, 'C', 75000.00, false, true, NOW(), NOW()),
        (v_prop4, 'AUTO', v_floarea_id, NULL, NULL, NULL, 2018, NULL, 45000.00, false, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Tax Liabilities (mix of PAID, DUE, OVERDUE)
    INSERT INTO tax_liabilities (id, contributor_id, property_id, tax_type, tax_year, tax_period, category_id, gross_tax, exemption_amount, discount_amount, net_tax, penalty_amount, total_due, paid_amount, remaining_amount, liability_status, due_date, settlement_date, is_active, created_at, updated_at) VALUES
        (v_liab1, v_vasile_id, v_prop1, 'IMPOZIT_CLADIRE', 2024, 'ANUAL', v_cat_cladiri, 1440.00, 0.00, 144.00, 1296.00, 0.00, 1296.00, 1296.00, 0.00, 'PAID', '2024-03-31', '2024-03-15', true, NOW(), NOW()),
        (v_liab2, v_gheorghe_id, v_prop2, 'IMPOZIT_CLADIRE', 2024, 'ANUAL', v_cat_cladiri, 2560.00, 0.00, 0.00, 2560.00, 0.00, 2560.00, 2560.00, 0.00, 'PAID', '2024-03-31', '2024-03-28', true, NOW(), NOW()),
        (v_liab3, v_vasile_id, v_prop3, 'IMPOZIT_TEREN', 2024, 'ANUAL', v_cat_teren, 375.00, 0.00, 0.00, 375.00, 0.00, 375.00, 0.00, 375.00, 'DUE', '2024-09-30', NULL, true, NOW(), NOW()),
        (v_liab4, v_floarea_id, v_prop4, 'IMPOZIT_AUTO', 2025, 'ANUAL', v_cat_auto, 810.00, 0.00, 0.00, 810.00, 0.00, 810.00, 400.00, 410.00, 'PARTIAL_PAID', '2025-03-31', NULL, true, NOW(), NOW()),
        (v_liab5, v_vasile_id, v_prop1, 'IMPOZIT_CLADIRE', 2025, 'ANUAL', v_cat_cladiri, 1440.00, 0.00, 0.00, 1440.00, 72.00, 1512.00, 0.00, 1512.00, 'OVERDUE', '2025-03-31', NULL, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Tax Payments
    INSERT INTO tax_payments (id, payment_number, contributor_id, property_id, tax_liability_id, payment_type, payment_method, payment_date, amount, penalty_amount, discount_amount, total_amount, receipt_number, payment_status, created_at) VALUES
        ('a0000004-0000-0000-0000-000000000001', 'PAY-2024-001', v_vasile_id, v_prop1, v_liab1, 'IMPOZIT_CLADIRE', 'NUMERAR', '2024-03-15', 1296.00, 0.00, 144.00, 1296.00, 'CHT-2024-0001', 'PROCESSED', NOW()),
        ('a0000004-0000-0000-0000-000000000002', 'PAY-2024-002', v_gheorghe_id, v_prop2, v_liab2, 'IMPOZIT_CLADIRE', 'ORDIN_PLATA', '2024-03-28', 2560.00, 0.00, 0.00, 2560.00, 'CHT-2024-0002', 'PROCESSED', NOW()),
        ('a0000004-0000-0000-0000-000000000003', 'PAY-2025-001', v_floarea_id, v_prop4, v_liab4, 'IMPOZIT_AUTO', 'CARD', '2025-02-10', 400.00, 0.00, 0.00, 400.00, 'CHT-2025-0001', 'PROCESSED', NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Tax Declarations
    INSERT INTO tax_declarations (id, declaration_number, contributor_id, property_id, declaration_type, declaration_status, tax_year, calculated_tax, observations, submitted_at, is_active, created_at, updated_at) VALUES
        ('a0000005-0000-0000-0000-000000000001', 'DECL-2024-001', v_vasile_id, v_prop1, 'DECLARARE_CLADIRE', 'VALIDATED', 2024, 1440.00, 'Declaratie initiala cladire str. Principala nr. 15', '2024-01-10 09:00:00', true, NOW(), NOW()),
        ('a0000005-0000-0000-0000-000000000002', 'DECL-2024-002', v_floarea_id, v_prop4, 'DECLARARE_AUTO', 'VALIDATED', 2024, 810.00, 'Declaratie auto Dacia Duster 2018', '2024-01-15 10:30:00', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ============================================
    -- 3. AGRICULTURE SERVICE SEED DATA
    -- ============================================

    -- Agriculture Households
    INSERT INTO agriculture_households (id, household_code, owner_id, owner_name, registration_date, is_active, created_at, updated_at) VALUES
        (v_hh1, 'GH-NUCET-001', v_vasile_id, 'Ion Vasile', '2020-03-15', true, NOW(), NOW()),
        (v_hh2, 'GH-NUCET-002', v_gheorghe_id, 'Petrescu Gheorghe', '2019-06-20', true, NOW(), NOW()),
        (v_hh3, 'GH-NUCET-003', v_floarea_id, 'Georgescu Floarea', '2021-01-10', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Agriculture Parcels
    INSERT INTO agriculture_parcels (id, parcel_number, household_id, owner_id, cadastral_number, land_registry_number, area, category, usage_type, irrigation_type, observations, is_active, created_at, updated_at) VALUES
        ('b0000002-0000-0000-0000-000000000001', 'P-001', v_hh1, v_vasile_id, 'CAD-5001', 'CF-5001', 3.500, 'ARABLE', 'OWNED', 'Gravitational', 'Teren arabil langa drum comunal', true, NOW(), NOW()),
        ('b0000002-0000-0000-0000-000000000002', 'P-002', v_hh1, v_vasile_id, 'CAD-5002', 'CF-5002', 1.200, 'PASTURE', 'OWNED', NULL, 'Pasune pe dealul Nucetului', true, NOW(), NOW()),
        ('b0000002-0000-0000-0000-000000000003', 'P-003', v_hh2, v_gheorghe_id, 'CAD-5003', 'CF-5003', 5.000, 'ARABLE', 'OWNED', 'Aspersiune', 'Teren arabil zona de sud', true, NOW(), NOW()),
        ('b0000002-0000-0000-0000-000000000004', 'P-004', v_hh2, v_gheorghe_id, 'CAD-5004', 'CF-5004', 0.800, 'ORCHARD', 'OWNED', 'Picurare', 'Livada de pruni', true, NOW(), NOW()),
        ('b0000002-0000-0000-0000-000000000005', 'P-005', v_hh3, v_floarea_id, 'CAD-5005', 'CF-5005', 2.300, 'ARABLE', 'LEASED', NULL, 'Teren arendat pentru cereale', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Agriculture Members
    INSERT INTO agriculture_members (id, household_id, first_name, last_name, cnp, birth_date, type, relation, phone, is_active, created_at) VALUES
        ('b0000003-0000-0000-0000-000000000001', v_hh1, 'Vasile', 'Ion', '1750515123456', '1975-05-15', 'OWNER', 'HEAD', '0734567890', true, NOW()),
        ('b0000003-0000-0000-0000-000000000002', v_hh1, 'Ana', 'Ion', '2780320123457', '1978-03-20', 'MEMBER', 'SPOUSE', '0734567891', true, NOW()),
        ('b0000003-0000-0000-0000-000000000003', v_hh2, 'Gheorghe', 'Petrescu', '1680112123458', '1968-01-12', 'OWNER', 'HEAD', '0734567892', true, NOW()),
        ('b0000003-0000-0000-0000-000000000004', v_hh2, 'Elena', 'Petrescu', '2720805123459', '1972-08-05', 'MEMBER', 'SPOUSE', '0734567893', true, NOW()),
        ('b0000003-0000-0000-0000-000000000005', v_hh2, 'Mihai', 'Petrescu', '1950610123460', '1995-06-10', 'MEMBER', 'CHILD', '0734567894', true, NOW()),
        ('b0000003-0000-0000-0000-000000000006', v_hh3, 'Floarea', 'Georgescu', '2700225123461', '1970-02-25', 'OWNER', 'HEAD', '0734567895', true, NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Agriculture Animals
    INSERT INTO agriculture_animals (id, household_id, animal_type, species, breed, tag_number, birth_date, sex, quantity, observations, is_active, created_at) VALUES
        ('b0000004-0000-0000-0000-000000000001', v_hh1, 'BOVINE', 'Vaca', 'Baltata Romaneasca', 'RO-123456', '2019-04-10', 'F', 3, 'Vaci de lapte', true, NOW()),
        ('b0000004-0000-0000-0000-000000000002', v_hh2, 'OVINE', 'Oaie', 'Turcana', NULL, NULL, NULL, 25, 'Turma de oi', true, NOW()),
        ('b0000004-0000-0000-0000-000000000003', v_hh2, 'PORCINE', 'Porc', 'Mangalita', NULL, '2024-02-15', NULL, 4, 'Porci pentru crestere', true, NOW()),
        ('b0000004-0000-0000-0000-000000000004', v_hh3, 'POULTRY', 'Gaina', 'Leghorn', NULL, NULL, NULL, 30, 'Gaini ouatoare', true, NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Agriculture Machines
    INSERT INTO agriculture_machines (id, household_id, machine_type, registration_number, brand, model, horse_power, registration_date, observations, is_active, created_at) VALUES
        ('b0000005-0000-0000-0000-000000000001', v_hh1, 'TRACTOR', 'DB-01-AGR', 'New Holland', 'T4.75', 75, '2020-05-10', 'Tractor principal pentru lucrarile agricole', true, NOW()),
        ('b0000005-0000-0000-0000-000000000002', v_hh2, 'COMBINE', 'DB-02-AGR', 'Claas', 'Lexion 530', 295, '2018-08-20', 'Combina pentru recoltare cereale', true, NOW()),
        ('b0000005-0000-0000-0000-000000000003', v_hh1, 'PLOW', 'DB-03-AGR', 'Kuhn', 'Multi-Leader 3', NULL, '2021-03-15', 'Plug reversibil cu 3 trupite', true, NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ============================================
    -- 4. INFRASTRUCTURE SERVICE SEED DATA
    -- ============================================

    -- Infrastructure Networks
    INSERT INTO infrastructure_networks (id, network_type, name, description, network_status, total_length, installation_date, technical_specifications, is_active, created_at, updated_at) VALUES
        (v_net_water, 'WATER', 'Retea Alimentare cu Apa Nucet', 'Reteaua principala de alimentare cu apa potabila a comunei Nucet', 'ACTIVE', 12.50, '2005-06-15', 'Material: PEHD, Diametru: DN110-DN250, Presiune: 4-6 bar', true, NOW(), NOW()),
        (v_net_sewer, 'SEWERAGE', 'Retea Canalizare Nucet', 'Reteaua de canalizare menajera - zona centrala', 'ACTIVE', 8.30, '2015-09-20', 'Material: PVC, Diametru: DN200-DN400, Panta: 0.5-1%', true, NOW(), NOW()),
        (v_net_elec, 'ELECTRICITY', 'Retea Electrica Joasa Tensiune Nucet', 'Reteaua de distributie electrica joasa tensiune', 'ACTIVE', 18.70, '2000-03-10', 'Tensiune: 0.4kV, Tip: LEA si LES, Putere instalata: 630kVA', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Infrastructure Assets
    INSERT INTO infrastructure_assets (id, network_id, asset_type, serial_number, name, manufacturer, model, installation_date, warranty_expiry, asset_status, observations, is_active, created_at, updated_at) VALUES
        (v_asset1, v_net_water, 'PUMP', 'WP-2020-001', 'Statie Pompare Apa SP1', 'Grundfos', 'CR 15-4', '2020-04-10', '2025-04-10', 'ACTIVE', 'Pompa principala statie tratare', true, NOW(), NOW()),
        (v_asset2, v_net_water, 'HYDRANT', 'HYD-2015-001', 'Hidrant Exterior H1 - Str. Principala', 'AVK', 'DN80', '2015-06-20', NULL, 'ACTIVE', 'Hidrant exterior zona centrala', true, NOW(), NOW()),
        (v_asset3, v_net_water, 'METER', 'WM-2022-001', 'Contor Apa Principal', 'Sensus', 'MeiStream Plus', '2022-01-15', '2027-01-15', 'ACTIVE', 'Contor general la intrare in sat', true, NOW(), NOW()),
        (v_asset4, v_net_elec, 'TRANSFORMER', 'TR-2010-001', 'Post Transformare PT1 Central', 'Electromontaj', '250kVA', '2010-08-25', NULL, 'ACTIVE', 'Post transformare centrul satului', true, NOW(), NOW()),
        (v_asset5, v_net_sewer, 'PUMP', 'SP-2018-001', 'Statie Pompare Canalizare SPC1', 'Flygt', 'NP 3127', '2018-11-05', '2023-11-05', 'UNDER_REPAIR', 'In reparatie - inlocuire rotor', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Infrastructure Incidents
    INSERT INTO infrastructure_incidents (id, network_id, asset_id, incident_type, severity, description, reported_by, reported_at, incident_status, resolved_at, resolution_notes, is_active, created_at) VALUES
        ('c0000003-0000-0000-0000-000000000001', v_net_water, v_asset2, 'LEAK', 'MEDIUM', 'Pierdere de apa la hidrantul H1 de pe Str. Principala. Apa curge la baza hidrantului.', v_vasile_id, '2024-08-15 08:30:00', 'RESOLVED', '2024-08-16 14:00:00', 'Inlocuit garnitura la baza hidrantului. Testat - functioneaza corect.', true, NOW()),
        ('c0000003-0000-0000-0000-000000000002', v_net_elec, v_asset4, 'MALFUNCTION', 'HIGH', 'Fluctuatii de tensiune in zona centrala. Posibila problema la postul de transformare PT1.', v_ion_id, '2024-10-20 16:00:00', 'RESOLVED', '2024-10-22 11:00:00', 'Reglat derivatia transformatorului. Tensiune stabilizata la 230V.', true, NOW()),
        ('c0000003-0000-0000-0000-000000000003', v_net_sewer, v_asset5, 'BREAKDOWN', 'HIGH', 'Pompa statiei de canalizare SPC1 nu porneste. Posibil motor ars.', v_george_id, '2025-01-10 07:00:00', 'IN_PROGRESS', NULL, NULL, true, NOW()),
        ('c0000003-0000-0000-0000-000000000004', v_net_water, NULL, 'LEAK', 'LOW', 'Pierdere minora de apa la capat de retea, zona Str. Salcamilor nr. 42.', v_floarea_id, '2025-02-28 10:00:00', 'NEW', NULL, NULL, true, NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ============================================
    -- 5. ERP SERVICE SEED DATA
    -- ============================================

    -- ERP Employees
    INSERT INTO erp_hr_employees (id, cnp, first_name, last_name, email, phone, employment_type, position, department, contract_number, hire_date, status, base_salary, grade, work_schedule, is_active, created_at, updated_at) VALUES
        (v_emp1, '1700101123401', 'Nicolae', 'Marinescu', 'primar@primarianucet.ro', '0245123456', 'FULL_TIME', 'Primar', 'Conducere', 'CIM-001/2020', '2020-06-15', 'ACTIVE', 15200.00, 1, '8:00-16:00', true, NOW(), NOW()),
        (v_emp2, '2750315123402', 'Cornelia', 'Badescu', 'secretar@primarianucet.ro', '0245123457', 'FULL_TIME', 'Secretar General', 'Conducere', 'CIM-002/2018', '2018-03-01', 'ACTIVE', 12500.00, 2, '8:00-16:00', true, NOW(), NOW()),
        (v_emp3, '2800520123403', 'Elena', 'Stancu', 'contabil@primarianucet.ro', '0245123458', 'FULL_TIME', 'Contabil Sef', 'Financiar-Contabil', 'CIM-003/2019', '2019-01-10', 'ACTIVE', 10800.00, 3, '8:00-16:00', true, NOW(), NOW()),
        (v_emp4, '1850710123404', 'Alexandru', 'Dobre', 'taxe@primarianucet.ro', '0245123459', 'FULL_TIME', 'Inspector Taxe si Impozite', 'Taxe si Impozite', 'CIM-004/2021', '2021-04-01', 'ACTIVE', 8500.00, 4, '8:00-16:00', true, NOW(), NOW()),
        (v_emp5, '1900825123405', 'Andrei', 'Voicu', 'urbanism@primarianucet.ro', '0245123460', 'FULL_TIME', 'Inspector Urbanism', 'Urbanism', 'CIM-005/2022', '2022-09-15', 'ACTIVE', 8200.00, 4, '8:00-16:00', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ERP Budgets (2024 and 2025)
    INSERT INTO erp_budgets (id, year, source_code, classification_code, chapter, article, authorized_credit, budgetary_credit, revised_credit, status, is_active, created_at, updated_at) VALUES
        (v_bud1, 2024, 'BUGET_LOCAL', '51.02', '51', '10', 2500000.00, 2350000.00, 2480000.00, 'CLOSED', true, NOW(), NOW()),
        (v_bud2, 2025, 'BUGET_LOCAL', '51.02', '51', '10', 2800000.00, 2650000.00, NULL, 'APPROVED', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ERP Accounting Entries
    INSERT INTO erp_accounting_entries (id, journal, entry_date, document_number, document_type, description, total_debit, total_credit, is_posted, posted_at, is_reversed, is_active, created_at) VALUES
        ('f1000003-0000-0000-0000-000000000001', 'GENERAL', '2024-06-15', 'NCP-2024-001', 'Nota Contabila', 'Inregistrare cheltuieli salariale luna iunie 2024', 55200.00, 55200.00, true, '2024-06-30 10:00:00', false, true, NOW()),
        ('f1000003-0000-0000-0000-000000000002', 'GENERAL', '2024-07-10', 'NCP-2024-002', 'Nota Contabila', 'Incasare impozite si taxe locale T2 2024', 125000.00, 125000.00, true, '2024-07-15 09:00:00', false, true, NOW()),
        ('f1000003-0000-0000-0000-000000000003', 'GENERAL', '2025-01-31', 'NCP-2025-001', 'Nota Contabila', 'Inregistrare cheltuieli materiale ianuarie 2025', 18500.00, 18500.00, false, NULL, false, true, NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ERP Inventory Items
    INSERT INTO erp_inventory_items (id, code, name, description, category, unit_of_measure, quantity, unit_price, total_value, inventory_method, status, is_active, created_at, updated_at) VALUES
        ('f1000004-0000-0000-0000-000000000001', 'INV-001', 'Hartie A4 80g', 'Hartie imprimanta A4, 80g/mp, top 500 coli', 'Birotica', 'top', 45.000, 25.50, 1147.50, 'FIFO', 'ACTIVE', true, NOW(), NOW()),
        ('f1000004-0000-0000-0000-000000000002', 'INV-002', 'Toner HP LaserJet', 'Cartus toner HP CF226X', 'Consumabile IT', 'buc', 8.000, 320.00, 2560.00, 'FIFO', 'ACTIVE', true, NOW(), NOW()),
        ('f1000004-0000-0000-0000-000000000003', 'INV-003', 'Sare Deszapezire', 'Sare tehnica pentru deszapezire drumuri', 'Materiale Intretinere', 'tona', 15.000, 450.00, 6750.00, 'FIFO', 'ACTIVE', true, NOW(), NOW()),
        ('f1000004-0000-0000-0000-000000000004', 'INV-004', 'Motorina', 'Motorina Euro 5 pentru utilaje', 'Combustibili', 'litru', 500.000, 7.85, 3925.00, 'FIFO', 'ACTIVE', true, NOW(), NOW()),
        ('f1000004-0000-0000-0000-000000000005', 'INV-005', 'Pixuri Albastre', 'Pixuri cu pasta albastra, cutie 50 buc', 'Birotica', 'cutie', 12.000, 45.00, 540.00, 'FIFO', 'ACTIVE', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ============================================
    -- 6. DMS SERVICE SEED DATA
    -- ============================================

    -- DMS Folders
    INSERT INTO dms_folders (id, parent_id, name, path, owner_id, is_active, created_at, updated_at) VALUES
        (v_folder1, NULL, 'Documente Oficiale', '/Documente Oficiale', v_admin_id, true, NOW(), NOW()),
        (v_folder2, NULL, 'Corespondenta', '/Corespondenta', v_admin_id, true, NOW(), NOW()),
        (v_folder3, NULL, 'Proiecte', '/Proiecte', v_admin_id, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- DMS Documents
    INSERT INTO dms_documents (id, folder_id, document_type, title, file_name, file_path, file_size, content_type, version, document_status, owner_id, description, tags, is_active, created_at, updated_at) VALUES
        ('d0000002-0000-0000-0000-000000000001', v_folder1, 'HCL', 'HCL Nr. 15/2024 - Aprobare Buget Local', 'HCL_15_2024_buget.pdf', '/storage/documente-oficiale/HCL_15_2024_buget.pdf', 2450000, 'application/pdf', 1, 'PUBLISHED', v_admin_id, 'Hotararea Consiliului Local privind aprobarea bugetului local pe anul 2024', 'HCL,buget,2024', true, NOW(), NOW()),
        ('d0000002-0000-0000-0000-000000000002', v_folder1, 'DISPOZITIE', 'Dispozitie Nr. 42/2024 - Organizare Inventariere', 'DISP_42_2024_inventar.pdf', '/storage/documente-oficiale/DISP_42_2024_inventar.pdf', 1850000, 'application/pdf', 1, 'APPROVED', v_admin_id, 'Dispozitia Primarului privind organizarea inventarierii patrimoniului', 'dispozitie,inventar,2024', true, NOW(), NOW()),
        ('d0000002-0000-0000-0000-000000000003', v_folder2, 'ADRESA', 'Adresa Consiliul Judetean - Finantare Drum DC1', 'adresa_CJ_drum_DC1.pdf', '/storage/corespondenta/adresa_CJ_drum_DC1.pdf', 980000, 'application/pdf', 1, 'PUBLISHED', v_ion_id, 'Adresa primita de la Consiliul Judetean Dambovita privind co-finantarea drumului DC1', 'corespondenta,CJ,drum,DC1', true, NOW(), NOW()),
        ('d0000002-0000-0000-0000-000000000004', v_folder3, 'PROIECT', 'Studiu Fezabilitate - Canalizare Sat', 'SF_canalizare_sat.pdf', '/storage/proiecte/SF_canalizare_sat.pdf', 15600000, 'application/pdf', 2, 'REVIEW', v_george_id, 'Studiu de fezabilitate pentru extinderea retelei de canalizare', 'SF,canalizare,proiect', true, NOW(), NOW()),
        ('d0000002-0000-0000-0000-000000000005', v_folder3, 'PROIECT', 'Caiet Sarcini - Reabilitare Scoala', 'CS_reabilitare_scoala.pdf', '/storage/proiecte/CS_reabilitare_scoala.pdf', 8900000, 'application/pdf', 1, 'DRAFT', v_maria_id, 'Caiet de sarcini pentru reabilitarea scolii generale din Nucet', 'caiet sarcini,scoala,reabilitare', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ============================================
    -- 7. URBANISM SERVICE SEED DATA
    -- ============================================

    -- Urbanism UTR Zones
    INSERT INTO urbanism_utrs (id, code, name, pot_percentage, cut_index, max_build_height, zoning_type, regulations, min_lot_area, max_floors, is_active, created_at, updated_at) VALUES
        (v_utr1, 'ZRL', 'Zona Rezidentiala cu Densitate Mica', 35, 0.90, 10.00, 'RESIDENTIAL', 'Sunt permise: locuinte individuale P+1+M, anexe gospodaresti. Regim de inaltime maxim P+1+M. Retragere fata de strada min 5m, fata de limita laterala min 3m.', 500, 3, true, NOW(), NOW()),
        (v_utr2, 'ZCP', 'Zona Centrala si de Prestari Servicii', 60, 2.40, 15.00, 'MIXED', 'Sunt permise: institutii publice, comert, servicii, locuinte colective. Regim de inaltime maxim P+3+M. Spatiu verde minim 20% din suprafata parcelei.', 300, 5, true, NOW(), NOW()),
        (v_utr3, 'ZA', 'Zona Agricola', 5, 0.10, 6.00, 'AGRICULTURAL', 'Sunt permise: constructii agricole, depozite produse agricole, adaposturi animale. Interdictie constructii rezidentiale. Protejarea terenului agricol.', 2000, 1, true, NOW(), NOW()),
        (v_utr4, 'ZI', 'Zona Industriala si Depozitare', 50, 1.50, 12.00, 'INDUSTRIAL', 'Sunt permise: ateliere, depozite, unitati de productie mica. Zona verde de protectie min 10m fata de zona rezidentiala. Acces auto obligatoriu.', 1000, 2, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Urbanism Registers
    INSERT INTO urbanism_registers (id, register_type, register_number, session_date, register_status, observations, total_records, is_active, created_at, updated_at) VALUES
        (v_ureg1, 'CU', 'REG-CU-2024', '2024-01-15', 'CLOSED', 'Registru certificate urbanism emise in 2024', 15, true, NOW(), NOW()),
        (v_ureg2, 'AC_AD', 'REG-AC-2024', '2024-01-15', 'CLOSED', 'Registru autorizatii de construire/desfiintare 2024', 8, true, NOW(), NOW()),
        (v_ureg3, 'CU', 'REG-CU-2025', '2025-01-10', 'OPEN', 'Registru certificate urbanism 2025 - in lucru', 3, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Urbanism Certificates (CU)
    INSERT INTO urbanism_cu (id, cu_number, register_id, applicant_id, utr_id, application_date, issue_date, expiry_date, cu_status, purpose, legal_regime, tax_amount, tax_paid, is_active, created_at, updated_at) VALUES
        (v_cu1, 'CU-2024-001', v_ureg1, v_vasile_id, v_utr1, '2024-02-10', '2024-03-05', '2025-03-05', 'ISSUED', 'Construire locuinta P+1', 'Regim juridic: proprietate privata. Zona rezidentiala conform PUG.', 50.00, true, true, NOW(), NOW()),
        (v_cu2, 'CU-2024-002', v_ureg1, v_gheorghe_id, v_utr3, '2024-05-20', '2024-06-15', '2025-06-15', 'ISSUED', 'Construire grajd animale', 'Regim juridic: proprietate privata. Zona agricola conform PUG.', 35.00, true, true, NOW(), NOW()),
        (v_cu3, 'CU-2025-001', v_ureg3, v_floarea_id, v_utr1, '2025-01-15', NULL, NULL, 'IN_PROGRESS', 'Extindere locuinta existenta', 'Regim juridic: proprietate privata. Zona rezidentiala.', 50.00, false, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Urbanism Authorizations (AC)
    INSERT INTO urbanism_ac (id, ac_number, cu_id, register_id, applicant_id, utr_id, authorization_type, application_date, issue_date, expiry_date, ac_status, construction_type, destination, built_area, total_area, height, floors, construction_value, tax_amount, tax_paid, is_active, created_at, updated_at) VALUES
        (v_ac1, 'AC-2024-001', v_cu1, v_ureg2, v_vasile_id, v_utr1, 'CONSTRUIRE', '2024-04-01', '2024-05-15', '2026-05-15', 'IN_EXECUTION', 'Locuinta P+1', 'Locuinta unifamiliala', 120.00, 350.00, 8.50, 2, 450000.00, 1350.00, true, true, NOW(), NOW()),
        (v_ac2, 'AC-2024-002', v_cu2, v_ureg2, v_gheorghe_id, v_utr3, 'CONSTRUIRE', '2024-07-10', '2024-08-20', '2025-08-20', 'COMPLETED', 'Grajd animale', 'Adapost bovine 10 capete', 200.00, 500.00, 5.00, 1, 120000.00, 360.00, true, true, NOW(), NOW()),
        (v_ac3, 'AC-2024-003', NULL, v_ureg2, v_floarea_id, v_utr1, 'DESFIINTARE', '2024-09-05', '2024-10-10', '2025-10-10', 'ISSUED', 'Desfiintare anexa', 'Demolre constructie anexa degradata', 45.00, 45.00, 3.50, 1, 15000.00, 45.00, true, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ============================================
    -- 8. PROJECT SERVICE SEED DATA
    -- ============================================

    -- Projects
    INSERT INTO projects (id, name, description, status, priority, start_date, end_date, progress, manager_id, manager_name, budget, is_active, created_at, updated_at) VALUES
        (v_proj1, 'Modernizare Drum Comunal DC1', 'Modernizare si asfaltare drum comunal DC1 pe o lungime de 3.2 km, inclusiv rigole si podete.', 'IN_PROGRESS', 'HIGH', '2024-04-01', '2025-06-30', 45, v_ion_id, 'Ion Popescu', 2500000.00, true, NOW(), NOW()),
        (v_proj2, 'Reabilitare Scoala Generala Nucet', 'Reabilitare termica, inlocuire tamplarie, refacere instalatii si modernizare sali de clasa.', 'PLANNING', 'HIGH', '2025-03-01', '2026-08-31', 10, v_maria_id, 'Maria Iliescu', 1800000.00, true, NOW(), NOW()),
        (v_proj3, 'Extindere Retea Canalizare Sat', 'Extinderea retelei de canalizare menajera in zona de sud a comunei, cu racorduri la 120 gospodarii.', 'PLANNING', 'MEDIUM', '2025-06-01', '2026-12-31', 5, v_george_id, 'George Dumitrescu', 3200000.00, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Project Tasks
    INSERT INTO project_tasks (id, project_id, title, description, status, priority, assignee_id, assignee_name, start_date, due_date, estimated_hours, actual_hours, progress, is_active, created_at, updated_at) VALUES
        ('f0000002-0000-0000-0000-000000000001', v_proj1, 'Obtinere avize si autorizatii', 'Obtinerea tuturor avizelor necesare de la institutiile abilitate', 'COMPLETED', 'HIGH', v_ion_id, 'Ion Popescu', '2024-04-01', '2024-05-30', 80, 95, 100, true, NOW(), NOW()),
        ('f0000002-0000-0000-0000-000000000002', v_proj1, 'Licitatie publica lucrari', 'Organizarea procedurii de achizitie publica pentru executia lucrarilor', 'COMPLETED', 'HIGH', v_elena_id, 'Elena Stancu', '2024-06-01', '2024-07-31', 120, 110, 100, true, NOW(), NOW()),
        ('f0000002-0000-0000-0000-000000000003', v_proj1, 'Executie tronson 1 (km 0-1.5)', 'Lucrari de terasamente, fundatie si asfaltare tronson 1', 'IN_PROGRESS', 'HIGH', v_ion_id, 'Ion Popescu', '2024-08-01', '2025-01-31', 500, 320, 65, true, NOW(), NOW()),
        ('f0000002-0000-0000-0000-000000000004', v_proj1, 'Executie tronson 2 (km 1.5-3.2)', 'Lucrari de terasamente, fundatie si asfaltare tronson 2', 'TODO', 'MEDIUM', v_ion_id, 'Ion Popescu', '2025-02-01', '2025-05-31', 600, 0, 0, true, NOW(), NOW()),
        ('f0000002-0000-0000-0000-000000000005', v_proj1, 'Receptie lucrari', 'Receptia la terminarea lucrarilor si receptia finala', 'TODO', 'LOW', v_ion_id, 'Ion Popescu', '2025-06-01', '2025-06-30', 40, 0, 0, true, NOW(), NOW()),
        ('f0000002-0000-0000-0000-000000000006', v_proj2, 'Elaborare documentatie tehnica', 'Proiect tehnic si detalii de executie pentru reabilitare', 'IN_PROGRESS', 'HIGH', v_maria_id, 'Maria Iliescu', '2025-03-01', '2025-05-31', 200, 60, 30, true, NOW(), NOW()),
        ('f0000002-0000-0000-0000-000000000007', v_proj2, 'Obtinere finantare PNRR', 'Depunere cerere de finantare prin PNRR componenta educatie', 'TODO', 'HIGH', v_elena_id, 'Elena Stancu', '2025-04-01', '2025-06-30', 160, 0, 0, true, NOW(), NOW()),
        ('f0000002-0000-0000-0000-000000000008', v_proj3, 'Studiu de fezabilitate', 'Elaborare studiu de fezabilitate retea canalizare zona sud', 'IN_PROGRESS', 'HIGH', v_george_id, 'George Dumitrescu', '2025-01-15', '2025-04-30', 150, 80, 55, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Project Milestones
    INSERT INTO project_milestones (id, project_id, name, description, due_date, status, is_active, created_at, updated_at) VALUES
        ('f0000003-0000-0000-0000-000000000001', v_proj1, 'Finalizare avize', 'Toate avizele si autorizatiile obtinute', '2024-05-30', 'COMPLETED', true, NOW(), NOW()),
        ('f0000003-0000-0000-0000-000000000002', v_proj1, 'Atribuire contract executie', 'Contractul de executie semnat cu constructorul', '2024-07-31', 'COMPLETED', true, NOW(), NOW()),
        ('f0000003-0000-0000-0000-000000000003', v_proj1, 'Finalizare tronson 1', 'Primul tronson de 1.5 km asfaltare finalizat', '2025-01-31', 'IN_PROGRESS', true, NOW(), NOW()),
        ('f0000003-0000-0000-0000-000000000004', v_proj1, 'Receptie finala drum DC1', 'Receptia finala a intregului drum modernizat', '2025-06-30', 'TODO', true, NOW(), NOW()),
        ('f0000003-0000-0000-0000-000000000005', v_proj2, 'Aprobare proiect tehnic', 'Proiectul tehnic avizat si aprobat', '2025-05-31', 'TODO', true, NOW(), NOW()),
        ('f0000003-0000-0000-0000-000000000006', v_proj3, 'Aprobare studiu fezabilitate', 'Studiul de fezabilitate aprobat de Consiliul Local', '2025-04-30', 'IN_PROGRESS', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- Project Documents
    INSERT INTO project_documents (id, project_id, title, file_name, file_size, status, uploaded_at, is_active, created_at, updated_at) VALUES
        ('f0000004-0000-0000-0000-000000000001', v_proj1, 'Proiect Tehnic Drum DC1', 'PT_drum_DC1_v2.pdf', 45000000, 'APPROVED', '2024-06-15 10:00:00', true, NOW(), NOW()),
        ('f0000004-0000-0000-0000-000000000002', v_proj1, 'Contract Executie nr. 125/2024', 'contract_executie_125_2024.pdf', 3200000, 'APPROVED', '2024-08-01 09:00:00', true, NOW(), NOW()),
        ('f0000004-0000-0000-0000-000000000003', v_proj3, 'Studiu Fezabilitate Canalizare', 'SF_canalizare_zona_sud.pdf', 28000000, 'DRAFT', '2025-02-10 14:00:00', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    -- ============================================
    -- 9. GIS SERVICE SEED DATA
    -- ============================================

    -- GIS Layers
    INSERT INTO gis_layers (id, layer_id, name, type, description, visible, min_zoom, max_zoom, style, is_active, created_at, updated_at) VALUES
        (v_layer1, 'parcels', 'Parcele Cadastrale', 'polygon', 'Stratul cu parcelele cadastrale din comuna Nucet', true, 14, 20, '{"fillColor":"#90EE90","fillOpacity":0.3,"strokeColor":"#228B22","strokeWidth":2}', true, NOW(), NOW()),
        (v_layer2, 'streets', 'Strazi si Drumuri', 'line', 'Reteaua de strazi si drumuri comunale', true, 12, 20, '{"strokeColor":"#808080","strokeWidth":3,"dashArray":"none"}', true, NOW(), NOW()),
        (v_layer3, 'buildings', 'Cladiri', 'polygon', 'Amprente cladiri din comuna Nucet', true, 15, 20, '{"fillColor":"#DEB887","fillOpacity":0.6,"strokeColor":"#8B4513","strokeWidth":1}', true, NOW(), NOW()),
        (v_layer4, 'networks', 'Retele Edilitare', 'line', 'Retelele de apa, canalizare si electricitate', false, 14, 20, '{"strokeColor":"#0000FF","strokeWidth":2,"dashArray":"5,5"}', true, NOW(), NOW()),
        (v_layer5, 'utr_zones', 'Zone UTR', 'polygon', 'Unitatile Teritoriale de Referinta din PUG', false, 12, 20, '{"fillColor":"#FFD700","fillOpacity":0.2,"strokeColor":"#FF8C00","strokeWidth":2}', true, NOW(), NOW()),
        (v_layer6, 'addresses', 'Puncte de Adresa', 'point', 'Puncte de adresa si puncte de interes', true, 15, 20, '{"markerColor":"#FF4500","markerSize":8}', true, NOW(), NOW())
    ON CONFLICT (layer_id) DO NOTHING;

    -- GIS Features - Parcels (near Nucet, Dambovita ~44.95N, 25.12E)
    INSERT INTO gis_features (id, layer_id, name, description, latitude, longitude, geometry_geojson, properties_json, is_active, created_at, updated_at) VALUES
        ('f2000002-0000-0000-0000-000000000001', 'parcels', 'Parcela CAD-5001', 'Teren arabil - Ion Vasile', 44.9520, 25.1180,
         '{"type":"Polygon","coordinates":[[[25.1170,44.9515],[25.1190,44.9515],[25.1190,44.9525],[25.1170,44.9525],[25.1170,44.9515]]]}',
         '{"cadastralNumber":"CAD-5001","owner":"Ion Vasile","area_ha":3.5,"category":"ARABLE"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000002', 'parcels', 'Parcela CAD-5002', 'Pasune - Ion Vasile', 44.9540, 25.1200,
         '{"type":"Polygon","coordinates":[[[25.1190,44.9535],[25.1210,44.9535],[25.1210,44.9545],[25.1190,44.9545],[25.1190,44.9535]]]}',
         '{"cadastralNumber":"CAD-5002","owner":"Ion Vasile","area_ha":1.2,"category":"PASTURE"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000003', 'parcels', 'Parcela CAD-5003', 'Teren arabil - Petrescu Gheorghe', 44.9480, 25.1150,
         '{"type":"Polygon","coordinates":[[[25.1130,44.9470],[25.1170,44.9470],[25.1170,44.9490],[25.1130,44.9490],[25.1130,44.9470]]]}',
         '{"cadastralNumber":"CAD-5003","owner":"Petrescu Gheorghe","area_ha":5.0,"category":"ARABLE"}', true, NOW(), NOW()),

    -- GIS Features - Streets
        ('f2000002-0000-0000-0000-000000000004', 'streets', 'Str. Principala', 'Strada principala a satului Nucet - DJ 711', 44.9505, 25.1185,
         '{"type":"LineString","coordinates":[[25.1100,44.9505],[25.1150,44.9505],[25.1200,44.9505],[25.1250,44.9505],[25.1300,44.9505]]}',
         '{"streetType":"DJ","name":"Str. Principala","length_m":1800,"surface":"asfalt"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000005', 'streets', 'Str. Salcamilor', 'Strada secundara, zona rezidentiala', 44.9515, 25.1210,
         '{"type":"LineString","coordinates":[[25.1200,44.9505],[25.1200,44.9520],[25.1200,44.9535],[25.1200,44.9550]]}',
         '{"streetType":"comunal","name":"Str. Salcamilor","length_m":520,"surface":"pietruit"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000006', 'streets', 'Str. Bisericii', 'Strada catre biserica veche', 44.9498, 25.1170,
         '{"type":"LineString","coordinates":[[25.1150,44.9505],[25.1160,44.9495],[25.1170,44.9490],[25.1180,44.9485]]}',
         '{"streetType":"comunal","name":"Str. Bisericii","length_m":350,"surface":"asfalt"}', true, NOW(), NOW()),

    -- GIS Features - Buildings
        ('f2000002-0000-0000-0000-000000000007', 'buildings', 'Primaria Nucet', 'Sediul Primariei Comunei Nucet', 44.9505, 25.1190,
         '{"type":"Polygon","coordinates":[[[25.1187,44.9503],[25.1193,44.9503],[25.1193,44.9507],[25.1187,44.9507],[25.1187,44.9503]]]}',
         '{"buildingType":"institutional","name":"Primaria Nucet","floors":2,"year":1975,"address":"Str. Principala Nr. 1"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000008', 'buildings', 'Scoala Generala Nucet', 'Scoala cu clasele I-VIII Nucet', 44.9510, 25.1205,
         '{"type":"Polygon","coordinates":[[[25.1200,44.9508],[25.1210,44.9508],[25.1210,44.9512],[25.1200,44.9512],[25.1200,44.9508]]]}',
         '{"buildingType":"educational","name":"Scoala Generala Nucet","floors":2,"year":1968,"address":"Str. Principala Nr. 15"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000009', 'buildings', 'Biserica Sf. Nicolae', 'Biserica ortodoxa sec. XVIII', 44.9490, 25.1178,
         '{"type":"Polygon","coordinates":[[[25.1175,44.9488],[25.1181,44.9488],[25.1181,44.9492],[25.1175,44.9492],[25.1175,44.9488]]]}',
         '{"buildingType":"religious","name":"Biserica Sf. Nicolae","floors":1,"year":1780,"address":"Str. Bisericii Nr. 1"}', true, NOW(), NOW()),

    -- GIS Features - Networks
        ('f2000002-0000-0000-0000-000000000010', 'networks', 'Conducta Apa Principala', 'Conducta principala alimentare apa - DN250', 44.9505, 25.1190,
         '{"type":"LineString","coordinates":[[25.1100,44.9506],[25.1150,44.9506],[25.1200,44.9506],[25.1250,44.9506]]}',
         '{"networkType":"WATER","diameter":"DN250","material":"PEHD","pressure_bar":6}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000011', 'networks', 'Retea Canalizare Centrala', 'Colector principal canalizare menajera', 44.9504, 25.1185,
         '{"type":"LineString","coordinates":[[25.1150,44.9504],[25.1200,44.9504],[25.1250,44.9504],[25.1300,44.9500]]}',
         '{"networkType":"SEWERAGE","diameter":"DN400","material":"PVC","slope_percent":0.8}', true, NOW(), NOW()),

    -- GIS Features - UTR Zones
        ('f2000002-0000-0000-0000-000000000012', 'utr_zones', 'UTR ZRL - Zona Rezidentiala', 'Zona rezidentiala cu densitate mica', 44.9515, 25.1210,
         '{"type":"Polygon","coordinates":[[[25.1180,44.9500],[25.1250,44.9500],[25.1250,44.9540],[25.1180,44.9540],[25.1180,44.9500]]]}',
         '{"utrCode":"ZRL","zoningType":"RESIDENTIAL","pot":35,"cut":0.9,"maxHeight":10}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000013', 'utr_zones', 'UTR ZCP - Zona Centrala', 'Zona centrala si prestari servicii', 44.9505, 25.1185,
         '{"type":"Polygon","coordinates":[[[25.1160,44.9498],[25.1210,44.9498],[25.1210,44.9512],[25.1160,44.9512],[25.1160,44.9498]]]}',
         '{"utrCode":"ZCP","zoningType":"MIXED","pot":60,"cut":2.4,"maxHeight":15}', true, NOW(), NOW()),

    -- GIS Features - Address Points
        ('f2000002-0000-0000-0000-000000000014', 'addresses', 'Primaria Nucet', 'Str. Principala Nr. 1', 44.9505, 25.1190,
         '{"type":"Point","coordinates":[25.1190,44.9505]}',
         '{"address":"Str. Principala Nr. 1","type":"institutional","postalCode":"135444"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000015', 'addresses', 'Scoala Generala Nucet', 'Str. Principala Nr. 15', 44.9510, 25.1205,
         '{"type":"Point","coordinates":[25.1205,44.9510]}',
         '{"address":"Str. Principala Nr. 15","type":"educational","postalCode":"135444"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000016', 'addresses', 'Dispensar Medical Nucet', 'Str. Principala Nr. 8', 44.9507, 25.1195,
         '{"type":"Point","coordinates":[25.1195,44.9507]}',
         '{"address":"Str. Principala Nr. 8","type":"medical","postalCode":"135444"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000017', 'addresses', 'Magazin Mixt Central', 'Str. Principala Nr. 5', 44.9506, 25.1192,
         '{"type":"Point","coordinates":[25.1192,44.9506]}',
         '{"address":"Str. Principala Nr. 5","type":"commercial","postalCode":"135444"}', true, NOW(), NOW()),

        ('f2000002-0000-0000-0000-000000000018', 'addresses', 'Camin Cultural Nucet', 'Str. Principala Nr. 20', 44.9512, 25.1215,
         '{"type":"Point","coordinates":[25.1215,44.9512]}',
         '{"address":"Str. Principala Nr. 20","type":"cultural","postalCode":"135444"}', true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Seed data inserted successfully!';
END $$;

-- Grant privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pdi_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pdi_user;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'PDI Database initialized successfully with seed data!';
END $$;