import Controller from './base';

export default class AdminController extends Controller {

  constructor({
    adminModel,
    ...necessaryModules,
  }) {
    super(necessaryModules);

    Object.assign(this, {
      adminModel,
    });

    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/', this.getAdmins.bind(this));
  }

  async getAdmins(req, res, next) {
    let adminResult;
    try {
      adminResult = await this.adminModel.find().lean();
    } catch (e) {
      return next(e);
    }
    return res.formatSend(adminResult);
  }
}
