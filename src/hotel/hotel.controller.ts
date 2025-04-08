import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { hotelDto } from './dto';
import { HotelService } from './hotel.service';

@Controller('api/hotel')
export class HotelController {
  constructor(private hotelService: HotelService) {}

  // create a new hotel
  @Post()
  createHotel(@Body() dto: hotelDto) {
    return this.hotelService.createHotel(dto);
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
