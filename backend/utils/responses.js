/**
 * Sends a standardized success JSON response.
 *
 * @param {Object} res Express.js response object
 * @param {string} message Message describing the result
 * @param {Object} [data = {}] Optional payload data
 * @returns {Object} JSON response
 */
export const sendSuccess = (res, message, data = {}) => {
    return res.json({
        success: true,
        message,
        data,
        error: null
    });
};

/**
 * Sends a standardized error JSON response.
 *
 * @param {Object} res Express.js response object
 * @param {number} status HTTP status code
 * @param {string} message Error message to display
 * @param {string} errorCode Internal error code for debugging
 * @returns {Object} JSON response
 */
export const sendError = (res, status, message, errorCode) => {
    return res.status(status).json({
        success: false,
        message,
        data: null,
        error: errorCode
    });
};