import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    let createdUser = await this.create({ username, password: hashPassword });
    try {
      await this.save(createdUser);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('Username Already Exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
