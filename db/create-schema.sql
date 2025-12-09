-- Create patient_marketing_data table
CREATE TABLE IF NOT EXISTS patient_marketing_data (
  id VARCHAR(36) PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  gender VARCHAR(20),
  dateOfBirth DATE,
  emergencyContactName VARCHAR(255),
  emergencyContactPhone VARCHAR(20),
  emergencyContactRelationship VARCHAR(100),
  streetAddress VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  zipCode VARCHAR(20),
  referralChannel VARCHAR(100),
  referralChannelDetails VARCHAR(255),
  isHipaaConsent BOOLEAN,
  isTermsAccepted BOOLEAN,

  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);


-- Create patient_documents table
CREATE TABLE IF NOT EXISTS patient_signature_documents (
  id VARCHAR(36) PRIMARY KEY,
  patientId VARCHAR(36) NOT NULL,
  documentType VARCHAR(100) NOT NULL,
  documentPath VARCHAR(500) NOT NULL,
  fileName       VARCHAR(255) NOT NULL,
  originalName    VARCHAR(255),
  fileType        VARCHAR(100),   -- application/pdf, image/jpeg, etc.
  fileSize        INT,      -- in bytes
  filePath        VARCHAR(500)   -- storage path
    
  -- Metadata
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patient_marketing_data(id) ON DELETE CASCADE,
  INDEX idx_patientId (patientId)
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  patientId VARCHAR(36),
  action VARCHAR(50) NOT NULL,
  tableName VARCHAR(100) NOT NULL,
  recordId VARCHAR(36) NOT NULL,
  oldValues JSON,
  newValues JSON,
  userId VARCHAR(36),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_patientId (patientId),
  INDEX idx_createdAt (createdAt)
);