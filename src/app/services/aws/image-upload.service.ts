import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { DeleteObjectOutput } from 'aws-sdk/clients/s3';

import { environment } from '../../../environments/environment';

import SendData = ManagedUpload.SendData;

@Injectable()
export class ImageUploadService {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public uploadFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const bucket: S3 = this.getS3ConfigInstance();
      const contentType: string = file.type;

      // eslint-disable-next-line @typescript-eslint/typedef
      const params = {
        Bucket: environment.aws.userPhotosBucket,
        Key: environment.aws.userPhotosFolder + file.name,
        Body: file,
        ACL: 'public-read',
        ContentType: contentType,
      };

      bucket.upload(params, (err: Error, data: SendData) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public removePreviousProfileImage(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const bucket: S3 = this.getS3ConfigInstance();

      // eslint-disable-next-line @typescript-eslint/typedef
      const params = {
        Bucket: environment.aws.userPhotosBucket,
        Key: filePath,
      };
      bucket.deleteObject(params, (err: Error, data: DeleteObjectOutput) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  private getS3ConfigInstance(): S3 {
    return new S3({
      accessKeyId: environment.aws.accessKey,
      secretAccessKey: environment.aws.secretKey,
      region: environment.aws.region,
    });
  }
}
