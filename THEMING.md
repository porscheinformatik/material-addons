# Material Addons Theming System

This documentation describes the Material 3 (M3) theming system used in the Material Addons library.

## Architecture Overview

```
themes/
├── common/
│   ├── theme.scss      # M3 Theme Builder Function
│   ├── styles.scss     # CSS Variables & Component Styles
│   └── button.scss     # Button-specific Styles
├── pbv.scss            # PBV Theme
├── pbv-palettes.scss   # PBV M3 Palettes (generated)
├── poa.scss            # POA Theme
├── poa-palettes.scss   # POA M3 Palettes (generated)
├── carcat.scss         # CARCAT Theme
└── carcat-palettes.scss# CARCAT M3 Palettes (generated)
```

## Material 3 Concepts

### Tonal Palettes

M3 uses **Tonal Palettes** with 13 tone levels (0-100) instead of M2 palettes (50-900):

```scss
$primary-palette: (
  0: #000000,     // Black
  10: #001e2e,    // Very dark
  20: #00344c,
  30: #0c4c6b,
  40: #2d6484,    // Typical "default" tone
  50: #497c9e,
  60: #6396b9,
  70: #7eb1d5,
  80: #99cdf2,
  90: #c8e6ff,    // Container color
  95: #e5f2ff,
  99: #fbfcff,
  100: #ffffff,   // White
);
```

### System Variables

M3 defines semantic CSS custom properties (`--mat-sys-*`):

| Variable | Usage |
|----------|-------|
| `--mat-sys-primary` | Main color for buttons, links |
| `--mat-sys-on-primary` | Text on primary background |
| `--mat-sys-surface` | Background for cards, tables |
| `--mat-sys-on-surface` | Text on surface |
| `--mat-sys-outline` | Border colors |
| `--mat-sys-outline-variant` | Subtle border colors |
| `--mat-sys-surface-variant` | Alternative surface (hover) |

## Creating a Theme

### 1. Generate Palette

Angular Material provides a schematic to generate M3 palettes:

```bash
npx ng generate @angular/material:m3-theme \
  --primary-color=#004665 \
  --tertiary-color=#00648f \
  --error-color=#c21d00 \
  --directory=projects/material-addons/src/themes
```

Rename the generated file (e.g., `pbv-palettes.scss`).

### 2. Create Theme File

```scss
// pbv.scss
@use 'sass:map';
@use './common/theme' as theme;
@use './common/styles' as common;
@use './common/theme-entry' as theme-entry;
@use './pbv-palettes' as pbv;

$theme-name: 'pbv';

// Brand Colors
$primary-color: #004665;
$tertiary-color: #00648f;
$background-color: #fafafa;

// Semantic Colors
$custom-colors: (
  warn-color: #ad7600,
  error-color: #c21d00,
  info-color: #00648f,
  success-color: #3c8500,
);

// Palette Map for M3
$palettes: (
  primary: pbv.$primary-palette,
  tertiary: pbv.$tertiary-palette,
);

// Build Theme
$custom-theme: theme.build-custom-theme-m3(
  $theme-name,
  $primary-color,
  $tertiary-color,
  $custom-colors,
  common.$default-palette,
  $background-color,
  $palettes
);

$root-overrides: (
  --selection-background: #79c6e6,
  --hover-color: #79c6e6,
  --panel-color: #000000,
);

@include theme-entry.apply-theme($custom-theme, (
  root-overrides: $root-overrides,
));
```

## Theme Builder Function

The `build-custom-theme-m3()` function in `theme.scss`:

```scss
@function build-custom-theme-m3(
  $theme-name,
  $primary-hex,
  $tertiary-hex,
  $custom-colors,
  $default-colors,
  $background-hex: #fafafa,
  $palettes: null // Optional: M3 Palettes
) {
  $mat-theme: mat.define-theme((
    color: (
      theme-type: light,
      primary: if($palettes, map.get($palettes, primary), mat.$azure-palette),
      tertiary: if($palettes, map.get($palettes, tertiary), mat.$blue-palette),
      use-system-variables: true
    ),
    typography: (
      brand-family: 'Roboto',
      plain-family: 'Roboto'
    ),
    density: (
      scale: 0
    )
  ));

  @return (
    mat-theme: $mat-theme,
    theme-name: $theme-name,
    primary-color: $primary-hex,
    tertiary-color: $tertiary-hex,
    background-color: $background-hex,
    custom-colors: $custom-colors,
    default-palette: $default-colors
  );
}
```

Use `theme-entry.apply-theme($custom-theme, $options)` to emit the `:root` and `html` blocks. The helper pulls out the Angular Material theme map, wires up `mat.*` mixins in the right order, and accepts optional `root-overrides`/`html-overrides` maps for brand-specific tweaks.

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `$theme-name` | string | Theme identifier (e.g., 'pbv') |
| `$primary-hex` | color | Primary color for legacy variables |
| `$tertiary-hex` | color | Info color |
| `$custom-colors` | map | Semantic colors (warn, error, info, success) |
| `$default-colors` | map | Fallback palette for alert colors |
| `$background-hex` | color | Background color (default: #fafafa) |
| `$palettes` | map\|null | M3 palettes (primary, tertiary) |

## CSS Custom Properties

### Two Levels of Variables

1. **M3 System Variables** (from Angular Material):
   ```css
   --mat-sys-primary: #2d6484;
   --mat-sys-on-primary: #ffffff;
   --mat-sys-surface: #f9f9fc;
   ```

2. **Custom Variables** (for backward compatibility):
   ```css
   --main-primary: #004665;
   --warn-color: #ad7600;
   --error-color: #c21d00;
   --alert-success-background-color: rgb(238, 252, 227);
   ```

### Component-Specific Tokens

Components reference M3 variables:

```scss
// In styles.scss
--step-border-color: var(--mat-sys-outline-variant);
--step-header-selected-background: var(--mat-sys-surface-variant);
--toolbar-background: var(--mat-sys-surface);
--datatable-background: var(--mat-sys-surface);
--datatable-hover: var(--mat-sys-surface-variant);
```

## Angular Material Mixins

### Important Mixins

| Mixin | Purpose |
|-------|---------|
| `mat.system-level-colors($theme)` | Generates `--mat-sys-*` CSS variables |
| `mat.all-component-themes($theme)` | Applies M3 styles to all components |
| `mat.typography-hierarchy($theme)` | Sets typography styles |

### Order Matters

```scss
html {
  // 1. First define CSS variables
  @include mat.system-level-colors($custom-theme);

  // 2. Then component themes (reference the variables)
  @include mat.all-component-themes($custom-theme);

  // 3. Typography
  @include mat.typography-hierarchy($custom-theme);

  // 4. Custom styles
  @include common.theme-styles($theme-name, $custom-theme);
}
```

## M3 Token Overrides

Some M3 defaults don't match the existing design. These are overridden in `theme-styles()`:

### Cards

```scss
.mat-mdc-card {
  // M3 uses surface-container (grayish), we want white
  --mat-card-elevated-container-color: var(--mat-sys-surface);
}
```

### Tables

```scss
.mat-mdc-table .mat-mdc-row:hover {
  background-color: var(--table-hover-color, var(--datatable-hover));
}
```

### Form Fields

```scss
.mat-mdc-form-field {
  --mdc-outlined-text-field-outline-color: var(--mat-sys-outline);
  --mdc-outlined-text-field-focus-outline-color: var(--main-primary);
}
```

## Using a Theme in Your Project

In your application's `styles.scss`:

```scss
@use '@porscheinformatik/material-addons/themes/pbv';

// Your own global styles...
a {
  color: var(--main-primary);
}
```

## Available Themes

| Theme | Primary Color | Usage |
|-------|---------------|-------|
| PBV | #004665 | Porsche Bank Versicherung |
| POA | #14a1a9 | Porsche Austria |
| CARCAT | #0072a3 | CARCAT System |

## Troubleshooting

### Checkboxes are Black/White

**Cause**: `mat.system-level-colors()` is missing.

**Solution**: Add the mixin:
```scss
html {
  @include mat.system-level-colors($custom-theme);
  @include mat.all-component-themes($custom-theme);
}
```

### Colors Don't Match

**Cause**: M3 tonal mapping generates colors algorithmically.

**Solution**: Check the generated palette files and manually adjust tone values if needed.

### Custom Variables Not Set

**Cause**: `:root` block is missing or `theme()` mixin not called.

**Solution**:
```scss
:root {
  @include common.theme($theme-name, $custom-theme);
}
```

## Migration from M2 to M3

Key differences:

| M2 | M3 |
|----|-----|
| Palettes with 50-900 levels | Tonal palettes with 0-100 |
| `mat.define-light-theme()` | `mat.define-theme()` with `theme-type: light` |
| `@include mat.core()` | No longer needed |
| Manual color tokens | `use-system-variables: true` |
