import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET; // TODO: generate a random secret key and put in .env

/**
 * Generates a JSON Web Token (JWT) for a given payload.
 *
 * @param {Object} payload The data to include in the token.
 * @param {string|number} [expiresIn="1h"] How long the token is valid
 * @returns {string} A signed JWT string that can be used for authentication.
 *
 * @example
 * const token = generateToken({ id: 1, username: "bob", role: "admin" }, "2h");
 */
export const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};


/**
 * Verifies a JSON Web Token (JWT) and returns its decoded payload.
 *
 * @param {string} token The JWT string to verify.
 * @returns {Object|null} The decoded payload if the token is valid; otherwise, null.
 *
 * @example
 * const decoded = verifyToken("[token string here]");
 * if (decoded) {
 *     console.log(decoded.id, decoded.role);
 * } else {
 *     console.log("Token is invalid or expired");
 * }
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
};


/* To access token in front end use example:

const token = localStorage.getItem("token");

axios.get(`${API_URL}/dashboard`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
.then(res => console.log(res.data))
.catch(err => console.error(err));
*/