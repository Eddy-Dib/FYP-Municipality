export const formatDate = (date) => {
    if (!date) return null;

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    return d.toISOString().split("T")[0];
};