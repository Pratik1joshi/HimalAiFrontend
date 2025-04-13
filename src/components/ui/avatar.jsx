import React, { useState, useMemo } from "react";
import { cn } from "../../lib/utils";

// Avatar API URLs
const AVATAR_APIS = {
  boy: "https://avatar.iran.liara.run/public/boy",
  girl: "https://avatar.iran.liara.run/public/girl",
};

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ 
  className, 
  src, 
  alt = "", 
  gender = "boy",
  userId = null, // Add userId prop to generate consistent avatars
  email = null,  // Add email as alternative identifier
  ...props 
}, ref) => {
  const [imgError, setImgError] = useState(false);
  
  // Generate deterministic ID based on user identifier
  const avatarId = useMemo(() => {
    if (!userId && !email) {
      // If no user identifier provided, use random ID
      return Math.floor(Math.random() * 100);
    }
    
    // Create a deterministic hash from userId or email
    const identifier = userId || email;
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = ((hash << 5) - hash) + identifier.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Map the hash to range 0-99
    return Math.abs(hash % 100);
  }, [userId, email]);
  
  // Use the provided src if available, otherwise fall back to the avatar API
  const imgSrc = !imgError && src 
    ? src 
    : `${AVATAR_APIS[gender] || AVATAR_APIS.boy}?id=${avatarId}`;
  
  return (
    <img
      ref={ref}
      src={imgSrc}
      alt={alt}
      onError={() => setImgError(true)}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
