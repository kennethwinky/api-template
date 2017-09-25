import Controller from './base';

export default class AdminController extends Controller {
  constructor(necessaryModules) {
    super(necessaryModules);

    this.adminCollection = this.db.collection('admins');

    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/', this.getAdmins.bind(this));
  }

  async getAdmins(req, res, next) {
    let adminResult;
    try {
      adminResult = await this.adminCollection.find().toArray();
    } catch (e) {
      return next(e);
    }
    return res.formatSend(adminResult);
  }
}
