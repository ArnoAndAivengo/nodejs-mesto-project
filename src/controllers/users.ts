import {
  Request,
  Response,
  NextFunction,
} from 'express';
import User from '../models/user';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar,
  } = req.body;

  User.create({
    name, about, avatar,
  })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const getUsersAll = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .orFail(() => new NotFoundError('Пользователь по заданному id отсутствует в базе'))
    .then((users) => res.send(users))
    .catch(next);
};

const getUserData = (id: string, res: Response, next: NextFunction) => {
  User.findById(id)
    .orFail(() => new NotFoundError('Пользователь по заданному id отсутствует в базе'))
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
  getUserData(req.params.id, res, next);
};

const updateUserData = (req: Request, res: Response, next: NextFunction) => {
  const { user: { _id }, body } = req;
  User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь по заданному id отсутствует в базе'))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserInfo = (
  req: Request,
  res: Response,
  next: NextFunction,
) => updateUserData(req, res, next);

const updateUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => updateUserData(req, res, next);

export {
  updateUserInfo,
  updateUserAvatar,
  createUser,
  getUsersAll,
  getUser,
};
