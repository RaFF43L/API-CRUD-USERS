import { Router } from 'express';
import { DefaultRouter } from './defaultRoute';
import { UserRoutes } from './domain/User/user.routes';
const AppRouter = Router();

AppRouter.use('/', DefaultRouter).use('/users', UserRoutes);

export { AppRouter };
