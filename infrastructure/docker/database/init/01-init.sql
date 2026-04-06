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

-- Grant privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pdi_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pdi_user;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'PDI Database initialized successfully!';
END $$;