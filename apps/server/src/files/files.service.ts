import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { cloudinary } from "./cloudinary.provider";
import { Readable } from "stream";

@Injectable()
export class FilesService {
  async uploadFile(
    file: Express.Multer.File,
    folder = "uploads",
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error || !result) {
            return reject(
              new InternalServerErrorException("Cloudinary upload failed"),
            );
          }
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
