import mongoose, { Model, Document, HydratedDocument } from 'mongoose';

interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

interface IUserMethods {
  toJSON(): string;
}

const userSchema = new mongoose.Schema<IUser, IUserMethods>({
  name: {
    type: String,
    required: true,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    required: true,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, { versionKey: false });

export default mongoose.model<IUser>('user', userSchema);
