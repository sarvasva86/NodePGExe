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

-- Insert initial data
INSERT INTO companies (code, name, description) VALUES
('apple', 'Apple', 'Maker of iPhones'),
('ibm', 'IBM', 'Big Blue computing');

INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES
('apple', 100, false, null),
('apple', 200, true, '2023-12-01'),
('ibm', 300, false, null);
