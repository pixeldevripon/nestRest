import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { hotelDto } from './dto';

@Injectable({})
export class HotelService {
  constructor(private prisma: PrismaService) {}

  // ----------Method to create a new hotel-----------------
  async createHotel(dto: hotelDto) {
    // save the hotel in the database
    const hotel = await this.prisma.hotel.create({
      data: { ...dto },
    });

    // return the created hotel
    return {
      message: 'Hotel created successfully',
      hotel,
    };
  }

  // ---------------Method to get all hotels-----------------

  async getAllHotels() {
    // fetch all hotels from the database
    const hotels = await this.prisma.hotel.findMany();

    // if no hotels found, throw an error
    if (hotels.length === 0) {
      throw new NotFoundException('No hotels found');
    }
    // return the list of hotels
    return {
      message: 'List of all hotels',
      totalFound: hotels.length,
      hotels,
    };
  }

  // ------------- Method to get a hotel by ID-----------------
  async getHotelById(id: string) {
    try {
      // fetch the hotel by ID from the database
      const hotel = await this.prisma.hotel.findUnique({ where: { id: id } });
      // if hotel not found, throw an error

      if (!hotel) {
        throw new NotFoundException('Hotel not found');
      }
      // return the hotel details
      return {
        message: `Details of hotel with ID: ${id}`,
        hotel,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Hotel not found');
        }
        throw new NotFoundException('No hotel found with the given ID');
      }
      throw error;
    }
  }

  // ---------------Method to update a hotel by ID-----------------
  async updateHotelById(id: string, dto: hotelDto) {
    try {
      // fetch the hotel by ID from the database

      const hotel = await this.prisma.hotel.findUnique({ where: { id: id } });

      // if hotel not found, throw an error
      if (!hotel) {
        throw new NotFoundException('Hotel not found');
      }

      // if found, update the hotel
      const updatedHotel = await this.prisma.hotel.update({
        where: { id: id },
        data: { ...dto },
      });

      // return the updated hotel
      return {
        message: `Hotel with ID: ${id} updated successfully`,
        hotel: updatedHotel,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Hotel not found');
        }
        throw new NotFoundException('No hotel found with the given ID');
      }
      throw error;
    }
  }

  // ---------------Method to delete a hotel by ID-----------------

  async deleteHotelById(id: string) {
    try {
      // find the hotel by ID from the database
      const hotel = await this.prisma.hotel.findUnique({ where: { id: id } });
      // if hotel not found, throw an error
      if (!hotel) {
        throw new NotFoundException('Hotel not found');
      }
      // if found, delete the hotel
      await this.prisma.hotel.delete({ where: { id: id } });
      // return the success message
      return {
        message: `Hotel with ID: ${id} deleted successfully`,
        hotel,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Hotel not found');
        }
        throw new NotFoundException('No hotel found with the given ID');
      }
      throw error;
    }
  }
}
