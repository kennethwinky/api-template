import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import he from 'he';
import winstonInstance from '../config/winston';
import ErrorCode from '../config/errorcode';
import ApiRouterV1 from '../server/v1/routes';
import { APIError } from './v1/helpers';
import ParamValidation from '../config/param-validation';

export default class {
  constructor({
    db,
    mongoose,
    AWS,
    moment,
    config,
    security,
    s3Bucket,
  }) {
    Object.assign(this, {
      db,
      mongoose,
      AWS,
      moment,
      config,
      security,
      s3Bucket,
    });

    const app = express();
    this.app = app;

    if (config.get('env') === 'development') {
      app.use(logger('dev'));
    }

    // parse body params and attache them to req.body
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cookieParser());
    app.use(compress());
    app.use(methodOverride());

    // secure apps by setting various HTTP headers
    app.use(helmet());

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());

    // enable detailed API logging in dev env
    if (config.env === 'development') {
      expressWinston.requestWhitelist.push('body');
      expressWinston.responseWhitelist.push('body');
      app.use(expressWinston.logger({
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
      }));
    }

    app.use((req, res, next) => {
      if (res.formatSend == null) {
        res.formatSend = (data = {}) => {
          res.status(200).json({
            errorCode: 0,
            errorMsg: 'success',
            data,
          });
        };
      }
      next();
    });

    app.use('/public', express.static('public'));
    // mount all routes on /api path
    const v1 = new ApiRouterV1({
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
    app.use('/v1', v1);

    // if error is not an instanceOf APIError, convert it.
    app.use((err, req, res, next) => {
      if (err instanceof expressValidation.ValidationError) {
        // validation error contains errors which is an array of error each containing message[]
        let unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join('\n');
        unifiedErrorMessage = he.decode(unifiedErrorMessage);
        const error = new APIError(
          unifiedErrorMessage,
          err.status,
          Object.assign(ErrorCode.EXPRESS_VALIDATION_ERROR,
            { values: { message: unifiedErrorMessage } },
          ),
          true,
        );
        return next(error);
      } else if (!(err instanceof APIError)) {
        const apiError = new APIError(err.message, err.status, err.displayError, err.isPublic);
        return next(apiError);
      }
      console.log('err is instance of APIError');
      return next(err);
    });

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      console.log('err is not such route');
      const err = new APIError('API not found', httpStatus.NOT_FOUND);
      return next(err);
    });

    // log error in winston transports except when executing test suite
    if (config.get('env') !== 'test') {
      app.use(expressWinston.errorLogger({
        winstonInstance,
      }));
    }

    // error handler, send stacktrace only during development
    app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
      const { code: errorCode, message, values } = err.displayError;
      let errorMsg = message;
      if (values) {
        Object.keys(values).forEach((key) => {
          errorMsg = errorMsg.replace(`{{${key}}}`, values[key]);
        });
      }
      res.status(err.status).json({
        errorCode,
        errorMsg,
        data: {
          message: err.isPublic ? err.message : httpStatus[err.status],
          stack: config.env === 'development' ? err.stack : {},
        },
      });
    });
  }

  start() {
    const port = this.config.get('server.port');
    this.app.listen(port, () => {
      console.log(`base api server started listening on ${port}`);
    });
  }
}
