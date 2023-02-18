import nodemailer from 'nodemailer';
import { Types } from 'mongoose';
import { SchemaUser } from './user.shema';
import { User } from './user.model';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserService {
  async searchUser() {
    return await SchemaUser.find({})
      .then((result) => {
        return { result: result, status: 200 };
      })
      .catch((error: Error) => {
        console.log(JSON.stringify(error));
        return { result: 'Erro ao buscar email', status: 400 };
      });
  }

  async createUser(user: User) {
    user.password = hashSync(user.password, genSaltSync(10));

    return await SchemaUser.create(user)
      .then((result) => {
        return { status: 201, result: result };
      })
      .catch((error: Error) => {
        console.log(JSON.stringify(error));
        return { status: 400, result: 'Erro ao criar usuário' };
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
      .catch((e) => {
        console.log(e);
        return { status: 406, result: 'Usuário não encontrado!' };
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
      .catch((error: Response) => {
        console.log(JSON.stringify(error));
        return { status: 400, message: 'Falha ao enviar email!' };
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
      .catch((error) => {
        console.log(JSON.stringify(error));
        return { status: 400, message: 'Erro ao alterar senha' };
      });
  }

  async searchEmail(email: string) {
    return await SchemaUser.find({ email: email })
      .then((result) => {
        if (result.length === 0) {
          return { result: 'Email não encontrado', isValid: false };
        } else {
          return { result: result[0]._id, isValid: true };
        }
      })
      .catch((error: Error) => {
        console.log(JSON.stringify(error));
        return { result: 'Erro ao buscar email', isValid: false };
      });
  }
}

const service = new UserService();

export { service as UserService };
