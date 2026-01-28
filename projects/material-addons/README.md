## About

The goal of "material addons" is to achieve a stylesheet similar to [Clarity Addons](https://www.npmjs.com/package/@porscheinformatik/clr-addons) for [Angular Material](https://material.angular.io/).

### Material Design 3 (M3)

**Version 22.0.0+** fully supports Material Design 3 (M3):
- Modern M3 design tokens and color system
- Improved accessibility and contrast
- All existing CSS variables preserved
- No breaking API changes
- See [MIGRATION_M2_TO_M3.md](https://github.com/porscheinformatik/material-addons/blob/master/MIGRATION_M2_TO_M3.md) for upgrade details

### Requirements

Material addons requires an already set-up Angular Material project. To do a fresh start please follow [the official Angular Material guide](https://material.angular.io/guide/getting-started) before you continue, but exclude step 4 ("include a theme").

**Version compatibility:**
- Angular 22.x → Material Addons 22.x (M3)
- Angular 21.x → Material Addons 21.x (M2)
- See [full version matrix](https://github.com/porscheinformatik/material-addons#versioning)

### Installation

1.  Install Material Addons package using npm.

    ```
    npm install @porscheinformatik/material-addons
    ```

2.  Add font stylesheets and theme to your `angular.json` build configuration:

    ```json
    "styles": [
      "node_modules/roboto-fontface/css/roboto/roboto-fontface.css",
      "node_modules/material-icons/iconfont/material-icons.css",
      "node_modules/@porscheinformatik/material-addons/themes/poa.scss"
    ]
    ```

    **Available themes (all with M3 support from v22.0.0+):**
    - `poa.scss` - Porsche Informatik Austria (cyan primary)
    - `pbv.scss` - Porsche BVW (dark blue primary)
    - `carcat.scss` - CARCAT (light blue primary, custom alert density)

    **Note**: Font CSS files must be loaded via `angular.json` (not SCSS `@import`) due to SCSS module system requirements. The `roboto-fontface` and `material-icons` packages are included as dependencies.

3.  To use a component, you need to import the Module of the component in your app.module.ts:

### CSS Variables

Material Addons exposes CSS variables for customization:

```scss
// Existing variables (v21.x and earlier)
--main-primary, --selection-background, --hover-color
--panel-color, --panel-background-color, --panel-border-color
--alert-*-background-color, --alert-*-border-color, --alert-*-text-color

// New M3 system tokens (v22.0.0+)
--mat-sys-primary, --mat-sys-surface, --mat-sys-on-surface
--mat-sys-outline, --mat-sys-outline-variant
--step-border-color, --toolbar-background, --datatable-background
```

See [MIGRATION_M2_TO_M3.md](https://github.com/porscheinformatik/material-addons/blob/master/MIGRATION_M2_TO_M3.md) for full CSS variable reference.

### Demo

The demo website is linked on the [github repository page](https://github.com/porscheinformatik/material-addons).
