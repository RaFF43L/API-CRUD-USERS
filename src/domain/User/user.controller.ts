import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { UserService } from './user.service';
import { User } from './user.model';
import { createClient } from 'redis';

class UserController {
  async searchUser(req: Request, res: Response) {
    try {
      const { status, result }: any = await UserService.searchUser();
      res.status(status).send(result);
    } catch (error) {
      console.log(JSON.stringify(error));
      res.status(error.status).send({ message: error.message });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user: User = req.body;

      const { status, result } = await UserService.createUser(user);
      res.status(status).send(result);
    } catch (error) {
      console.log(JSON.stringify(error));
      res.status(error.status).send({ message: error.message });
    }
  }

  async LoginUser(req: Request, res: Response) {
    const client = createClient();
    client.connect();

    client.on('error', (error) => {
      console.error('error Redis', error);
    });

    const result = await client.get('token');

    if (result) {
      res.status(200).send({ token: result });
      await client.disconnect();
      return;
    }

    try {
      const user: User = req.body;

      const { status, result } = await UserService.LoginUser(user);
      await client.set('token', result, { EX: 60 * 60 });
      res.status(status).send({ token: result });
    } catch (error) {
      console.log(JSON.stringify(error));
      res.status(error.status).send({ message: error.message });
    }
  }

  async sendEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const { result } = await UserService.searchEmail(email);

      const { status, message } = await UserService.sendEmail(email, result);

      res.status(status).send({ message: message });
    } catch (error) {
      console.log(JSON.stringify(error));
      res.status(error.status).send({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { password } = req.body;

      const { status, message } = await UserService.resetPassword(
        new Types.ObjectId(id),
        password,
      );
      res.status(status).send(message);
    } catch (error) {
      console.log(JSON.stringify(error));
      res.status(error.status).send({ message: error.message });
    }
  }
}

const controller = new UserController();

export { controller as UserController };
