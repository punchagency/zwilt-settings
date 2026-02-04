import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ProfileAvatarProps {
  name: string;
  imageUrl?: string;
  size?: string; // e.g. "50px" or "2.6vw"
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  name,
  imageUrl,
  size = "50px", // use an absolute value for testing
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    // Reset states when imageUrl changes
    setImageLoaded(false);
    setHasImageError(false);
  }, [imageUrl]);

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length === 0) return "";
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  // Decide if initials should be displayed:
  //  1. No imageUrl
  //  2. Image not yet loaded
  //  3. An error occurred while loading the image
  const showInitials = !imageUrl || !imageLoaded || hasImageError;

  return (
    <div
      // We need position: relative for fill to work.
      className="relative overflow-hidden rounded-full bg-gray-300 flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* INITIALS on top (z-index: 10) if we haven't successfully loaded the image. */}
      {showInitials && (
        <span
          className="z-10 text-black font-medium"
          style={{
            fontSize: `calc(${size} / 2.5)`, // tweak as needed
          }}
        >
          {getInitials(name)}
        </span>
      )}

      {/* Only render the Image if there's a URL and we haven't permanently errored out */}
      {imageUrl && !hasImageError && (
        <Image
          src={imageUrl}
          alt={`${name}'s profile avatar`}
          fill
          // Make sure the parent has a fixed dimension so fill can work
          style={{ objectFit: "cover" }}
          onLoadingComplete={() => setImageLoaded(true)}
          onError={() => setHasImageError(true)}
          // (optional) force Next.js to skip optimization if you suspect it’s causing trouble:
          // unoptimized
        />
      )}
    </div>
  );
};

export default ProfileAvatar;