const env = process.env.NEXT_PUBLIC_NODE_ENV || "production";
const isLocalEnv = env === "local" || env === "development";
const isLocalHost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");
const isLocal = isLocalEnv || isLocalHost;

export function getAuthUrl() {
  if (isLocal) {
    return "http://localhost:3003/auth/login";
  } else {
    return "https://app.zwilt.com/auth/signin?v=account&r=tracker";
  }
}

export function getRedirectUrl() {
  if (isLocal) {
    return "http://localhost:3000/dashboard";
  } else {
    return "https://tracker.zwilt.com/dashboard";
  }
}

// Export the computed URLs
export const authUrl = getAuthUrl();
export const redirectUrl = getRedirectUrl();
