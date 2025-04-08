import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { HotelModule } from './hotel/hotel.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismaModule, HotelModule],
})
export class AppModule {}
