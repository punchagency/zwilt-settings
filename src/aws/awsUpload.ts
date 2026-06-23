import { notifyErrorFxn } from "../../utils/toast-fxn";

interface UploadParams {
  file: File | Blob;
  fileName: string;
  dirName: string;
}

/**
 * Uploads a file to S3 using a pre-signed URL obtained from the backend.
 * This strategy is more secure as it doesn't expose AWS credentials to the frontend.
 */
export const awsUpload = async ({ file, fileName, dirName }: UploadParams) => {
  try {
    if (!navigator.onLine) {
      notifyErrorFxn("No internet connection. Please check your internet and try again.");
      return { location: null };
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("zw_us") : null;
    const parsedToken = token ? JSON.parse(token) : null;
    const baseUrl = process.env.NEXT_PUBLIC_APP_SERVER || "http://localhost:5005";

    console.log("[AWS] Requesting presigned URL...", { fileName, dirName });

    // 1. Get presigned URL from our backend
    const response = await fetch(`${baseUrl}/api/v1/identity/upload-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(parsedToken?.token && { "x-auth-token": parsedToken.token }),
      },
      body: JSON.stringify({
        fileName,
        fileType: (file as File).type,
        fileSize: (file as File).size,
        dirName: dirName || "profile_images",
      }),
    });

    const uploadUrlData = await response.json();

    if (!response.ok) {
      console.error("[AWS] Failed to get presigned URL:", uploadUrlData);
      throw new Error(uploadUrlData.message || "Failed to get upload URL");
    }

    const { presignedUrl, url } = uploadUrlData.data;
    console.log("[AWS] Received presigned URL. Starting PUT to S3...");

    // 2. Upload the file directly to S3 using the presigned URL
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": (file as File).type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      console.error("[AWS] S3 PUT request failed:", uploadResponse.statusText);
      throw new Error("S3 upload failed");
    }

    console.log("[AWS] Upload successful. Public URL:", url);
    return { location: url };

  } catch (error: any) {
    console.error("[AWS] Upload process error:", error);
    notifyErrorFxn(
      "There was an error uploading your file. Please try again in a moment."
    );
    return { location: null };
  }
};
