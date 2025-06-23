import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';

export const getCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const createCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: err.message });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const deleteCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);
    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Некорректный ID карточки' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const likeCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);

    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Некорректный ID карточки' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const dislikeCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);

    if (!card) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    res.send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Некорректный ID карточки' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
