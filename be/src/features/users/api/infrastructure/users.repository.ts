import { User } from '../domain/User';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersRepository {
  async findUserByUsername(username: string) {
    return await User.findOne({ where: { username } });
  }

  async createUser(username: string) {
    const newUser = User.create({
      username: username,
      code: uuidv4(),
    });

    return await newUser.save();
  }
}
