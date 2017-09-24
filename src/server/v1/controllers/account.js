
import validate from 'express-validation';
import Controller from './base';

export default class AccountController extends Controller {
  constructor({ adminModel, ...necessaryModules }) {
    super(necessaryModules);
    this.registerRoutes();
    this.adminModel = adminModel;

    this.adminCollection = this.db.collection('admins');
  }

  registerRoutes() {
    this.router.post('/', validate(this.ParamValidation.createAdmin), this.createAccount.bind(this));
  }

  async createAccount({ body }, res, next) {
    let adminResult;
    const admin = this.adminModel(body);
    try {
      adminResult = await admin.save();
    } catch (e) {
      return next(e);
    }
    return res.formatSend(adminResult);
  }
}
