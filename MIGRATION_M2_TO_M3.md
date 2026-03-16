# Migration Guide: Material Addons M2 to M3

## Overview

Material Addons v22.0.0 migrates from Angular Material's M2 (Material Design 2) theming APIs to M3 (Material Design 3) theming APIs. This is a major version update that requires Angular 21+ and Angular Material 21+.

## What's Changed

### Visual Appearance

The M3 design language brings subtle visual updates:
- Updated color system based on Material Design 3 tokens
- Improved color contrast and accessibility
- Modernized component styling
- All existing color CSS variables preserved for backward compatibility

### Technical Changes

1. **Theme API**: Migrated from `mat.m2-define-light-theme()` to `mat.define-theme()`
2. **No ::ng-deep**: Removed all deprecated `::ng-deep` selectors
3. **CSS Variables**: Added new M3 system tokens while preserving all existing variables
4. **Hardcoded Colors**: Replaced with theme-aware CSS variables

## Breaking Changes

### Visual Only

The only breaking changes are **visual** - the component APIs remain unchanged. Your application code does not need any modifications.

- Component behavior: **No changes**
- Component inputs/outputs: **No changes**
- Component selectors: **No changes**
- CSS variables: **All existing variables preserved**

### Requirements

- **Angular**: 21.0.0 or higher
- **Angular Material**: 21.0.0 or higher
- **TypeScript**: 5.7+ (as required by Angular 21)

## Migration Steps

### 1. Update Dependencies

```bash
npm install @porscheinformatik/material-addons@22.0.0
```

### 2. Add Font Stylesheets to angular.json

Add these font CSS files to your `angular.json` build configuration (in the `styles` array, **before** your `styles.scss`):

```json
"styles": [
  "node_modules/roboto-fontface/css/roboto/roboto-fontface.css",
  "node_modules/material-icons/iconfont/material-icons.css",
  "src/styles.scss"
],
```

**Why this is required**: Material Addons uses local font packages (`roboto-fontface` and `material-icons`) which must be loaded in your application. These packages are included as dependencies. They must be added to `angular.json` rather than imported in SCSS due to the SCSS module system (`@use`) requiring all `@use` statements to come before `@import` statements.

### 3. Update Angular and Material (if not already on v21+)

```bash
ng update @angular/core@21 @angular/cli@21
ng update @angular/material@21
```

### 4. Rebuild Your Application

```bash
npm run build
```

### 5. Test Your Application

Visually test your application with the new M3 styling. Focus on:
- Color usage in components
- Theme consistency
- Custom CSS overrides (if any)

## CSS Variables Reference

### Existing Variables (Preserved)

All 23 existing CSS variables continue to work:

```scss
--main-primary
--selection-background
--hover-color
--table-hover-color
--warn-color
--error-color
--background-color
--panel-color
--panel-background-color
--panel-border-color
--panel-select-background
--mat-button-protected-label-text-color
--alert-success-background-color
--alert-success-border-color
--alert-success-text-color
--alert-info-background-color
--alert-info-border-color
--alert-info-text-color
--alert-warning-background-color
--alert-warning-border-color
--alert-warning-text-color
--alert-error-background-color
--alert-error-border-color
--alert-error-text-color
```

### New M3 System Tokens

New CSS variables for M3 design system:

```scss
// M3 System Colors
--mat-sys-primary
--mat-sys-surface
--mat-sys-surface-variant
--mat-sys-on-surface
--mat-sys-on-surface-variant
--mat-sys-outline
--mat-sys-outline-variant

// Component-Specific Tokens
--step-border-color
--step-complete-color
--step-neutral-color
--toolbar-background
--datatable-background
--datatable-hover
```

## Theme Usage

### Importing Themes

Theme import remains the same:

```scss
// In your global styles
@use '@porscheinformatik/material-addons/themes/poa.scss';
// or
@use '@porscheinformatik/material-addons/themes/pbv.scss';
// or
@use '@porscheinformatik/material-addons/themes/carcat.scss';
```

### Custom Theme Overrides

If you have custom CSS that overrides Material Addons styles:

**Before (might break):**
```scss
.custom-component {
  background-color: white;  // Hardcoded
  color: black;             // Hardcoded
}
```

**After (theme-aware):**
```scss
.custom-component {
  background-color: var(--mat-sys-surface);
  color: var(--mat-sys-on-surface);
}
```

## Troubleshooting

### Colors Look Different

**Cause**: M3 uses a different color algorithm and token system.

**Solution**: This is expected. M3 provides improved contrast and accessibility. If specific colors are critical to your brand, consider:
1. Verifying the primary color in your theme matches your brand color
2. Using CSS variable overrides for specific components
3. Reviewing the [M3 color system documentation](https://m3.material.io/styles/color/system/overview)

### Custom Styles Broken

**Cause**: Your custom CSS might have used hardcoded colors or relied on removed ::ng-deep selectors.

**Solution**: Update custom styles to use CSS variables:
```scss
// Instead of hardcoded colors
color: var(--mat-sys-on-surface);
background-color: var(--mat-sys-surface);
border-color: var(--mat-sys-outline);
```

### Build Errors

**Cause**: SCSS compilation errors due to incompatible Angular Material version.

**Solution**: Ensure you're using Angular Material 21+:
```bash
npm list @angular/material
# Should show version ^21.0.0
```

### Visual Regressions

**Cause**: M3 design language changes.

**Solution**:
1. Review the affected components
2. Determine if the changes are acceptable M3 design updates
3. If needed, use CSS variable overrides for specific adjustments
4. Avoid using ::ng-deep (it's deprecated and may be removed in future Angular versions)

## Before/After Examples

### Buttons

**M2 (v21.x)**:
- Flatter appearance
- Less rounded corners
- M2 color system

**M3 (v22.x)**:
- More prominent elevation
- More rounded corners
- Improved contrast

### Data Tables

**M2 (v21.x)**:
- Strict borders
- White background
- Fixed hover state

**M3 (v22.x)**:
- Softer borders using outline tokens
- Theme-aware background
- Improved hover contrast

### Stepper

**M2 (v21.x)**:
- Hardcoded lightgrey borders
- Hardcoded green complete state

**M3 (v22.x)**:
- Theme-aware borders (--step-border-color)
- Success color complete state (--step-complete-color)

## Getting Help

If you encounter issues during migration:

1. Check this migration guide thoroughly
2. Review your custom CSS for hardcoded colors or ::ng-deep usage
3. Ensure all dependencies are updated to compatible versions
4. Report issues at: https://github.com/porscheinformatik/material-addons/issues

## What's Next

### v22.1+ Roadmap

- **Dark mode support**: M3 theme-type: dark
- **Dynamic theme switching**: Runtime theme changes
- **Additional color schemes**: High-contrast, custom palettes
- **Component density**: M3 density scale support

---

*Generated for Material Addons v22.0.0*
