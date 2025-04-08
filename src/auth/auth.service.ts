import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { Authdto, Logindto } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: Logindto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    // if user not found, throw an error
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // compare the password
    const passwordMatches = await argon.verify(user.password, dto.password);
    //if password is incorrect, throw an error
    if (!passwordMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // return the user
    return {
      message: 'User logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async signup(dto: Authdto) {
    try {
      // hash the password
      const hashedPassword = await argon.hash(dto.password);
      // save the user in the database
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        message: 'User created successfully',
        user,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }

    // return the saved user
  }
}
