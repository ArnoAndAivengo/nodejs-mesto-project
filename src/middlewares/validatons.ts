import { Joi, celebrate } from 'celebrate';
import { Types } from 'mongoose';

const URL_REGEX = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const ERROR_MESSAGES = {
  STRING_EMPTY: (field: string) => `Поле "${field}" должно быть заполнено`,
  INVALID_URL: (field: string) => `Поле "${field}" должно быть валидным url-адресом`,
  INVALID_EMAIL: 'Поле "email" должно быть валидным email-адресом',
  INVALID_ID: 'Невалидный id',
  STRING_LENGTH: (field: string, min: number, max: number) => ({
    'string.min': `Минимальная длина поля "${field}" - ${min}`,
    'string.max': `Максимальная длина поля "${field}" - ${max}`,
  }),
};

const validateObjectId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => (
      Types.ObjectId.isValid(value)
        ? value
        : helpers.message({ any: ERROR_MESSAGES.INVALID_ID })
    )),
  }),
});

const nameSchema = (field = 'name', isRequired = true) => {
  const schema = Joi.string().min(2).max(30)
    .messages({
      ...ERROR_MESSAGES.STRING_LENGTH(field, 2, 30),
      ...(isRequired && { 'string.empty': ERROR_MESSAGES.STRING_EMPTY(field) }),
    });
  return isRequired ? schema.required() : schema;
};

const urlSchema = (field: string, isRequired = true) => {
  const schema = Joi.string().pattern(URL_REGEX)
    .messages({
      'string.pattern.base': ERROR_MESSAGES.INVALID_URL(field),
      ...(isRequired && { 'string.empty': ERROR_MESSAGES.STRING_EMPTY(field) }),
    });
  return isRequired ? schema.required() : schema;
};

const emailSchema = Joi.string().required().email()
  .messages({
    'string.email': ERROR_MESSAGES.INVALID_EMAIL,
    'string.empty': ERROR_MESSAGES.STRING_EMPTY('email'),
  });

const passwordSchema = Joi.string().required()
  .messages({
    'string.empty': ERROR_MESSAGES.STRING_EMPTY('password'),
  });

// Валидации
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: nameSchema(),
    link: urlSchema('link'),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: nameSchema('name', false),
    about: nameSchema('about', false),
    password: passwordSchema,
    email: emailSchema,
    avatar: urlSchema('avatar', false),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: emailSchema,
    password: passwordSchema,
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: urlSchema('avatar'),
  }),
});

const validateProfile = celebrate({
  body: Joi.object().keys({
    name: nameSchema(),
    about: nameSchema('about'),
  }),
});

export {
  URL_REGEX as urlRegExp,
  validateObjectId as validateObjId,
  validateCardBody,
  validateUserBody,
  validateAuthentication,
  validateAvatar,
  validateProfile,
};
