export function getAuthUrl() {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "local") {
    return "http://localhost:3000/auth/login";
  }
   else {
    return "https://app.zwilt.com/auth/signin?v=account&r=tracker";
  }
}

export function getRedirectUrl() {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "local") {
    return "http://localhost:3000/dashboard";
  } else {
    return "https://tracker.zwilt.com/dashboard";
  }
}

// Export the computed URLs
export const authUrl = getAuthUrl();
export const redirectUrl = getRedirectUrl();
