-- MAIN CREATION SCRIPT: Creates the needed tables (see ER diagram)
-- UTILITY TABLES:

-- Stores rules for late fee taxes: amount (%) and time threshold (days) before the tax applies
-- Example: a 10% Tax set on March 10th 2026 for fees that are more than 7 days late (applies once)
CREATE TABLE SETTINGS_TAX (
    TaxSet_Code INT NOT NULL AUTO_INCREMENT,
    TaxSet_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TaxSet_Amt DECIMAL(10,2) NOT NULL,
    TaxSet_Days_Threshold INT NOT NULL,
    PRIMARY KEY (TaxSet_Code)
);

-- Storing states of a request (Submitted, Approved ...)
CREATE TABLE REQ_STATUSES (
    RStat_Code INT NOT NULL,
    RStat_Name VARCHAR(100) NOT NULL UNIQUE,
    RStat_Desc VARCHAR(255),
    PRIMARY KEY (RStat_Code)
);

-- Stores types of requests (Building permit, Business license ...), duration: expected time to be done
CREATE TABLE REQUEST_TYPES (
    RType_ID INT NOT NULL,
    RType_Name VARCHAR(100) NOT NULL UNIQUE,
    RType_Desc VARCHAR(255),
    RType_Duration INT NOT NULL,
    PRIMARY KEY (RType_ID)
);

-- Stores types of reports (Legal, Financial ...)
CREATE TABLE REP_TYPE (
    RepType_ID INT NOT NULL,
    RepType_Name VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (RepType_ID)
);


-- Storing states of a task (Pending, In Progress ...)
CREATE TABLE TASK_STATUSES (
    TStat_Code INT NOT NULL,
    TStat_Name VARCHAR(100) NOT NULL UNIQUE,
    TStat_Desc VARCHAR(255),
    PRIMARY KEY (TStat_Code)
);

-- Storing type of documents (ID, Residence certificate...)
CREATE TABLE DOC_TYPE(
	Doc_Type_ID INT NOT NULL,
	Doc_Type_Name VARCHAR(100) NOT NULL UNIQUE,
	Valid_for INT DEFAULT 0, -- in number of months, if 0, valid forever
	
	PRIMARY KEY (Doc_Type_ID)
);

-- Storing type of complaints (General, Waste, Water, Road...)
CREATE TABLE COMPLAINT_TYPE(
	CType_ID INT NOT NULL,
	CType_Name VARCHAR(100) NOT NULL UNIQUE,
	
	PRIMARY KEY (CType_ID)
);


-- ADDRESS TABLES:

-- Store types of locations (Appartment, Business ...)
CREATE TABLE LOCATION_TYPE (
    LocT_ID INT NOT NULL,
    LocT_Type VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (LocT_ID)
);

-- City Jurisdiction of the municipality
CREATE TABLE CITY (
    City_ID INT NOT NULL AUTO_INCREMENT,
    City_Name VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (City_ID)
);

-- Streets of the city with names (or number as a name)
CREATE TABLE STREET (
    Street_ID INT NOT NULL AUTO_INCREMENT,
    Street_Name VARCHAR(100) NOT NULL,
    
    City_ID INT NOT NULL,
    
    PRIMARY KEY (Street_ID),
    FOREIGN KEY (City_ID) REFERENCES CITY(City_ID)
);

-- Buildings in each street with names (or number as a name)
CREATE TABLE BUILDING (
    Building_ID INT NOT NULL AUTO_INCREMENT,
    Building_Name VARCHAR(100) NOT NULL,

    Street_ID INT NOT NULL,
    PRIMARY KEY (Building_ID),
    FOREIGN KEY (Street_ID) REFERENCES STREET(Street_ID)
);

-- Specifies appartments/stores/... in buildings: floor , size (area in square meters)
CREATE TABLE LOCATION (
    Location_ID INT NOT NULL AUTO_INCREMENT,
    Floor INT NOT NULL,
    Size DECIMAL(8,2) NOT NULL,
    
    Building_ID INT NOT NULL,
    LocT_ID INT NOT NULL,
    
    PRIMARY KEY (Location_ID),
    FOREIGN KEY (Building_ID) REFERENCES BUILDING(Building_ID),
    FOREIGN KEY (LocT_ID) REFERENCES LOCATION_TYPE(LocT_ID)
);

-- MIGHT ADD LATER IF NEEDED
-- Storing states of issued documents (Draft, Approved ...)
-- CREATE TABLE ISSDOC_STATUSES (
--     IssStat_Code INT NOT NULL,
--     IssStat_Name VARCHAR(100) NOT NULL,
--     IssStat_Desc VARCHAR(255),
--     PRIMARY KEY (IssStat_Code)
-- );

-- FEE TABLES

-- Stores the configuration of a fee depending on the location type (ex: 100$ on an appartment due each year)
CREATE TABLE SETTING_FEES(
	SetFee_ID INT NOT NULL AUTO_INCREMENT,
	SetFee_Name VARCHAR(100) NOT NULL,
	SetFee_Amt INT NOT NULL,
	SetFee_Createdat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	Yearly_Flg TINYINT NOT NULL DEFAULT 1, -- 1: Yearly, 0: Monthly
	LocT_ID INT NOT NULL,
	
	PRIMARY KEY (SetFee_ID),
    FOREIGN KEY (LocT_ID) REFERENCES LOCATION_TYPE(LocT_ID)
);

-- Decides the types of fees (ex: )
-- stores amount needed per location for each fee type. TBD: automation (backend or database?)
CREATE TABLE FEE (
    Fee_ID INT NOT NULL AUTO_INCREMENT,
    Amount DECIMAL(10,2) NOT NULL,
    DateExpected DATE NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Location_ID INT NOT NULL,
    PRIMARY KEY (Fee_ID),
    FOREIGN KEY (Location_ID) REFERENCES LOCATION(Location_ID)
);

-- stores payment amount for each fee. Handles late tax if needed
CREATE TABLE PAYMENT (
    Pay_ID INT NOT NULL AUTO_INCREMENT,
    Amount DECIMAL(10,2) NOT NULL,
    Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    LateAmount DECIMAL(10,2) DEFAULT 0,
    Fee_ID INT NOT NULL,
    PRIMARY KEY (Pay_ID),
    FOREIGN KEY (Fee_ID) REFERENCES FEE(Fee_ID)
);



-- Stores the roles of employees (Mayor, Admin, Secretary ...)
CREATE TABLE ROLES (
    Role_ID INT NOT NULL,
    Role_Type VARCHAR(100) NOT NULL UNIQUE,
    Role_Desc VARCHAR(255),
    PRIMARY KEY (Role_ID)
);



-- ACCOUNT TABLES:

-- Stores users on the system of any type
CREATE TABLE USERS (
    U_ID INT NOT NULL AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    RegDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Active_Flg TINYINT DEFAULT 1 NOT NULL, -- flag for if user is active (1) or delted (0)
    PRIMARY KEY (U_ID)
);

-- Stores all employees
CREATE TABLE EMPLOYEE (
    Emp_ID INT NOT NULL AUTO_INCREMENT,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    BirthDate DATE NOT NULL,
    DateHired DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    U_ID INT NOT NULL UNIQUE,		-- is always a user
    Role_ID INT NOT NULL,
    PRIMARY KEY (Emp_ID),
    FOREIGN KEY (U_ID) REFERENCES USERS(U_ID),
    FOREIGN KEY (Role_ID) REFERENCES ROLES(Role_ID)
);


-- Stores all citizens (registered or pending registration)
CREATE TABLE CITIZEN (
    C_ID INT NOT NULL AUTO_INCREMENT,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    BirthDate DATE NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Phone_Num VARCHAR(20),
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    U_ID INT UNIQUE,				-- can be a user or not (NULL => not registered)
    Location_ID INT,
    PRIMARY KEY (C_ID),
    FOREIGN KEY (U_ID) REFERENCES USERS(U_ID),
    FOREIGN KEY (Location_ID) REFERENCES LOCATION(Location_ID)
);

-- EMPLOYEE RELATED TABLES:

-- Announcements: title and text only
CREATE TABLE ANNOUNCEMENT (
    Anc_ID INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(150) NOT NULL,
    Details TEXT,
    Emp_ID INT NOT NULL,
    PRIMARY KEY (Anc_ID),
    FOREIGN KEY (Emp_ID) REFERENCES EMPLOYEE(Emp_ID)
);

-- Event scheduler, can handle entrance fees
CREATE TABLE EVENT (
    Event_ID INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(150) NOT NULL,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    Details TEXT,
    Entrance DECIMAL(10,2),
    Emp_ID INT NOT NULL,
    PRIMARY KEY (Event_ID),
    FOREIGN KEY (Emp_ID) REFERENCES EMPLOYEE(Emp_ID)
);



-- CITIZEN RELATED TABLES:

-- Stores all complaints
CREATE TABLE COMPLAINT (
    Cmpt_ID INT NOT NULL AUTO_INCREMENT,
    Subject VARCHAR(150) NOT NULL,
    Details TEXT,
    DateMade DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DateResolved DATETIME,
    DateRejected DATETIME,
    CType INT NOT NULL,
    C_ID INT NOT NULL,
    PRIMARY KEY (Cmpt_ID),
    FOREIGN KEY (C_ID) REFERENCES CITIZEN(C_ID),
    FOREIGN KEY (CType) REFERENCES COMPLAINT_TYPE(CType_ID),
    
    CONSTRAINT not_both_filled CHECK (NOT (DateResolved IS NOT NULL AND DateRejected IS NOT NULL))
);

-- Requests made by citizens: keeps track of completion/rejection and priority. Details saved as JSON
CREATE TABLE REQUEST (
    Req_ID INT NOT NULL AUTO_INCREMENT,
    DateMade DATETIME NOT NULL,
    DateCompleted DATETIME,
    Description JSON,
    FlagRejected TINYINT DEFAULT 0,  -- 0 = not rejected, 1 = rejected
    Priority INT DEFAULT 0,
    RType_ID INT NOT NULL,
    RStat_Code INT NOT NULL,
    C_ID INT NOT NULL,
    PRIMARY KEY (Req_ID),
    FOREIGN KEY (RStat_Code) REFERENCES REQ_STATUSES(RStat_Code),
    FOREIGN KEY (RType_ID) REFERENCES REQUEST_TYPES(RType_ID),
    FOREIGN KEY (C_ID) REFERENCES CITIZEN(C_ID)
);

-- Stores all the submitted documents for each citizen, keeps track of validation
CREATE TABLE DOCUMENT (
    Doc_ID INT NOT NULL AUTO_INCREMENT,
    DateUploaded DATETIME NOT NULL,
    Description VARCHAR(255),
    ExpDate DATE,
    FilePath VARCHAR(255),
    C_ID INT NOT NULL,
    Doc_Type INT NOT NULL,
    Req_ID INT,
    Comp_ID INT,
    IsValid TINYINT DEFAULT 1,	-- 1 = valid, 0 = invalid
    PRIMARY KEY (Doc_ID),
    FOREIGN KEY (C_ID) REFERENCES CITIZEN(C_ID),
    FOREIGN KEY (Doc_Type) REFERENCES DOC_TYPE(Doc_Type_ID),
    FOREIGN KEY (Req_ID) REFERENCES REQUEST(Req_ID),
    FOREIGN KEY (Comp_ID) REFERENCES COMPLAINT(Cmpt_ID),
    
    CONSTRAINT not_both_req_cmpt CHECK(NOT( Req_ID IS NOT NULL AND Comp_ID IS NOT NULL))
    
);


-- list of tasks, each related to exactly 1 request and 1 employee. Handles priority and tracking
CREATE TABLE TASK (
    Task_ID INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(150) NOT NULL,
    DateAssigned DATETIME NOT NULL,
    Priority INT DEFAULT 0,
    DateCompleted DATETIME,
    TStat_Code INT NOT NULL,
    Emp_ID INT NOT NULL,
    Req_ID INT NOT NULL,
    PRIMARY KEY (Task_ID),
    FOREIGN KEY (TStat_Code) REFERENCES TASK_STATUSES(TStat_Code),
    FOREIGN KEY (Emp_ID) REFERENCES EMPLOYEE(Emp_ID),
    FOREIGN KEY (Req_ID) REFERENCES REQUEST(Req_ID)
);

-- Internal reports, basic text and title. Used to make reviews and auditing easier
CREATE TABLE REPORT (
    Report_ID INT NOT NULL AUTO_INCREMENT,
    Title VARCHAR(150) NOT NULL,
    Description TEXT,
    RepType_ID INT NOT NULL,
    Task_ID INT NOT NULL,
    PRIMARY KEY (Report_ID),
    FOREIGN KEY (RepType_ID) REFERENCES REP_TYPE(RepType_ID),
    FOREIGN KEY (Task_ID) REFERENCES TASK(Task_ID)
);

-- Official documents issued to citizens (final output of a request)
CREATE TABLE ISSUED_DOCUMENT (
    IssDoc_ID INT NOT NULL AUTO_INCREMENT,
    Title VARCHAR(150) NOT NULL,
    Content TEXT,
    DateIssued DATETIME,

    Req_ID INT NOT NULL,
    Created_By INT NOT NULL,
    Approved_By INT,

    PRIMARY KEY (IssDoc_ID),

    FOREIGN KEY (Req_ID) REFERENCES REQUEST(Req_ID),
    FOREIGN KEY (Created_By) REFERENCES EMPLOYEE(Emp_ID),

    FOREIGN KEY (Approved_By) REFERENCES EMPLOYEE(Emp_ID)
);


-- stores general notifications. Special cases: late fees, request related notifications.
CREATE TABLE NOTIFICATION (
    Notif_ID INT NOT NULL AUTO_INCREMENT,
    Title VARCHAR(150) NOT NULL,
    Text TEXT NOT NULL,
    DateSent DATETIME NOT NULL,
    Fee_ID INT,
    Req_ID INT,
    PRIMARY KEY (Notif_ID),
    FOREIGN KEY (Fee_ID) REFERENCES FEE(Fee_ID),
    FOREIGN KEY (Req_ID) REFERENCES REQUEST(Req_ID)
);