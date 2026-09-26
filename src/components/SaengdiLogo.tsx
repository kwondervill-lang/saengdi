import React, { useState } from 'react';

interface SaengdiLogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'symbol' | 'horizontal';
  customLogoUrl?: string | null;
}

export const SaengdiLogo: React.FC<SaengdiLogoProps> = ({
  className = '',
  size = 'md',
  customLogoUrl = null,
}) => {
  // Height presets
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
  }[size];

  // If customLogoUrl is provided, use it directly
  // Default to pure vector SVG without English 'Saengdi'
  const [imgSrc, setImgSrc] = useState<string>(customLogoUrl || '/saengdi_logo.svg');

  // React to customLogoUrl change
  React.useEffect(() => {
    if (customLogoUrl) {
      setImgSrc(customLogoUrl);
    } else {
      setImgSrc('/saengdi_logo.svg');
    }
  }, [customLogoUrl]);

  const handleError = () => {
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
        crossOrigin="anonymous"
      />
    </div>
  );
};
