import winston from 'winston';

const consoleLogger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true,
    }),
  ],
});

// const fileLogger = new (winston.Logger)({
//   transports: [
//     new (winston.transports.File)({
//       json: true,
//       colorize: true,
//       filename: 'output.log'
//     })
//   ]
// });

// export default { consoleLogger, fileLogger };
export default consoleLogger;
