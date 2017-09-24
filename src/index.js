
// setup credentials first
import moment from 'moment-timezone';
import AWS from 'aws-sdk';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

import config from 'config';
import HttpServer from './server/httpServer';

mongoose.Promise = bluebird;
mongoose.connect(
  `mongodb://${config.get('mongoose.url')}`,
  {
    useMongoClient: true,
    // ssl: true,
    // poolSize: 10000,
    // reconnectTries: 1,
  },
  (err, db) => {
    if (err) { console.log(err); }
    const s3Credentials = config.get('aws.credentials');
    AWS.config.update(s3Credentials);

    const s3Bucket = config.get('s3.bucket');

    const security = config.get('security');

    moment.tz.setDefault('Asia/Hong_Kong');

    const httpServer = new HttpServer({
      db,
      mongoose,
      AWS,
      moment,
      config,
      security,
      s3Bucket,
    });

    httpServer.start();
  },
);
