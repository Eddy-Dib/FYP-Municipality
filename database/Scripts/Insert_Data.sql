-- ROLES
INSERT INTO ROLES (Role_ID, Role_Type, Role_Desc) VALUES
(1, 'Admin', 'System administrator'),
(2, 'Mayor', 'Head of the municipality, makes final approval'),
(3, 'Secretary', 'Handles administrative tasks and documentation'),
(4, 'Lawyer', 'Responsible for legal matters and compliance'),
(5, 'Engineer', 'Handles technical and infrastructure-related tasks'),
(6, 'Financial Staff', 'Manages financial operations and payments'),
(7, 'Staff', 'General-purpose employee role for uncategorized staff');

-- SETTINGS_TAX
INSERT INTO SETTINGS_TAX (TaxSet_Amt, TaxSet_Days_Threshold) VALUES
(10.00, 7);


-- REQ_STATUSES
INSERT INTO REQ_STATUSES VALUES
(1, 'Submitted', 'Submitted by the citizen, not validated'),
(2, 'Under Review', 'Is being examined by the municipality staff'),
(3, 'Validated', 'Validated by Secretary'),
(4, 'Missing Documents', 'Flagged as missing documents by Secretary'),
(5, 'Assigned', 'Validated by secretary, automatic task created'),
(6, 'Rejected', 'Rejected by secretary or mayor'),
(7, 'In Progress', 'Auto set when associated task has started'),
(8, 'Completed', 'Final approval by mayor, auto create issued doc');


-- REQUEST_TYPES
-- (RType_ID, RType_Name, RType_Desc, RType_Duration)
INSERT INTO REQUEST_TYPES VALUES
-- Mayor
(1, 'Project Approval', 'High-level approval for infrastructure or public works projects', 15),
(2, 'Policy Exception', 'Requests for exceptions to municipal policies', 10),
(3, 'Public Service Approval', 'Approval for high-impact public service actions', 12),
-- Secretary
(4, 'Civil Status Document', 'Requests for civil documents such as registry extracts and certificates', 2),
(5, 'Certificate Issuance', 'Requests for official certificates like residence or registry extracts', 3),
(6, 'Archive Retrieval', 'Requests to retrieve archived municipal documents', 4),
(7, 'Administrative Inquiry Request', 'General administrative questions or guidance requests', 2),
-- Lawyer
(8, 'Legal Verification', 'Requests for legal validation of documents or records', 5),
(9, 'Dispute Legal Review', 'Legal review of disputes or complaints', 7),
(10, 'Property Legal Validation', 'Validation of ownership or property legal status', 6),
(11, 'Regulation Compliance Review', 'Checks for compliance with laws and regulations', 6),
-- Engineer
(12, 'Building Permit', 'Approval for new construction projects', 14),
(13, 'Renovation Permit', 'Approval for structural modifications or renovations', 10),
(14, 'Infrastructure Repair', 'Requests for road, water, or sewage repairs', 7),
(15, 'Site Inspection', 'Requests for technical inspection of sites', 5),
(16, 'Occupancy Certificate', 'Certification that a building is safe for use', 12),
-- Finance
(17, 'Payment Validation', 'Verification of payments or financial records', 2),
(18, 'Financial Clearance', 'Confirmation that all financial obligations are cleared', 4),
-- Staff
(19, 'Miscellaneous Service Request', 'General service-related requests not classified elsewhere', 3);


-- REP_TYPE
-- (RepType_ID, RepType_Name)
INSERT INTO REP_TYPE VALUES
(1, 'Administrative Report'),
(2, 'Mayoral Report'),
(3, 'Secretary Summary'),
(4, 'Legal Review'),
(5, 'Technical Report'),
(6, 'Financial Report'),
(7, 'General Service Report');


-- TASK_STATUSES
-- (TStat_Code, TStat_Name, TStat_Desc)
INSERT INTO TASK_STATUSES VALUES
(1, 'Pending', 'Task has been created but not started yet'),
(2, 'In Progress', 'Task is currently being worked on'),
(3, 'Escalated', 'Task has been escalated to a higher authority'),
(4, 'On Hold', 'Task is temporarily paused'),
(5, 'Completed', 'Task has been completed successfully'),
(6, 'Rejected', 'Task has been rejected (request rejected)'),
(7, 'Cancelled', 'Task has been cancelled before completion');


-- DOC_TYPE
-- (Doc_Type_ID, Doc_Type_Name, valid_for = 0)
INSERT INTO DOC_TYPE VALUES
(1, 'Identity Document (ID / Passport)',0),
-- Civil / certificates
(2, 'Civil Status Extract', 3),
(3, 'Family Registry Extract', 3),
(4, 'Certificate of Residence', 6),
-- Property / legal
(5, 'Ownership Document (Title Deed)',0),
(6, 'Property Plan',0),
(7, 'Legal Supporting Document', 6),
-- Construction / technical
(8, 'Building Plan',0),
(9, 'Engineering Report', 12),
(10, 'Inspection Report', 6),
(11, 'Occupancy Certificate', 0),
-- Financial
(12, 'Payment Receipt', 0),
(13, 'Financial Clearance Certificate', 3),
-- Generic / system
(14, 'Application Form', 1),
(15, 'Supporting Document', 6);


-- COMPLAINT_TYPE
-- (CType_ID, CType_Name)
INSERT INTO COMPLAINT_TYPE VALUES
(1, 'Waste Management'),
(2, 'Water Issue'),
(3, 'Electricity Issue'),
(4, 'Road Damage'),
(5, 'Noise Complaint'),
(6, 'Illegal Construction'),
(7, 'Public Safety Issue'),
(8, 'Street Lighting Issue'),
(9, 'Sewage Problem'),
(10, 'General Complaint');



-- LOCATION_TYPE
-- (LocT_ID, LocT_Type)
INSERT INTO LOCATION_TYPE VALUES
(1, 'Apartment'),
(2, 'House'),
(3, 'Business'),
(4, 'Shop'),
(5, 'Warehouse'),
(6, 'Public Building');

-- CITY
-- (City_ID AUTO, City_Name)
INSERT INTO CITY (City_Name) VALUES
('UL City');

-- STREET
-- (Street_ID AUTO, Street_Name, City_ID)
INSERT INTO STREET(Street_Name, City_ID ) VALUES
('Main Street', 1),
('12 abc', 1);


-- BUILDING
-- (Building_ID AUTO, Building_Name, Street_ID)
INSERT INTO BUILDING(Building_Name, Street_ID ) VALUES
('Bloc A East', 1),
('Al Noor Bldg', 1),
('B12', 1),
('A12N8', 2),
('Amara L', 2),
('C7', 2);

-- LOCATION
-- (Location_ID AUTO, Floor, Size, Building_ID, LocT_ID)
INSERT INTO LOCATION (Floor, Size, Building_ID, LocT_ID) VALUES
-- Bloc A East (Building_ID = 1)
(1, 120.50, 1, 1),   -- Apartment
(2, 95.00, 1, 1),    -- Apartment
(0, 60.00, 1, 4),    -- Shop (ground floor)
-- Al Noor Bldg (Building_ID = 2)
(3, 150.00, 2, 1),   -- Apartment
(5, 200.00, 2, 3),   -- Business
-- B12 (Building_ID = 3)
(0, 300.00, 3, 2),   -- House
-- A12N8 (Building_ID = 4)
(1, 80.00, 4, 1),    -- Apartment
(0, 250.00, 4, 5),   -- Warehouse
-- Amara L (Building_ID = 5)
(2, 110.00, 5, 1),   -- Apartment
(0, 400.00, 5, 6),   -- Public Building
-- C7 (Building_ID = 6)
(1, 90.00, 6, 1),    -- Apartment
(0, 70.00, 6, 4);    -- Shop



-- SETTING_FEES
-- (SetFee_ID AUTO, SetFee_Name, SetFee_Amt, SetFee_Createdat DEFAULT CURRENT_TIMESTAMP, Yearly_Flg DEFAULT 1, LocT_ID)
INSERT INTO SETTING_FEES (SetFee_Name, SetFee_Amt, Yearly_Flg, LocT_ID) VALUES
('Apartment Municipal Fee', 100, 1, 1),
('House Municipal Fee', 150, 1, 2),
('Business License Fee', 300, 1, 3),
('Shop Operating Fee', 250, 1, 4),
('Warehouse Usage Fee', 200, 1, 5),
('Public Building Maintenance Fee', 50, 1, 6);


-- FEE
-- (Fee_ID AUTO, Fee_Type, Amount, DateExpected, CreatedAt DEFAULT CURRENT_TIMESTAMP, Location_ID)
INSERT INTO FEE (Amount, DateExpected, Location_ID) VALUES
-- Bloc A East (Location_ID 1-3)
(100, '2027-01-01', 1),
(100, '2027-01-01', 2),
(250, '2027-01-01', 3),
(100, '2027-01-01', 4),
(300, '2027-01-01', 5),
(150, '2026-01-01', 6),
(100, '2027-01-01', 7),
(200, '2027-01-01', 8),
(100, '2027-01-01', 9),
(50, '2026-01-01', 10),
(100, '2027-01-01', 11),
(250, '2027-01-01', 12);

-- PAYMENT
-- (Pay_ID AUTO, Amount, Date DEFAULT CURRENT_TIMESTAMP, LateAmount DEFAULT 0, Fee_ID)
INSERT INTO PAYMENT (Amount, LateAmount, Fee_ID) VALUES
(100, 0, 1),
(250, 0, 3),
(150, 15.00, 6),
(200, 0, 8);


-- USERS
-- (U_ID AUTO, Username, Password, RegDate, Active_Flg DEFAULT 1)
-- RegDate: NO DEFAULT (must be provided)
INSERT INTO USERS (Username, Password) VALUES
('guest', '1234'),
('admin', '1234'),
('mayor', '1234'),
('secretary', '1234'),
('lawyer', '1234'),
('engineer', '1234'),
('financial', '1234'),
('staff', '1234');

-- EMPLOYEE
-- (Emp_ID AUTO, First_Name, Last_Name, BirthDate, DateHired DEFAULT CURRENT_TIMESTAMP, U_ID, Role_ID)
INSERT INTO EMPLOYEE (First_Name, Last_Name, BirthDate, U_ID, Role_ID) VALUES
('John', 'Admin', '1980-05-12', 2, 1),
('Therese', 'Mayor', '1975-02-20', 3, 2),
('Mostafa', 'Secretary', '1988-11-03', 4, 3),
('Omar', 'Lawyer', '1982-08-25', 5, 4),
('Pamela', 'Engineer', '1990-04-17', 6, 5),
('Cherry', 'Finance', '1985-12-30', 7, 6),
('Karim', 'Staff', '1992-09-14', 8, 7);

-- CITIZEN
-- (C_ID AUTO, First_Name, Last_Name, BirthDate, Email, Phone_Num, CreatedAt DEFAULT CURRENT_TIMESTAMP, U_ID, Location_ID)
INSERT INTO CITIZEN (First_Name, Last_Name, BirthDate, Email, Phone_Num, U_ID, Location_ID) VALUES
('Guest', 'Citizen', '1990-01-01', 'guest@example.com', '00-000000', 1, 1),
('Outsider', 'Citizen', '1985-06-15', 'outsider@example.com', '88-888888', NULL, 2);


-- ANNOUNCEMENT
-- (Anc_ID AUTO, Name, Details, Emp_ID)
INSERT INTO ANNOUNCEMENT(Name, Details, Emp_ID ) VALUES
('Water Supply Interruption', 'There will be a temporary water shutdown on April 5th from 9 AM to 3 PM.', 3),
('City Hall Opening Hours', 'City Hall will be open from 8 AM to 6 PM starting April 1st.', 3);

-- EVENT
-- (Event_ID AUTO, Name, StartDate, EndDate, Details, Entrance, Emp_ID)
INSERT INTO EVENT(Name, StartDate , EndDate, Details, Entrance, Emp_ID) VALUES
('Spring Cleaning Campaign', '2026-04-10 08:00:00', '2026-04-10 16:00:00', 'Organize volunteers for city-wide cleaning', 0, 3),
('Local Business Fair', '2026-04-15 10:00:00', '2026-04-15 18:00:00', 'Exhibition of local businesses and products', 10.00, 3);


-- COMPLAINT
-- (Cmpt_ID AUTO, Subject, Details, DateMade DEFAULT CURRENT_TIMESTAMP, DateResolved, DateRejected, CType, C_ID)
INSERT INTO COMPLAINT (Subject, Details, DateResolved, DateRejected, CType, C_ID) VALUES
('Garbage not collected', 'Garbage has not been collected in the area for over a week causing bad smell.', NOW(), NULL, 1, 1),
('Unauthorized construction work', 'Construction observed without visible permit approval.', NULL, NOW(), 6, 2),
('Broken road in neighborhood', 'Large potholes making it difficult for vehicles to pass safely.', NULL, NULL, 4, 2),
('Water pressure problem', 'Very low water pressure in apartment building during mornings.', NULL, NULL, 2, 1),
('Excessive noise at night', 'Loud music and disturbances during late hours.', NULL, NULL, 5, 1);