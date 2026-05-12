export const getPriority = (priorityCode) => {
    if (priorityCode >= 4) return "Urgent";
    if (priorityCode === 3) return "High";
    if (priorityCode === 2) return "Medium";
    return "Low";
};

const ROLE_REQUEST_MAP = {
    Mayor: [1, 2, 3],
    Secretary: [4, 5, 6, 7],
    Lawyer: [8, 9, 10, 11],
    Engineer: [12, 13, 14, 15, 16],
    Finance: [17, 18],
    Staff: [19]
};

const ROLE_TO_ID = {
    Mayor: 2,
    Secretary: 3,
    Lawyer: 4,
    Engineer: 5,
    Finance: 6,
    Staff: 7
};

export const getRoleForRequestType = (requestTypeId) => {
    for (const [roleName, requestTypes] of Object.entries(ROLE_REQUEST_MAP)) {
        if (requestTypes.includes(requestTypeId)) {
            return ROLE_TO_ID[roleName];
        }
    }

    return ROLE_TO_ID.Staff;
};