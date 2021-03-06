import _ from 'lodash';
import Controller from './base';

export default class CategoryController extends Controller {
  constructor({
    categoryModel,
    ...necessaryModules,
  }) {
    super(necessaryModules);

    Object.assign(this, {
      categoryModel,
    });

    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/', this.getCategories.bind(this));
    this.router.get('/:categoryId', this.getSingleCategory.bind(this));
  }

  async getCategories(req, res, next) {
    let categoryResult;
    try {
      categoryResult = await this.categoryModel.find().lean();
    } catch (e) {
      return next(e);
    }
    categoryResult = categoryResult.map(c => _.omit(c, 'createdAt', 'updatedAt'));
    return res.formatSend(categoryResult);
  }

  async getSingleCategory({ params }, res, next) {
    const { categoryId } = params;

    let categoryResult;
    try {
      categoryResult = await this.categoryModel.findOne(
        { _id: this.mongoose.Types.ObjectId(categoryId) },
      );
    } catch (e) {
      e.displayError = Object.assign(this.ErrorCode.DATA_NOT_FOUND,
        { values: { value: categoryId } },
      );
      return next(e);
    }
    return res.formatSend(categoryResult);
  }
}
