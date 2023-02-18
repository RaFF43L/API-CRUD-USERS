import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { UserService } from './user.service';
import { User } from './user.model';

class UserController {
  async searchUser(req: Request, res: Response) {
    const { status, result } = await UserService.searchUser();
    res.status(status).send(result);
  }

  async createUser(req: Request, res: Response) {
    const user: User = req.body;

    const { status, result } = await UserService.createUser(user);
    res.status(status).send(result);
  }

  async sendEmail(req: Request, res: Response) {
    const { email } = req.params;

    const { isValid, result } = await UserService.searchEmail(email);

    if (isValid) {
      const { status, message } = await UserService.sendEmail(email, result);

      res.status(status).send({ message: message });
    } else {
      res.status(406).send({ idValid: isValid, message: result });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { id } = req.params;
    const { password } = req.body;

    const { status, message } = await UserService.resetPassword(
      new Types.ObjectId(id),
      password,
    );
    res.status(status).send(message);
  }
}

const controller = new UserController();

export { controller as UserController };
