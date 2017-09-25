
module.exports = {
  SUCCESS: {
    code: 0,
    message: 'success',
  },
  DATA_NOT_FOUND: {
    code: -1,
    message: 'data not found: {{value}}',
  },
  EXPRESS_VALIDATION_ERROR: {
    code: -2,
    message: '{{message}}',
  },
  LOGIN_FAIL: {
    code: -3,
    message: '電郵/密碼錯誤',
  },
  AUTH_FAIL: {
    code: -4,
    message: '沒有權限',
  },
};
