import S3 from "react-aws-s3";
import { awsconfig } from "./config/aws";

type TMediaUpload = {
  file: File;
  fileName: string;
  dirName?: string;
}

export const awsUpload = async ({ file, fileName, dirName }: TMediaUpload) => {
  try {
    awsconfig.dirName = dirName;
    const ReactS3Client = new S3(awsconfig);
    const result = await ReactS3Client.uploadFile(file, fileName);
    return result;
  } catch(error) {
    console.log('error', error);
  }
};

export const awsDelete = async ({ fileName, dirName }: TMediaUpload) => {
  try {
    awsconfig.dirName = dirName;
    const ReactS3Client = new S3(awsconfig);
    const result = await ReactS3Client
      .deleteFile(fileName)
      .then((response: any) => console.log('deleted response', response))
      .catch((err: any) => console.error('delete error', err));
    return result;
  } catch(error) {
    console.log('error', error);
  }
};