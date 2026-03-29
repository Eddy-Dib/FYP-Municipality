-- MAIN CREATION SCRIPT: Creates the needed tables (see ER diagram)

-- UTILITY TABLES:

-- Storing states of a task (Pending, In Progress ...)
CREATE TABLE TASK_STATUSES (
    TStat_Code INT NOT NULL AUTO_INCREMENT,
    TStat_Name VARCHAR(100) NOT NULL,
    TStat_Desc VARCHAR(255),
    PRIMARY KEY (TStat_Code)
);

-- Storing states of a request (Submitted, Approved ...)
CREATE TABLE REQ_STATUSES (
    RStat_Code INT NOT NULL AUTO_INCREMENT,
    RStat_Name VARCHAR(100) NOT NULL,
    RStat_Desc VARCHAR(255),
    PRIMARY KEY (RStat_Code)
);

-- Stores rules for late fee taxes: amount (%) and time threshold (days) before the tax applies
-- Example: a 10% Tax set on March 10th 2026 for fees that are more than 7 days late (applies once)
CREATE TABLE SETTINGS_TAX (
    TaxSet_Code INT NOT NULL AUTO_INCREMENT,
    TaxSet_Date DATE NOT NULL,
    TaxSet_Amt DECIMAL(10,2) NOT NULL,
    TaxSet_Days_Threshold INT NOT NULL,
    PRIMARY KEY (TaxSet_Code)
);

-- Store types of locations (Appartment, Business ...)
CREATE TABLE LOCATION_TYPE (
    LocT_ID INT NOT NULL AUTO_INCREMENT,
    LocT_Type VARCHAR(100) NOT NULL,
    PRIMARY KEY (LocT_ID)
);

-- Stores types of reports (Legal, Financial ...)
CREATE TABLE REP_TYPE (
    RepType_ID INT NOT NULL AUTO_INCREMENT,
    RepType_Name VARCHAR(100) NOT NULL,
    PRIMARY KEY (RepType_ID)
);

-- Stores types of requests (Building permit, Business license ...), duration: expected time to be done
CREATE TABLE REQUEST_TYPES (
    RType_ID INT NOT NULL AUTO_INCREMENT,
    RType_Name VARCHAR(100) NOT NULL,
    RType_Desc VARCHAR(255),
    RType_Duration INT NOT NULL,
    PRIMARY KEY (RType_ID)
);

-- Stores the roles of employees (Mayor, Admin, Secretary ...)
CREATE TABLE ROLES (
    Role_ID INT NOT NULL AUTO_INCREMENT,
    Role_Type VARCHAR(100) NOT NULL,
    Role_Desc VARCHAR(255),
    PRIMARY KEY (Role_ID)
);


-- ADDRESS TABLES:

-- City Jurisdiction of the municipality
CREATE TABLE CITY (
    City_ID INT NOT NULL AUTO_INCREMENT,
    City_Name VARCHAR(100) NOT NULL,
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
    # Building_Type VARCHAR(50) NOT NULL, [Not needed: specified in Location]
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


-- ACCOUNT TABLES:

-- Stores users on the system of any type
CREATE TABLE USERS (
    U_ID INT NOT NULL AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Phone_Num VARCHAR(20),
    RegDate DATETIME NOT NULL,
    PRIMARY KEY (U_ID)
);

-- Stores all citizens (registered or pending registration)
CREATE TABLE CITIZEN (
    C_ID INT NOT NULL AUTO_INCREMENT,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    BirthDate DATE NOT NULL,
    U_ID INT UNIQUE,				-- can be a user or not (NULL => not registered)
    PRIMARY KEY (C_ID),
    FOREIGN KEY (U_ID) REFERENCES USERS(U_ID)
);

-- Stores all employees
CREATE TABLE EMPLOYEE (
    Emp_ID INT NOT NULL AUTO_INCREMENT,
    First_Name VARCHAR(50) NOT NULL,
    Last_Name VARCHAR(50) NOT NULL,
    BirthDate DATE NOT NULL,
    DateHired DATE NOT NULL,
    U_ID INT NOT NULL UNIQUE,		-- is always a user
    Role_ID INT NOT NULL,
    PRIMARY KEY (Emp_ID),
    FOREIGN KEY (U_ID) REFERENCES USERS(U_ID),
    FOREIGN KEY (Role_ID) REFERENCES ROLES(Role_ID)
);


-- CITIZEN RELATED TABLES:

-- Stores all the submitted documents for each citizen, keeps track of validation
CREATE TABLE DOCUMENT (
    Doc_ID INT NOT NULL AUTO_INCREMENT,
    Doc_Type VARCHAR(100) NOT NULL,
    DateUploaded DATETIME NOT NULL,
    Description VARCHAR(255),
    ExpDate DATE,
    C_ID INT NOT NULL,
    IsValid TINYINT(1) DEFAULT 1,	-- 1 = valid, 0 = invalid
    PRIMARY KEY (Doc_ID),
    FOREIGN KEY (C_ID) REFERENCES CITIZEN(C_ID)
);

-- Complaints made by citizens: title + details only
CREATE TABLE COMPLAINT (
    Cmpt_ID INT NOT NULL AUTO_INCREMENT,
    Subject VARCHAR(150) NOT NULL,
    Details TEXT,
    DateMade DATETIME NOT NULL,
    DateResolved DATETIME,
    C_ID INT NOT NULL,
    PRIMARY KEY (Cmpt_ID),
    FOREIGN KEY (C_ID) REFERENCES CITIZEN(C_ID)
);

-- Requests made by citizens: keeps track of completion/rejection and priority. Details saved as JSON
CREATE TABLE REQUEST (
    Req_ID INT NOT NULL AUTO_INCREMENT,
    DateMade DATETIME NOT NULL,
    DateCompleted DATETIME,
    Description JSON,
    FlagRejected TINYINT(1) DEFAULT 0,  -- 0 = not rejected, 1 = rejected
    Priority INT DEFAULT 0,
    RType_ID INT NOT NULL,
    RStat_Code INT NOT NULL,
    C_ID INT NOT NULL,
    PRIMARY KEY (Req_ID),
    FOREIGN KEY (RStat_Code) REFERENCES REQ_STATUSES(RStat_Code),
    FOREIGN KEY (RType_ID) REFERENCES REQUEST_TYPES(RType_ID),
    FOREIGN KEY (C_ID) REFERENCES CITIZEN(C_ID)
);


-- EMPLOYEE RELATED TABLES:

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

-- Announcements: title and text only
CREATE TABLE ANNOUNCEMENT (
    Anc_ID INT NOT NULL AUTO_INCREMENT,
    Name VARCHAR(150) NOT NULL,
    Details TEXT,
    Emp_ID INT NOT NULL,
    PRIMARY KEY (Anc_ID),
    FOREIGN KEY (Emp_ID) REFERENCES EMPLOYEE(Emp_ID)
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

-- stores amount needed per location for each fee type. TBD: automation (backend or database?)
CREATE TABLE FEE (
    Fee_ID INT NOT NULL AUTO_INCREMENT,
    Fee_Type VARCHAR(100) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    DateExpected DATE NOT NULL,
    Location_ID INT NOT NULL,
    PRIMARY KEY (Fee_ID),
    FOREIGN KEY (Location_ID) REFERENCES LOCATION(Location_ID)
);

-- stores payment amount for each fee. Handles late tax if needed
CREATE TABLE PAYMENT (
    Pay_ID INT NOT NULL AUTO_INCREMENT,
    Amount DECIMAL(10,2) NOT NULL,
    Date DATE NOT NULL,
    LateAmount DECIMAL(10,2) DEFAULT 0,
    Fee_ID INT NOT NULL,
    PRIMARY KEY (Pay_ID),
    FOREIGN KEY (Fee_ID) REFERENCES FEE(Fee_ID)
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