
import validate from 'express-validation';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import _ from 'lodash';
import Controller from './base';

export default class AccountController extends Controller {
  constructor({ adminModel, authMiddleware, security, ...necessaryModules }) {
    super(necessaryModules);

    Object.assign(this, {
      adminModel,
      security,
      authMiddleware,
    });

    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post('/login', validate(this.ParamValidation.login), this.login.bind(this));
    this.router.use(this.authMiddleware.userVerify);
    this.router.get('/', this.getProfile.bind(this));
    this.router.post('/', validate(this.ParamValidation.createAdmin), this.createAccount.bind(this));
  }

  async createAccount({ body }, res, next) {
    let adminResult;
    const { password, ...adminObj } = body;

    const hashedPassword = crypto.createHmac('sha256', this.security.loginTokenSalt).update(password).digest('hex').substring(0, 16);
    adminObj.password = hashedPassword;

    const admin = this.adminModel(adminObj);
    try {
      adminResult = await admin.save();
    } catch (e) {
      return next(e);
    }
    return res.formatSend(adminResult);
  }

  async getProfile({ user }, res, next) {
    try {
      const { _id } = user;
      let adminResult = await this.adminModel.findOne(
        { _id },
      ).lean();
      if (!adminResult) {
        return next(new this.APIError('Cannot get profile', 404, this.ErrorCode.AUTH_FAIL));
      }
      adminResult = _.omit(adminResult, 'password', 'token');
      return res.formatSend(adminResult);
    } catch (e) {
      return next(e);
    }
  }

  async login({ body }, res, next) {
    const { email, password } = body;

    const token = jwt.sign(
      {
        email,
      },
      this.security.loginTokenSalt,
      { expiresIn: this.security.loginTokenExpireTime },
    );

    const hashedPassword = crypto.createHmac('sha256', this.security.loginTokenSalt).update(password).digest('hex').substring(0, 16);
    const tokenHash = crypto.createHmac('sha256', this.security.loginTokenSalt).update(token).digest('hex').substring(0, 16);

    try {
      const adminResult = await this.adminModel.findOne(
        { email, password: hashedPassword },
      );
      if (!adminResult) {
        return next(new this.APIError('Login fail', 401, this.ErrorCode.LOGIN_FAIL));
      }
      const { _id, displayName } = adminResult;
      await this.adminModel.update(
        { _id },
        { $set: { token: tokenHash } },
      );
      return res.formatSend(Object.assign({},
        {
          email,
          displayName,
          [this.security.loginTokenKey]: token,
        },
      ));
    } catch (e) {
      return next(e);
    }
  }
}
