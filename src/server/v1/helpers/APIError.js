import httpStatus from 'http-status';

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(systemMsg, status, displayError, isPublic) {
    super(systemMsg);
    this.name = this.constructor.name;
    this.message = systemMsg;
    this.displayError = displayError;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(
    systemMsg,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    displayError = {
      code: -1,
      message: 'unknown error',
      values: {},
    },
    isPublic = true) {
    const error = (displayError) || {
      code: -1,
      message: 'unknown error',
      values: {},
    };
    super(systemMsg, status, error, isPublic);
  }
}

export default APIError;
