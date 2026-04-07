-- MAIN INSERTION SCRIPT: Inserts provisional data into tables. Some will be permanent

-- UTILITY TABLES:

-- States of a task
INSERT INTO TASK_STATUSES (TStat_Code, TStat_Name, TStat_Desc) VALUES
(1, 'Pending', 'Task has been created but not started yet'),
(2, 'In Progress', 'Task is currently being worked on'),
(3, 'Escalated', 'Task has been escalated to a higher authority'),
(4, 'On Hold', 'Task is temporarily paused'),
(5, 'Completed', 'Task has been completed successfully'),
(6, 'Rejected', 'Task has been rejected. Reason to be specified'),
(7, 'Cancelled', 'Task has been cancelled before completion');

-- States of a request
INSERT INTO REQ_STATUSES (RStat_Code, RStat_Name, RStat_Desc) VALUES
(1, 'Submitted', 'Request has been submitted by the citizen'),
(2, 'Under Review', 'Request is being examined by the municipality staff'),
(3, 'Validated', 'Request has been verified and is ready for processing'),
(4, 'Missing Documents', 'Request is incomplete and requires additional documents'),
(5, 'Assigned', 'Request has been assigned to a staff member'),
(6, 'Rejected', 'Request has been denied'),
(7, 'In Progress', 'Request is currently being processed'),
(8, 'Completed', 'Request has been fully processed and closed');

-- Settings for tax. Default rule that will be changed later
INSERT INTO SETTINGS_TAX (TaxSet_Date, TaxSet_Amt, TaxSet_Days_Threshold) VALUES 
('2026-03-10', 10.00, 7);

-- Location types
INSERT INTO LOCATION_TYPE (LocT_ID, LocT_Type) VALUES
(1, 'Apartment'),
(2, 'House'),
(3, 'Business'),
(4, 'Shop'),
(5, 'Warehouse'),
(6, 'Public Building');

-- Report types
INSERT INTO REP_TYPE (RepType_ID, RepType_Name) VALUES
(1, 'Legal'),
(2, 'Financial'),
(3, 'Administrative'),
(4, 'Technical'),
(5, 'Operational'),
(6, 'Audit'),
(7, 'General');

-- Request types
INSERT INTO REQUEST_TYPES (RType_ID, RType_Name, RType_Desc, RType_Duration) VALUES
(1, 'Building Permit', 'Request for permission to construct or modify a building', 14),
(2, 'Business License', 'Request to register or renew a business license', 10),
(3, 'Maintenance Request', 'Request for public infrastructure maintenance (roads, lights, etc.)', 5),
(4, 'Waste Collection Request', 'Request for special or bulk waste collection service', 3),
(5, 'Property Certificate', 'Request for official property ownership or registration documents', 7),
(6, 'Event Permit', 'Request for permission to organize a public or private event', 7),
(7, 'Parking Permit', 'Request for residential or special parking authorization', 5),
(8, 'General Inquiry', 'General-purpose request for information or assistance', 2);

-- Employee roles
INSERT INTO ROLES (Role_ID, Role_Type, Role_Desc) VALUES
(1, 'Admin', 'System administrator with full access'),
(2, 'Mayor', 'Head of the municipality with high-level authority'),
(3, 'Secretary', 'Handles administrative tasks and documentation'),
(4, 'Lawyer', 'Responsible for legal matters and compliance'),
(5, 'Engineer', 'Handles technical and infrastructure-related tasks'),
(6, 'Financial Staff', 'Manages financial operations and payments'),
(7, 'Staff', 'General-purpose employee role for uncategorized staff');

-- City placeolder
INSERT INTO CITY (City_Name) VALUES
('Sample City');

-- Street placeholders
INSERT INTO STREET (Street_Name, City_ID) VALUES
('Main Street', 1),
('12', 1);

-- Buildings placeholders
INSERT INTO BUILDING (Building_Name, Street_ID) VALUES
('Sunset Plaza', 1),
('Al Noor Building', 1),
('B12', 1),
('Block A', 2),
('Building 45', 2),
('C7', 2);

-- Specific locations of varying types
INSERT INTO LOCATION (Floor, Size, Building_ID, LocT_ID) VALUES
(1, 120.50, 1, 4),   -- shop in Sunset Plaza
(2, 85.00, 1, 1),    -- apartment
(3, 90.75, 1, 1),    -- apartment
(0, 200.00, 2, 3),   -- business (ground floor)
(1, 95.00, 2, 1),    -- apartment above
(0, 300.00, 3, 5),   -- warehouse
(1, 110.00, 3, 3),   -- business office
(0, 180.00, 4, 2),   -- house (Block A)
(1, 70.00, 4, 1),    -- small apartment
(0, 60.00, 5, 4),    -- small shop
(2, 88.00, 5, 1),    -- apartment
(0, 400.00, 6, 6);   -- public building

-- Dummy user data, one for each role
INSERT INTO USERS (Username, Password, RegDate) VALUES
('guest', '1234', '2026-04-01 10:00:00'),
('admin', '1234', '2026-04-01 10:05:00'),
('mayor', '1234', '2026-04-01 10:10:00'),
('secretary', '1234', '2026-04-01 10:15:00'),
('lawyer', '1234', '2026-04-01 10:20:00'),
('engineer', '1234', '2026-04-01 10:25:00'),
('financial', '1234', '2026-04-01 10:30:00'),
('staff', '1234', '2026-04-01 10:35:00');

-- Dummy citizen date, one registered one not
INSERT INTO CITIZEN (First_Name, Last_Name, BirthDate, Email, Phone_Num, U_ID, Location_ID) VALUES
('Guest', 'Citizen', '1990-01-01', 'guest@example.com', '00-000000', 1, 1),
('Outsider', 'Citizen', '1985-06-15', 'outsider@example.com', '88-888888', NULL, 2);

-- Dummy employee data, one for each role
INSERT INTO EMPLOYEE (First_Name, Last_Name, BirthDate, DateHired, U_ID, Role_ID)
VALUES
('Admin', 'User', '1980-05-12', '2020-01-01', 2, 1),
('Mayor', 'User', '1975-02-20', '2019-06-15', 3, 2),
('Secretary', 'User', '1988-11-03', '2021-03-10', 4, 3),
('Lawyer', 'User', '1982-08-25', '2020-09-01', 5, 4),
('Engineer', 'User', '1990-04-17', '2021-07-22', 6, 5),
('Finance', 'User', '1985-12-30', '2019-11-05', 7, 6),
('Staff', 'Member', '1992-09-14', '2022-02-01', 8, 7);

-- Dummy documents
INSERT INTO DOCUMENT (Doc_Type, DateUploaded, Description, ExpDate, C_ID, IsValid, FilePath)
VALUES
('National ID', '2026-04-03 09:00:00', 'Personal identification card', '2031-04-03', 1, 1, '/files/citizens/1/national_id.pdf'),
('Proof of Residence', '2026-04-03 10:30:00', 'Document confirming residence', NULL, 2, 1, '/files/citizens/2/proof_of_residence.pdf'),
('Property Deed', '2026-04-02 11:00:00', 'Ownership document for property', NULL, 1, 1, '/files/citizens/1/property_deed.pdf'),
('Business License', '2026-04-01 14:15:00', 'License to operate a business', '2027-04-01', 1, 1, '/files/citizens/1/business_license.pdf');

-- Dummy complaints
INSERT INTO COMPLAINT (Subject, Details, DateMade, DateResolved, C_ID)
VALUES
('Noise Complaint', 'Loud construction work every morning.', '2026-04-02 08:30:00', NULL, 1),
('Street Light Issue', 'The street light in front of my building is not working.', '2026-04-01 19:45:00', '2026-04-02 21:00:00', 1);

-- Dummy requests (JSON format to be determined later)
INSERT INTO REQUEST (DateMade, DateCompleted, Description, FlagRejected, Priority, RType_ID, RStat_Code, C_ID)
VALUES
('2026-04-01 09:00:00', NULL, JSON_OBJECT('property_address', '123 Elm St', 'building_size', '20sqm', 'contractor', 'John Doe'), 0, 1, 1, 1, 1),
('2026-04-01 10:15:00', NULL, JSON_OBJECT('business_name', 'Coffee Hut', 'license_type', 'Food & Beverage', 'employees_count', 5), 0, 2, 2, 1, 1),
('2026-04-01 11:30:00', NULL, JSON_OBJECT('tax_year', 2025, 'amount_due', 500, 'reason', 'Property tax exemption'), 0, 3, 3, 1, 1),
('2026-04-01 12:45:00', NULL, JSON_OBJECT('residence_address', '45 Maple Ave', 'proof_type', 'Certificate of Residency'), 0, 2, 1, 1, 1);

-- Dummy events
INSERT INTO EVENT (Name, StartDate, EndDate, Details, Entrance, Emp_ID)
VALUES
('Spring Cleaning Campaign', '2026-04-10 08:00:00', '2026-04-10 16:00:00', 'Organize volunteers for city-wide cleaning', 0, 2),
('Local Business Fair', '2026-04-15 10:00:00', '2026-04-15 18:00:00', 'Exhibition of local businesses and products', 10.00, 3);

-- Dummy announcement
INSERT INTO ANNOUNCEMENT (Name, Details, Emp_ID)
VALUES
('Water Supply Interruption', 'There will be a temporary water shutdown on April 5th from 9 AM to 3 PM.', 2),
('City Hall Opening Hours', 'City Hall will be open from 8 AM to 6 PM starting April 1st.', 3);

-- Dummy tasks
INSERT INTO TASK (Name, DateAssigned, Priority, DateCompleted, TStat_Code, Emp_ID, Req_ID) VALUES
('Accept New User Registrations', '2026-04-01 09:30:00', 2, NULL, 1, 1, 1),		-- Admin
('Oversee City Hall Operations', '2026-04-01 10:00:00', 3, NULL, 1, 2, 2),		-- Mayor
('Process Business License', '2026-04-01 10:45:00', 1, NULL, 1, 3, 3),			-- Secretary
('Legal Review of Request', '2026-04-01 11:15:00', 2, NULL, 1, 4, 1),			-- Lawyer
('Inspect Construction Site', '2026-04-01 11:45:00', 2, NULL, 1, 5, 2),			-- Engineer
('Verify Financial Data', '2026-04-01 12:15:00', 1, NULL, 1, 6, 3),				-- Financial Staff
('General Admin Task', '2026-04-01 12:50:00', 0, NULL, 1, 7, 4);				-- Staff (general)

-- Dummy reports
INSERT INTO REPORT (Title, Description, RepType_ID, Task_ID)
VALUES
('User Registration Audit', 'Checked new user registrations for correctness and completeness.', 2, 1),
('Building Site Inspection Report', 'Inspected the site and noted compliance issues.', 1, 2);

-- Dummy fees
INSERT INTO FEE (Fee_Type, Amount, DateExpected, Location_ID)
VALUES
('Property Tax', 120.00, '2026-04-10', 1),
('Commercial Permit Fee', 250.00, '2026-04-10', 2),
('Apartment Maintenance Fee', 80.00, '2026-04-10', 3),
('Shop Cleaning Fee', 60.00, '2026-04-10', 4);

-- Dummy payments
INSERT INTO PAYMENT (Amount, Date, LateAmount, Fee_ID)
VALUES
(120.00, '2026-04-11', 0.00, 1),
(250.00, '2026-04-20', 25.00, 2);

-- Dummy notifications
INSERT INTO NOTIFICATION (Title, Text, DateSent, Fee_ID, Req_ID)
VALUES
('Property Tax Reminder', 'Your property tax for Location 1 is due on 2026-04-10. Please pay on time to avoid late fees.',  '2026-04-05 09:00:00', 1, NULL),
('Permit Request Update', 'Your building permit request has been approved by the engineer.', '2026-04-12 14:30:00', NULL, 1);

