import React from 'react';
import { Icon, IconSmall, IconMedium, IconLarge, IconXLarge, IconPrimary, IconSecondary, IconWhite } from './icon';

// Icon registry with all available icons
export const ICONS = {
  // Navigation icons
  'overview': 'overview',
  'logo-generator': 'logo-generator',
  'business-name-generator': 'business-name-generator',
  'pitch-deck': 'pitch-deck',
  'document-generator': 'document-generator',
  'video-generator': 'video-generator',
  'website-generator': 'website-generator',
  'subscription': 'subscription',
  'favourite': 'favourite',
  'referral': 'referral',
  'settings': 'settings',
  'faq': 'faq',
  'chat': 'chat',
  'search': 'search',
} as const;

export type IconName = keyof typeof ICONS;

// Dynamic icon component with all variants
export const DynamicIcon = ({ 
  name, 
  size = 'medium',
  variant = 'default',
  className = ''
}: {
  name: IconName;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | number;
  variant?: 'default' | 'primary' | 'secondary' | 'white';
  className?: string;
}) => {
  const iconName = ICONS[name];
  
  if (typeof size === 'number') {
    return <Icon name={iconName} size={size} className={className} />;
  }

  switch (variant) {
    case 'primary':
      return <IconPrimary name={iconName} size={getSizeValue(size)} className={className} />;
    case 'secondary':
      return <IconSecondary name={iconName} size={getSizeValue(size)} className={className} />;
    case 'white':
      return <IconWhite name={iconName} size={getSizeValue(size)} className={className} />;
    default:
      switch (size) {
        case 'small':
          return <IconSmall name={iconName} className={className} />;
        case 'large':
          return <IconLarge name={iconName} className={className} />;
        case 'xlarge':
          return <IconXLarge name={iconName} className={className} />;
        default:
          return <IconMedium name={iconName} className={className} />;
      }
  }
};

function getSizeValue(size: 'small' | 'medium' | 'large' | 'xlarge'): number {
  switch (size) {
    case 'small': return 16;
    case 'large': return 32;
    case 'xlarge': return 48;
    default: return 24;
  }
}

// Convenience exports for common use cases
export const SidebarIcon = ({ name, className }: { name: IconName; className?: string }) => (
  <DynamicIcon name={name} size="medium" variant="primary" className={className} />
);

export const HeaderIcon = ({ name, className }: { name: IconName; className?: string }) => (
  <DynamicIcon name={name} size="medium" variant="white" className={className} />
);

export const ButtonIcon = ({ name, size = 'medium', className }: { name: IconName; size?: 'small' | 'medium' | 'large'; className?: string }) => (
  <DynamicIcon name={name} size={size} variant="default" className={className} />
); 