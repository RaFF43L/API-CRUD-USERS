import nodemailer from 'nodemailer';
import { Types } from 'mongoose';
import { SchemaUser } from './user.shema';
import { User } from './user.model';
import { HttpException } from '../../utils/httpException.util';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserService {
  async searchUser() {
    const result = await SchemaUser.find({})
      .then((result) => {
        return { result: result, status: 200 };
      })
      .catch((error: Error) => {
        console.log(JSON.stringify(error));
        throw new HttpException(400, 'Erro ao buscar usuário');
      });
    if (result.result.length === 0) {
      throw new HttpException(406, 'Nenhum usuário encontrado');
    }
    return result;
  }

  async createUser(user: User) {
    user.password = hashSync(user.password, genSaltSync(10));

    return await SchemaUser.create(user)
      .then((result) => {
        return { status: 201, result: result };
      })
      .catch((error: Error) => {
        console.log(JSON.stringify(error));
        throw new HttpException(400, 'Erro ao criar usuário');
      });
  }

  async LoginUser(user: User) {
    return await SchemaUser.findOne({
      email: user.email,
    })
      .then((dataValues) => {
        const checkPassword = compareSync(user.password, dataValues.password);
        if (checkPassword) {
          const token = jwt.sign(
            { id: dataValues._id, email: dataValues.email },
            process.env.JWTSecret,
            { expiresIn: '1h' },
          );
          return { status: 200, result: token };
        } else {
          return { status: 400, result: 'Senha incorreta!' };
        }
      })
      .catch((error: Error) => {
        console.log(JSON.stringify(error));
        throw new HttpException(400, 'Usuário não encontrado!');
      });
  }

  async sendEmail(email: string, id: Types.ObjectId | string) {
    const emailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'rafaelribeirosousa013@gmail.com',
        pass: 'fffxxyxwytxsegoj',
      },
    });
    const emailDetails = {
      from: 'Raffael Pimentel <rafaelribeirosousa013@gmail.com>',
      to: email,
      subject: 'Test mail',
      html: `<a href="http://localhost:9999/${id}"> Link para alterar password <a/>`,
      text: 'Node.js testing mail for GeeksforGeeks',
    };

    return emailTransporter
      .sendMail(emailDetails)
      .then(() => {
        return { status: 200, message: 'Email enviando com sucesso!' };
      })
      .catch((error: Error) => {
        console.log(JSON.stringify(error));
        throw new HttpException(400, 'Falha ao enviar email!');
      });
  }

  async resetPassword(id: Types.ObjectId, password: string): Promise<any> {
    return await SchemaUser.findOneAndUpdate(
      { _id: id },
      { password: hashSync(password, genSaltSync(10)) },
      { new: true },
    )
      .then(() => {
        return { status: 200, message: 'Senha alterada com sucesso' };
      })
      .catch((error: Error) => {
        console.log(JSON.stringify(error));
        throw new HttpException(400, 'Erro ao alterar senha');
      });
  }

  async searchEmail(email: string) {
    return await SchemaUser.findOne({ email: email })
      .then((result) => {
        if (!result) {
          throw new HttpException(406, 'Email não encontrado');
        } else {
          return { result: result._id };
        }
      })
      .catch((error: Error) => {
        console.log(JSON.stringify(error));
        throw new HttpException(400, 'Erro ao buscar email');
      });
  }
}

const service = new UserService();

export { service as UserService };
