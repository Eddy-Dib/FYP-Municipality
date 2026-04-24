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