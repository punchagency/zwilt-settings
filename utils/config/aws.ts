export const awsconfig = {
  bucketName:
    process.env.AWS_BUCKET_NAME || process.env.NEXT_PUBLIC_APP_AWS_BUCKET_NAME,
  region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_APP_AWS_REGION,
  accessKeyId:
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.NEXT_PUBLIC_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey:
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.NEXT_PUBLIC_APP_AWS_SECRET_ACCESS_KEY,
  s3Url: process.env.NEXT_PUBLIC_APP_S3URL,
} as any;
