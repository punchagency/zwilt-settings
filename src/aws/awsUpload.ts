//hooks folder
// use-aws-upload.ts
import S3 from "react-aws-s3";
import { awsconfig } from "../../utils/config/aws";
import { notifyErrorFxn } from "../../utils/toast-fxn";
import { normalizeImageUrl } from "@/components/common/imageUtils";

interface UploadParams {
  file: File | Blob;
  fileName: string;
  dirName: string;
}

// Helper function to ensure consistent URL format
function normalizeS3Url(url: string | null): string | null {
  if (!url) return null;

  try {
    // Replace any encoded parts of the URL
    let normalizedUrl = url;
    try {
      normalizedUrl = decodeURIComponent(url);
    } catch (e) {
      console.warn("Error decoding URL, using original:", e);
    }

    // Make sure it's using https protocol
    if (normalizedUrl.startsWith("http://")) {
      normalizedUrl = normalizedUrl.replace("http://", "https://");
    }

    // Ensure the URL doesn't have double slashes except after protocol
    normalizedUrl = normalizedUrl.replace(/([^:])\/\//g, "$1/");

    console.log("Normalized URL:", normalizedUrl);
    return normalizedUrl;
  } catch (e) {
    console.error("Error normalizing S3 URL:", e);
    return url;
  }
}

export const awsUpload = async ({ file, fileName, dirName }: UploadParams) => {
  try {
    // Log config to check if environment variables are loaded properly
    console.log("AWS Config:", {
      bucketName: awsconfig.bucketName || "not set",
      region: awsconfig.region || "not set",
      hasAccessKey: !!awsconfig.accessKeyId,
      hasSecretKey: !!awsconfig.secretAccessKey,
      s3Url: awsconfig.s3Url || "not set",
    });

    // Check if AWS config is missing any required fields
    if (
      !awsconfig.bucketName ||
      !awsconfig.region ||
      !awsconfig.accessKeyId ||
      !awsconfig.secretAccessKey
    ) {
      console.error(
        "AWS configuration is incomplete. Missing required fields."
      );
      notifyErrorFxn(
        "AWS configuration is incomplete. Please check your environment variables."
      );
      return { location: null };
    }

    console.log(navigator.onLine, "isOnline");
    if (navigator.onLine) {
      const result = await reTryawsUpload({ file, fileName, dirName });
      // Normalize the URL before returning
      if (result && result.location) {
        return { ...result, location: normalizeS3Url(result.location) };
      }
      return result;
    } else {
      notifyErrorFxn(
        "No internet connection. Please check your internet and try again."
      );
      return { location: null };
    }
  } catch (e) {
    console.log(e, "e");
    notifyErrorFxn(
      "There was an error uploading your file. Please try again in a moment."
    );
    return { location: null };
  }
};

export const reTryawsUpload = async ({
  file,
  fileName,
  dirName,
}: UploadParams) => {
  const ReactS3Client = new S3(awsconfig);
  // Normalize the directory name to ensure it has a trailing slash but no double slashes
  const normalizedDirName = dirName
    ? dirName.endsWith("/")
      ? dirName
      : `${dirName}/`
    : "";
  return await ReactS3Client?.uploadFile(file, fileName);
};
