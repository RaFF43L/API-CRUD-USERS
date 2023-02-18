import { Schema, model } from 'mongoose';
import { User } from './user.model';

const SchemaUserModel = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

const SchemaUser = model<User>('users', SchemaUserModel);

export { SchemaUser };
