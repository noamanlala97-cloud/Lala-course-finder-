import React from "react";

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = "", size = 38 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Dark rounded squircle background */}
      <rect width="100" height="100" rx="24" fill="#08101F" />
      
      {/* Central vertical connecting rod */}
      <rect x="46" y="38" width="8" height="36" rx="4" fill="#FFFFFF" />
      
      {/* Top horizontal blue pill */}
      <rect x="25" y="28" width="50" height="15" rx="7.5" fill="#2563EB" />
      
      {/* Top-right bright green circle notification dot */}
      <circle cx="73" cy="27" r="7" fill="#10B981" />
      
      {/* Bottom horizontal amber/orange pill */}
      <rect x="33" y="55" width="34" height="14" rx="7" fill="#F59E0B" />
    </svg>
  );
};
