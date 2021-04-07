[![Verify](https://github.com/porscheinformatik/material-addons/actions/workflows/verify.yml/badge.svg)](https://github.com/porscheinformatik/material-addons/actions/workflows/verify.yml) [![Deploy Release](https://github.com/porscheinformatik/material-addons/actions/workflows/release.yml/badge.svg)](https://github.com/porscheinformatik/material-addons/actions/workflows/release.yml)

# MAD: Material Addons - Angular Material extension library

The goal of "material addons" is to achieve a stylesheet similar
to [Clarity Addons](https://www.npmjs.com/package/@porscheinformatik/clr-addons)
for [Angular Material](https://material.angular.io/).

The package can be found on [npmjs](https://www.npmjs.com/package/@porscheinformatik/material-addons).

## [Demo website](https://porscheinformatik.github.io/material-addons)

The demo uses the material-addons stylesheet and shows some basic layouting and css usage. Source of the demo website is
found in the [src directory](https://github.com/porscheinformatik/material-addons/tree/master/src/).

# Changelog

_Hint: Changes marked as **visible change** directly affect your application on version uprade,_

- **v10.1.2**:
  - Cleanup 
- **v10.0.27**:
  - **Visible change:** Ellipsis support for readonly-form-fields (enabled per
    default) [demo](https://porscheinformatik.github.io/material-addons/card)
  - **Visible change:** Fix toolbar badges on mobile devices
  - Added shrinkIfEmpty feature to read-only
    textareas [demo](https://porscheinformatik.github.io/material-addons/readonly)
  - Added save-button throttling as default to card component
  - Minor bugfixes in Demo


<details><summary>older changelogs</summary>

- **v10.0.26**: Added throttle button
  directive [demo](https://porscheinformatik.github.io/material-addons/throttle-click)
- **v10.0.25**: Added badge support for toolbar actions,
  see [toolbar demo](https://porscheinformatik.github.io/material-addons)
- **v10.0.24**: Added text field support for read-only-form-field-wrapper with "multiline" and "rows" arguments
- **v10.0.22**: Fixed [#52](https://github.com/porscheinformatik/material-addons/issues/52) and updated
  documentation [#48](https://github.com/porscheinformatik/material-addons/pull/48)
- **v10.0.21**: Added [mad button components](https://porscheinformatik.github.io/material-addons/mad-buttons) (
  mad-primary-button, mad-outline-button, etc.) to ensure a unified design
- **v10.0.19**: Fixed [#46](https://github.com/porscheinformatik/material-addons/issues/46) where read-only numbers were
  formatted by default
- **v10.0.18**: Fix [card](https://porscheinformatik.github.io/material-addons/card) header size by using default
  Angular Material styling
- **v10.0.17**: Minor fixes in 4
  components ([numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field)
  , [action-table](https://porscheinformatik.github.io/material-addons/action-table)
  , [quicklist](https://porscheinformatik.github.io/material-addons/quick-list)
  , [readonly-formfield](https://porscheinformatik.github.io/material-addons/readonly))
- **v10.0.16**: Fix number format detection
  in [numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field)
- **v10.0.15**: Small fix in [action-table](https://porscheinformatik.github.io/material-addons/action-table)
- **v10.0.14**: Add [action-table](https://porscheinformatik.github.io/material-addons/action-table) bugfix
  in [numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field)
- **v10.0.13**: Event emitter fix in [card](https://porscheinformatik.github.io/material-addons/card) component
- **v10.0.12**: Style fix in [card](https://porscheinformatik.github.io/material-addons/card) component
- **v10.0.11**: Added [quicklist](https://porscheinformatik.github.io/material-addons/quick-list)
  and [card](https://porscheinformatik.github.io/material-addons/card) component
- **v10.0.10**: Added [numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field) editable fields
- **v10.0.9**: (not released)
- **v10.0.8**: Added [numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field) directive`

</details>

# Usage

## Requirements

Material addons requires an already set-up Angular Material project. To do a fresh start please
follow [the official Angular Material guide](https://material.angular.io/guide/getting-started) before you continue, but
exclude step 4 ("include a theme").

## Initial steps in your project

1. Install Material Addons package using npm:

   ```
   npm install @porscheinformatik/material-addons --save
   ```

2. Add the stylesheet at the top of your projects from the folder **themes**, for example:

   ```
   @import '~@porscheinformatik/material-addons/themes/poa';
   ```

3. To use a component, you need to import the Module of the component in your app.module.ts or in any other module,
   which needs the component.

# Development instructions

## [Contribution guidelines](https://github.com/porscheinformatik/material-addons/tree/master/.github/CONTRIBUTING.md)

Please follow the Contribution guidelines.

## Getting the project to run as developer + start demo

`npm install && npm run build:mat-add && npm install --no-optional && npm install && ng serve`


## Pre commit hooks

Eslint and prettier are used as precommit hooks to enable a consistency of code format and quality in this repository.
I'd also recommend to add the prettier extension in your editor, so that you get early feedback on your code. I use VS
Code with the [Prettier Extension](https://github.com/prettier/prettier-vscode) and
the [auto format on save](https://github.com/prettier/prettier-vscode#format-on-save).


## Set correct registry for publishing material-addons

Use `npm config set registry https://registry.npmjs.org/` to set registry on the official npm registry.


# Deployment process

## Publish NPM and deploy demo

1. Update version information manually (will be automated later)
   1. Increase the version in "/projects/material-addons/package.json" to the next target version number
   2. Update the Readme by providing information about the changes
2. Create a new [Github Release](https://github.com/porscheinformatik/material-addons/releases), the deploy pipeline will trigger automatically
3. Check if the [deploy pipeline](https://github.com/porscheinformatik/material-addons/actions/workflows/release.yml) succeeded

