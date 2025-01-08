-- Create tables
CREATE TABLE companies (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  comp_code TEXT REFERENCES companies(code) ON DELETE CASCADE,
  amt FLOAT NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  add_date DATE DEFAULT CURRENT_DATE,
  paid_date DATE
);

CREATE TABLE industries (
  code TEXT PRIMARY KEY,
  industry TEXT NOT NULL
);

CREATE TABLE company_industries (
  industry_code TEXT REFERENCES industries(code) ON DELETE CASCADE,
  company_code TEXT REFERENCES companies(code) ON DELETE CASCADE,
  PRIMARY KEY (industry_code, company_code)
);


-- Insert initial data
INSERT INTO companies (code, name, description) VALUES
('apple', 'Apple', 'Maker of iPhones'),
('ibm', 'IBM', 'Big Blue computing');

INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES
('apple', 100, false, null),
('apple', 200, true, '2023-12-01'),
('ibm', 300, false, null);

-- Insert data into industries table
INSERT INTO industries (code, industry) VALUES
('acct', 'Accounting'),
('tech', 'Technology'),
('health', 'Healthcare'),
('finance', 'Finance');

-- Insert data into company_industries table
INSERT INTO company_industries (industry_code, company_code) VALUES
('acct', 'apple'),
('tech', 'apple'),
('tech', 'microsoft'),
('health', 'pfizer'),
('finance', 'goldman');

