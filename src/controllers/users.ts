import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).send({ message: 'Некорректный ID пользователя' });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.status(201).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: err.message });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: err.message });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: err.message });
      return;
    }
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
