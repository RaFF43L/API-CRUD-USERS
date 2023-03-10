import { Router } from 'express';
import { messages } from 'joi-translation-pt-br';
import {
  bodySchemaUser,
  ParamsSchemaUserSendEmail,
  ParamsSchemaUserReset,
} from '../../components/validatorSchema';
import { UserController } from './user.controller';
import { celebrate, Segments } from 'celebrate';

const routes = Router();

routes.get(
  '/sendEmail/:email',
  celebrate(
    { [Segments.PARAMS]: ParamsSchemaUserSendEmail },
    { messages: messages },
  ),
  UserController.sendEmail,
);
routes.post(
  '/',
  celebrate({ [Segments.BODY]: bodySchemaUser }, { messages: messages }),
  UserController.createUser,
);
routes.put(
  '/reset/:id',
  celebrate(
    { [Segments.PARAMS]: ParamsSchemaUserReset },
    { messages: messages },
  ),
  UserController.resetPassword,
);
routes.get('/', UserController.searchUser);

routes.post('/login', UserController.LoginUser);

export { routes as UserRoutes };
