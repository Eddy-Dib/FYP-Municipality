export const formatDate = (date) => {
    if (!date) return null;

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    return d.toISOString().split("T")[0];
};

export const safeParseJSON = (data) => {
    if (typeof data !== "string") return data;

    try {
        return JSON.parse(data);
    } catch {
        return { raw: data };
    }
};

export const formatRequestNumber = ({
    date,
    requestTypeId,
    requestId
}) => {
    if (!date || requestTypeId == null || requestId == null) {
        return null;
    }

    const d = new Date(date);

    const year = d.getFullYear().toString().slice(-2);

    const typePart = String(requestTypeId).padStart(2, "0");
    const idPart = String(requestId).padStart(3, "0");

    return `REQ-${year}${typePart}${idPart}`;
};