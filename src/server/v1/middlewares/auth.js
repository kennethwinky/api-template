
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export default class {
  constructor({ security, APIError, ErrorCode, db, mongoose, adminModel }) {
    Object.assign(this, {
      security,
      APIError,
      ErrorCode,
      db,
      mongoose,
      adminModel,
    });

    this.userVerify = this.userVerify.bind(this);
  }

  async userVerify(req, res, next) {
    try {
      const token = req.get(this.security.loginTokenKey);
      if (token) {
        const tokenHash = crypto.createHmac('sha256', this.security.loginTokenSalt).update(token).digest('hex').substring(0, 16);
        const decoded = jwt.verify(token, this.security.loginTokenSalt);
        const { email } = decoded;
        const admin = (await this.adminModel.findOne(
          { token: tokenHash },
        ));
        if (!admin) {
          const err = new this.APIError('Invalid Token', 500, this.ErrorCode.AUTH_FAIL);
          return next(err);
        }
        const { _id } = admin;
        req.user = { email, _id };
        return next();
      }
      const err = new this.APIError('No Authorization Header', 500, this.ErrorCode.AUTH_FAIL);
      return next(err);
    } catch (e) {
      e.displayError = this.ErrorCode.AUTH_FAIL;
      return next(e);
    }
  }
}
