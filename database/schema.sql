-- Database Schema for DocuPilot AI

CREATE DATABASE docupilot_db;
USE docupilot_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Templates table
CREATE TABLE templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Sample user
INSERT INTO users (first_name, last_name, email, password, email_verified) 
VALUES 
('Test', 'User', 'test@example.com', 'password', TRUE);

-- Sample templates
INSERT INTO templates (name, description, content, category, created_by) 
VALUES 
('NDA Template', 'Standard Non-Disclosure Agreement', 'This NDA template...', 'Legal', 1),
('Employment Contract', 'Standard employment agreement template', 'Employment contract content...', 'HR', 1);

-- Sample document
INSERT INTO documents (user_id, title, content, category, status) 
VALUES 
(1, 'Privacy Policy Draft', 'Privacy policy content...', 'Compliance', 'draft');