import { constants } from 'http2';

import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const { statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR } = err;
  const isErrorInternal = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = isErrorInternal ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
};

export default errorHandler;
