import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/responses.js";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendError(res, 401, "Unauthorized", "NO_TOKEN");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return sendError(res, 401, "Invalid or expired token", "INVALID_TOKEN");
    }

    req.user = decoded;

    next();
};