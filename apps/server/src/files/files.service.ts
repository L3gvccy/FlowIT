import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { cloudinary } from "./cloudinary.provider";
import { Readable } from "stream";
import path from "path";

@Injectable()
export class FilesService {
  async uploadFile(
    file: Express.Multer.File,
    folder = "uploads",
  ): Promise<UploadApiResponse> {
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext);

    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".gif",
      ".svg",
      ".avif",
    ];

    const isImage = imageExtensions.includes(ext);
    const resourceType = isImage ? "image" : "raw";

    const publicId = isImage
      ? `${folder}/${baseName}`
      : `${folder}/${baseName}${ext}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: resourceType,
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
