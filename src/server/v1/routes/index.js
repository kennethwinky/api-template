import compression from 'compression';
import cors from 'cors';

import {
  CategoryController,
  AdminController,
  AccountController,
} from '../controllers';

import * as model from '../models';

export default class {
  constructor({
    db,
    express,
    mongoose,
    AWS,
    moment,
    config,
    security,
    s3Bucket,
    APIError,
    ErrorCode,
    ParamValidation,
  }) {
    Object.assign(this, {
      db,
      express,
      mongoose,
      AWS,
      moment,
      config,
      security,
      s3Bucket,
      APIError,
      ErrorCode,
      ParamValidation,
    });
    const router = express.Router(); // eslint-disable-line new-cap

    const necessaryModules = {
      APIError: this.APIError,
      ErrorCode: this.ErrorCode,
      db: this.db,
      mongoose: this.mongoose,
      ParamValidation: this.ParamValidation,
    };

    const categoryModel = new model.Category(this.mongoose);
    const adminModel = new model.Admin(this.mongoose);

    if (process.env.GZIP_RESPONSE) {
      router.use(compression());
    }

    if (process.env.CORS) {
      router.options('*', cors());
      router.use(cors());
    }

    router.get('/', (req, res) => {
      res.json({ msg: 'service started' });
    });

    const categoryRouterV1 = express.Router();
    router.use('/category', categoryRouterV1);
    const categoryController = new CategoryController(
      Object.assign(necessaryModules, { router: categoryRouterV1 }),
    );
    const adminRouterV1 = express.Router();
    router.use('/admin', adminRouterV1);
    const adminController = new AdminController(
      Object.assign(necessaryModules, { router: adminRouterV1 }),
    );
    const accountRouterV1 = express.Router();
    router.use('/account', accountRouterV1);
    const accountController = new AccountController(
      Object.assign(necessaryModules, {
        router: accountRouterV1,
        adminModel,
      }),
    );

    return router;
  }
}
