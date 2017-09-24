
export default class Controller {
  constructor({ router, APIError, ErrorCode, db, mongoose, ParamValidation }) {
    Object.assign(this, {
      router,
      APIError,
      ErrorCode,
      db,
      mongoose,
      ParamValidation,
    });
  }
}
