export const getPriority = (priorityCode) => {
    if (priorityCode >= 2) return "High";
    if (priorityCode === 1) return "Medium";
    return "Low";
};

<<<<<<< HEAD
const REQUEST_ROLE_MAP = {
    // Mayor
    1: 2,
    2: 2,
    3: 2,
    // Secretary
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    // Lawyer
    8: 4,
    9: 4,
    10: 4,
    11: 4,
    // Engineer
    12: 5,
    13: 5,
    14: 5,
    15: 5,
    16: 5,
    // Finance
    17: 6,
    18: 6,
    // Staff
    19: 7
};

export const getRoleForRequestType = (requestTypeId) => {
    return REQUEST_ROLE_MAP[requestTypeId] || 7;
=======
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
>>>>>>> 7302d69 (fixed secretary task assignment)
};