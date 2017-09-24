
module.exports = {
  env: process.env.NODE_ENV,
  mongoose: {
    url: process.env.MONGODB_URL,
  },
  server: {
    port: process.env.PORT,
  },
  aws: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'ap-southeast-1',
    },
  },
  s3: {
    bucket: process.env.AWS_S3_BUCKET,
  },
  security: {
    loginTokenKey: process.env.LOGIN_TOKEN_KEY,
    loginTokenSalt: process.env.LOGIN_TOKEN_SALT,
    loginTokenExpireTime: process.env.LOGIN_TOKEN_EXPIRE_TIME,
  },
};
