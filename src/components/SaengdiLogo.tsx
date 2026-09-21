import React, { useState } from 'react';

interface SaengdiLogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'symbol' | 'horizontal';
}

export const SaengdiLogo: React.FC<SaengdiLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  // Height presets
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
  }[size];

  // Try the official generated raster image first, with graceful fallback to crystal-clear SVG
  const [imgSrc, setImgSrc] = useState<string>('/saengdi_logo_official.png');

  const handleError = () => {
    // If the PNG fails to load for any reason, fallback to the vector SVG
    if (imgSrc !== '/saengdi_logo.svg') {
      setImgSrc('/saengdi_logo.svg');
    }
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={imgSrc}
        onError={handleError}
        alt="생디 - 학생부를 디자인하다 | AI 기반 학생부 디자인 플랫폼"
        className={`${heightClasses} w-auto object-contain max-w-full`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
