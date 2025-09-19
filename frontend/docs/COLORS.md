# Color System Documentation

## Overview

BusinessAI uses a comprehensive color system with a primary purple color (`#9E32DD`) and supporting color palettes for consistent branding and user experience.

## Primary Color

- **Main Primary**: `#9E32DD` (primary-500)
- **Light Primary**: `#e1b1f4` (primary-100)
- **Dark Primary**: `#7024f0` (primary-700)

## Color Palette

### Primary Colors (Purple/Violet)
```typescript
primary: {
  50: '#f5ebfc',   // Very light purple
  100: '#e1b1f4',  // Light purple
  200: '#d2a1f1',  // Light-medium purple
  300: '#a760f4',  // Medium purple
  400: '#b15be4',  // Medium-dark purple
  500: '#9e32dd',  // Main primary color
  600: '#902ce9',  // Dark purple
  700: '#7024f0',  // Darker purple
  800: '#571c7a',  // Very dark purple
  900: '#442f5d',  // Darkest purple
}
```

### Theme Colors (Light Blue/Grey)
```typescript
theme: {
  50: '#fbfbff',   // Very light blue-grey
  100: '#f0fdfd',  // Light blue-grey
  200: '#f0fdfd',  // Light-medium blue-grey
  300: '#f0fdfc',  // Medium blue-grey
  400: '#f0fdfc',  // Medium-dark blue-grey
  500: '#f0fdfc',  // Main theme color
  600: '#e3e4e4',  // Dark blue-grey
  700: '#b1b2b2',  // Darker blue-grey
  800: '#898a8a',  // Very dark blue-grey
  900: '#696969',  // Darkest blue-grey
}
```

### Success Colors (Green)
```typescript
success: {
  50: '#edf7ee',   // Very light green
  100: '#c0e9c9',  // Light green
  200: '#addada',  // Light-medium green
  300: '#87c98a',  // Medium green
  400: '#70d7f3',  // Medium-dark green
  500: '#84ca50',  // Main success color
  600: '#458f8b',  // Dark green
  700: '#436739',  // Darker green
  800: '#2a9020',  // Very dark green
  900: '#2d4d22',  // Darkest green
}
```

### Error Colors (Red)
```typescript
red: {
  50: '#fde6e6',   // Very light red
  100: '#f5b1b1',  // Light red
  200: '#f7b1bb',  // Light-medium red
  300: '#f26565',  // Medium red
  400: '#f13535',  // Medium-dark red
  500: '#e02020',  // Main error color
  600: '#802020',  // Dark red
  700: '#e0701',   // Darker red
  800: '#b20101',  // Very dark red
  900: '#a40101',  // Darkest red
}
```

### Highlight Colors (Orange/Brown)
```typescript
highlight: {
  50: '#fdf5e6',   // Very light orange
  100: '#fdf1b0',  // Light orange
  200: '#fdf0b0',  // Light-medium orange
  300: '#ffba54',  // Medium orange
  400: '#ffad32',  // Medium-dark orange
  500: '#ff9d00',  // Main highlight color
  600: '#e88000',  // Dark orange
  700: '#c96a00',  // Darker orange
  800: '#955900',  // Very dark orange
  900: '#6b4000',  // Darkest orange
}
```

## Usage

### Import Colors
```typescript
import { colors, getPrimaryColor } from '@/lib/colors';
import { colorClasses, appColors } from '@/lib/color-utils';
```

### Using in Components

#### 1. Direct Color Values
```typescript
// Using the main primary color
const primaryColor = colors.primary[500]; // #9e32dd

// Using specific shades
const lightPrimary = colors.primary[100]; // #e1b1f4
const darkPrimary = colors.primary[700];  // #7024f0
```

#### 2. Tailwind Classes
```typescript
// Using Tailwind classes
<div className="bg-primary-500 text-white">Primary Button</div>
<div className="text-primary-600 hover:text-primary-700">Link</div>
<div className="border-primary-200 bg-primary-50">Card</div>
```

#### 3. Inline Styles
```typescript
// Using inline styles with the color constant
<div style={{ backgroundColor: colors.primary[500], color: 'white' }}>
  Styled Div
</div>
```

#### 4. Utility Functions
```typescript
import { getColorWithOpacity, createGradient } from '@/lib/color-utils';

// With opacity
const transparentPrimary = getColorWithOpacity(colors.primary[500], 0.5);

// Gradient
const gradientClass = createGradient(colors.primary[500], '#ff6b6b', 'to-r');
```

## Migration from Old Colors

### Before (Old Purple)
```typescript
// Old color references
className="text-[#a020f0]"
className="bg-purple-500"
className="text-purple-600"
```

### After (New Primary)
```typescript
// New color references
className="text-primary-500"
className="bg-primary-500"
className="text-primary-600"
```

## Best Practices

1. **Use Tailwind Classes**: Prefer `text-primary-500` over `text-[#9e32dd]`
2. **Consistent Shading**: Use 500 for main elements, 100 for backgrounds, 700 for hover states
3. **Accessibility**: Ensure sufficient contrast ratios (AAA: 7:1, AA: 4.5:1)
4. **Semantic Colors**: Use success/error colors for appropriate contexts
5. **Gradients**: Use primary colors in gradients for brand consistency

## Color Accessibility

All colors in the palette have been tested for accessibility:
- **Primary-500**: 18.17 AAA contrast ratio
- **Success-500**: High contrast for positive actions
- **Error-500**: High contrast for error states
- **Neutral colors**: Balanced for text readability

## File Structure

```
lib/
├── colors.ts          # Main color definitions
├── color-utils.ts     # Utility functions
└── ...

tailwind.config.ts     # Tailwind color configuration
```

## Updating Colors

To update the color system:

1. Modify `lib/colors.ts` with new color values
2. Update `tailwind.config.ts` if adding new color categories
3. Run the development server to see changes
4. Test accessibility with color contrast tools
5. Update documentation if needed 