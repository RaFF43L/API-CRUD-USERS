import { Joi } from 'celebrate';
import { User } from '../domain/User/user.model';

const bodySchemaUser = Joi.object<User>().keys({
  name: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .required()
    .min(8),
  cpf: Joi.string()
    // eslint-disable-next-line
    .pattern(new RegExp('^((d{3}).(d{3}).(d{3})-(d{2}))*'))
    .required(),
});

const ParamsSchemaUserSendEmail = Joi.object().keys({
  email: Joi.string().email().required(),
});

const ParamsSchemaUserReset = Joi.object().keys({
  id: Joi.string().required(),
});

export { bodySchemaUser, ParamsSchemaUserSendEmail, ParamsSchemaUserReset };
