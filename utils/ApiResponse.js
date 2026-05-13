/**
 * Standardised API response wrapper.
 * All responses follow: { success, message, data?, meta? }
 */
class ApiResponse {
  /**
   * @param {import('express').Response} res
   * @param {number} statusCode
   * @param {string} message
   * @param {*} [data]
   * @param {object} [meta]  - pagination, counts, etc.
   */
  static send(res, statusCode, message, data = null, meta = null) {
    const body = {
      success: statusCode < 400,
      message,
    };
    if (data !== null) body.data = data;
    if (meta !== null) body.meta = meta;
    return res.status(statusCode).json(body);
  }

  static success(res, message, data = null, meta = null) {
    return ApiResponse.send(res, 200, message, data, meta);
  }

  static created(res, message, data = null) {
    return ApiResponse.send(res, 201, message, data);
  }

  static error(res, statusCode, message) {
    return ApiResponse.send(res, statusCode, message);
  }
}

module.exports = ApiResponse;
