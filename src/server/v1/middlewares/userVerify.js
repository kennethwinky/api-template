import config from 'config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import APIError from '../../../../APIError';
import ErrorCode from '../../../../config/errorcode';

export default function ({
  AdminModel,
  SalesAdminModel,
  SalesPersonModel,
  MerchantModel,
  InstallerModel,
}) {
  return async (req, res, next) => {
    try {
      const security = config.get('security');
      const token = req.get(security.loginTokenKey);
      if (token) {
        const tokenHash = crypto.createHmac('sha256', security.loginTokenSalt).update(token).digest('hex').substring(0, 16);
        const decoded = jwt.verify(token, security.loginTokenSalt);
        const roleModelMap = {
          admin: AdminModel,
          salesAdmin: SalesAdminModel,
          salesPerson: SalesPersonModel,
          merchant: MerchantModel,
          installer: InstallerModel,
        };
        if (!decoded.role || !roleModelMap[decoded.role]) {
          const err = new APIError('No Such Role', 500, ErrorCode.ROLE_NOT_FOUND, true);
          next(err);
        }
        const model = roleModelMap[decoded.role];
        const { role, phone, email } = decoded;
        const exist = (role === 'merchant')
          ? await model.checkPhoneExists({ phone })
          : await model.checkEmailExists({ email });
        if (!exist) {
          const err = new APIError('Invalid token', 404, ErrorCode.TOKEN_INVALID, true);
          return next(err);
        }
        const id = [] + (await model.id(tokenHash));
        req.user = { role, id };
        return next();
      }
      const err = new APIError('No Authorization Header', 500, ErrorCode.ROLE_NOT_FOUND, true);
      return next(err);
    } catch (err) {
      return next(err);
    }
  };
}
