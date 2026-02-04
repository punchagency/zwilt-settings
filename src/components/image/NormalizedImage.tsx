import React from "react";
import Image, { ImageProps } from "next/image";
import { useImageUrl } from "@/hooks/useImageUrl";

/**
 * A wrapper around Next.js Image component that normalizes image URLs
 * to prevent issues with double slashes in S3 URLs
 */
export const NormalizedImage: React.FC<ImageProps> = (props) => {
  const { normalizeImageUrl } = useImageUrl();

  // Create a new props object with the normalized src
  const normalizedProps = {
    ...props,
    src:
      typeof props.src === "string" ? normalizeImageUrl(props.src) : props.src,
  };

  return <Image {...normalizedProps} />;
};
