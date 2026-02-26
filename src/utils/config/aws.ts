export const awsconfig = {
    bucketName: process.env.NEXT_PUBLIC_APP_AWS_BUCKET_NAME,
    region: process.env.NEXT_PUBLIC_APP_AWS_REGION,
    accessKeyId: process.env.NEXT_PUBLIC_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_APP_AWS_SECRET_ACCESS_KEY,
    s3Url: process.env.NEXT_PUBLIC_APP_S3URL
} as any;