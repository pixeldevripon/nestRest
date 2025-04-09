import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { hotelDto } from './dto';
import { HotelService } from './hotel.service';

@Controller('api/hotel')
export class HotelController {
  constructor(
    private hotelService: HotelService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // create a new hotel
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      /*   storage: diskStorage({
        destination: './uploads/hotels', // uploaded destination
        filename: (req, file, cb) => {
          const fileExtension = path.extname(file.originalname); // get file extension
          const fileName = `hotel ${Date.now()}${fileExtension}`; // create a unique file name
          cb(null, fileName); // callback with the unique file name
        },
      }), */
      storage: memoryStorage(),
    }),
  )
  async createHotel(
    @Body() dto: hotelDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const upoadedImageLink =
      await this.cloudinaryService.uploadFileToCloudinary(file);
    return this.hotelService.createHotel(dto, upoadedImageLink.secure_url);
  }

  // GET all hotels
  @Get()
  getAllHotels() {
    return this.hotelService.getAllHotels();
  }

  // GET a single hotel by ID
  @Get(':id')
  getHotelById(@Param('id') id: string) {
    return this.hotelService.getHotelById(id);
  }

  // Update a hotel by ID
  @Patch(':id')
  updateHotel(@Param('id') id: string, @Body() dto: hotelDto) {
    return this.hotelService.updateHotelById(id, dto);
  }

  // Delete a hotel by ID
  @Delete(':id')
  deleteHotel(@Param('id') id: string) {
    return this.hotelService.deleteHotelById(id);
  }
}
