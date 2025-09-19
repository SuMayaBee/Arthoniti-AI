import React from 'react';
import Image from 'next/image';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  className = ''
}) => {
  return (
    <div 
      className={className}
      style={{ 
        width: size, 
        height: size
      }}
    >
      <Image 
        src={`/icons/${name}.svg`}
        alt={name}
        width={size}
        height={size}
        className="w-full h-full"
      />
    </div>
  );
};

// Predefined icon components for common use cases
export const IconSmall = ({ name, className }: { name: string; className?: string }) => (
  <Icon name={name} size={16} className={className} />
);

export const IconMedium = ({ name, className }: { name: string; className?: string }) => (
  <Icon name={name} size={24} className={className} />
);

export const IconLarge = ({ name, className }: { name: string; className?: string }) => (
  <Icon name={name} size={32} className={className} />
);

export const IconXLarge = ({ name, className }: { name: string; className?: string }) => (
  <Icon name={name} size={48} className={className} />
);

// Color variants using Tailwind classes
export const IconPrimary = ({ name, size = 24, className }: { name: string; size?: number; className?: string }) => (
  <Icon name={name} size={size} className={`text-primary-500 ${className}`} />
);

export const IconSecondary = ({ name, size = 24, className }: { name: string; size?: number; className?: string }) => (
  <Icon name={name} size={size} className={`text-gray-500 ${className}`} />
);

export const IconWhite = ({ name, size = 24, className }: { name: string; size?: number; className?: string }) => (
  <Icon name={name} size={size} className={`text-white ${className}`} />
);

export const IconRed = ({ name, size = 24, className }: { name: string; size?: number; className?: string }) => (
  <Icon name={name} size={size} className={`text-red-500 ${className}`} />
);

export const IconGreen = ({ name, size = 24, className }: { name: string; size?: number; className?: string }) => (
  <Icon name={name} size={size} className={`text-green-500 ${className}`} />
);

export const IconBlue = ({ name, size = 24, className }: { name: string; size?: number; className?: string }) => (
  <Icon name={name} size={size} className={`text-blue-500 ${className}`} />
); 