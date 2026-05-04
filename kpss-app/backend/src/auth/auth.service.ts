import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: AuthDto): Promise<{ token: string }> {
    const existing = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (existing) {
      throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      username: dto.username,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return { token };
  }

  async login(dto: AuthDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Kullanıcı adı veya şifre hatalı');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return { token };
  }
}
