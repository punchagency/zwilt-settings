/**
 * Normalizes an image URL by removing any double slashes except for the protocol part (https://)
 * @param url - The URL to normalize
 * @returns The normalized URL with no double slashes (except in protocol)
 */
export const normalizeImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";

  // Split the URL at the protocol part
  const [protocol, rest] = url.includes("://")
    ? url.split(/:\/\/(.+)/)
    : ["", url];

  // Replace any double slashes in the rest of the URL with a single slash
  const normalizedRest = rest.replace(/\/+/g, "/");

  // Reconstruct the URL with the protocol part if it existed
  return protocol ? `${protocol}://${normalizedRest}` : normalizedRest;
};
