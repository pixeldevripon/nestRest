import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as toStream from 'buffer-to-stream';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class CloudinaryService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get('CLOUDE_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFileToCloudinary(file: Express.Multer.File) {
    if (!file) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'hotels' },
        (error, result) => {
          if (error) {
            // Handle the error properly by checking its type
            if (error instanceof Error) {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
              return reject(error); // Now we are sure that 'error' is an instance of Error
            }
            // If error is not an instance of Error, reject with a generic message
            return reject(new Error('Unknown upload error'));
          }

          // Explicit check if result is undefined (though it shouldn't be)
          if (!result) {
            return reject(
              new Error('Cloudinary upload failed: No result returned.'),
            );
          }

          resolve(result);
        },
      );
      // Ensure the buffer is of type Buffer before passing it to toStream
      if (!Buffer.isBuffer(file.buffer)) {
        return reject(new Error('Uploaded file is not a valid buffer.'));
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      toStream(file?.buffer).pipe(uploadStream);
    });
  }
}
