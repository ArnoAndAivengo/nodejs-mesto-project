import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

const handleCardNotFound = () => {
  throw new NotFoundError('Нет карточки по заданному id');
};

const checkCardOwnership = (cardUserId: ObjectId, currentUserId: string) => {
  if (cardUserId.toString() !== currentUserId) {
    throw new ForbiddenError('Нельзя удалить чужую карточку');
  }
};

/**
 * Получение данных всех карт
 */
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

/**
 * Создание новой карты
 */
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(201).send(card);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

/**
 * Удаление карты
 */
export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const card = await Card.findById(id).orFail(handleCardNotFound);

    checkCardOwnership(card.owner, req.user._id);

    await Card.deleteOne({ _id: card._id });
    res.send(card);
  } catch (err) {
    next(err);
  }
};

/**
 * Обновление Like
 */
const updateLike = async (req: Request, res: Response, next: NextFunction, method: string) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findByIdAndUpdate(
      id,
      { [method]: { likes: userId } },
      { new: true },
    ).orFail(handleCardNotFound);

    res.send(card);
  } catch (err) {
    next(err);
  }
};

/**
 * Добавление Like
 */
export const likeCard = (req: Request, res: Response, next: NextFunction) => (
  updateLike(req, res, next, '$addToSet')
);

/**
 * Удаление Like
 */
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => (
  updateLike(req, res, next, '$pull')
);
