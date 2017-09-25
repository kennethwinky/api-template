import config from 'config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export default class {
  constructor({ security, APIError, ErrorCode, db, mongoose }) {
    this.APIError = APIError;
    this.ErrorCode = ErrorCode;
    this.db = db;
    this.mongoose = mongoose;
    this.security = security;

    this.adminCollection = this.db.collection('admins');
  }

  async userVerify(req, res, next) {
    try {
      const security = config.get('security');
      const token = req.get(security.loginTokenKey);
      if (token) {
        const tokenHash = crypto.createHmac('sha256', security.loginTokenSalt).update(token).digest('hex').substring(0, 16);
        const decoded = jwt.verify(token, security.loginTokenSalt);
        const { email } = decoded;
        const admin = (await this.adminCollection.findOne(
          { token: tokenHash },
        ));
        if (!admin) {
          const err = new this.APIError('Invalid Token', 500, this.ErrorCode.AUTH_FAIL, true);
          return next(err);
        }
        const { _id } = admin;
        req.user = { email, _id };
        return next();
      }
      const err = new this.APIError('No Authorization Header', 500, this.ErrorCode.AUTH_FAIL, true);
      return next(err);
    } catch (err) {
      return next(err);
    }
  }
}
