[![Verify](https://github.com/porscheinformatik/material-addons/actions/workflows/verify.yml/badge.svg)](https://github.com/porscheinformatik/material-addons/actions/workflows/verify.yml) [![Deploy Release](https://github.com/porscheinformatik/material-addons/actions/workflows/release.yml/badge.svg)](https://github.com/porscheinformatik/material-addons/actions/workflows/release.yml)

# MAD: Material Addons - Angular Material extension library

The goal of "material addons" is to achieve a stylesheet similar
to [Clarity Addons](https://www.npmjs.com/package/@porscheinformatik/clr-addons)
for [Angular Material](https://material.angular.io/).

The package can be found on [npmjs](https://www.npmjs.com/package/@porscheinformatik/material-addons).

## [Demo website](https://porscheinformatik.github.io/material-addons)

The demo uses the material-addons stylesheet and shows some basic layouting and css usage. Source of the demo website is
found in the [src directory](https://github.com/porscheinformatik/material-addons/tree/master/src/).

# Versioning

The versioning of material-addons is based on the Angular version. The Angular version of your application **must** match the Material Addons version.

| Angular Version | Material Addons Version |
|-----------------|-------------------------|
| Angular 19      | 19.x.x                  |
| Angular 18      | 18.x.x                  |
| Angular 17      | 17.x.x                  |
| Angular 16      | 16.x.x                  |
| Angular 15      | 15.x.x                  |
| Angular 14      | 14.x.x                  |
| Angular 10-13   | 10.x.x                  |

# Changelog

_Hint: Changes marked as **visible change** directly affect your application during version upgrade. **Breaking**
requires your attention during upgrade._

- **19.0.5**: fix: stepper error state color, css, add mat-error to stepper demo
- **19.0.4**: Major: fix cdkObserveContent deadlock in Chromium >= 135 version
- **19.0.3**: Fix Endless Loop in Readonly FormField [#223](https://github.com/porscheinformatik/material-addons/pull/223)
- **19.0.2**: bugfix for version: fix dist output
- **19.0.0**: Upgrade to Angular 19
- **18.0.8**: Major: fix cdkObserveContent deadlock in Chromium >= 135 version
- **18.0.7**: Fix Endless Loop in Readonly FormField [#223](https://github.com/porscheinformatik/material-addons/pull/223)
- **18.0.5**: FileUpload: Added additional param as 'removable' which allows user to remove file from fileList [#212](https://github.com/porscheinformatik/material-addons/pull/212)
- **18.0.3**: Fix MadNumericField: Fix floating point issue when not rounding any values (2.3*100 = 229.999 and displayed as 2.29)
- **18.0.2**: data table fix for onExpand call
- **18.0.1**: Prettier fixes, alert component fix
- **18.0.0**: Upgrade to Angular 18
- **17.4.6**: Fix MadNumericField: Fix floating point issue when not rounding any values (2.3*100 = 229.999 and displayed as 2.29)
- **17.4.4**: bugfix for data table display data
- **17.4.3**: Minor improvements for data table, readonly form fields and sidebar
- **17.4.2**: Moved text-overflow and ellipsis logic from readonly-form-field-wrapper
- **17.4.1**: add cards without title
- **17.3.4**: DataTable: bugix data table sorting
- **17.3.3**: bugfix for version
- **17.3.2**: bugfix for new page layout
- **17.3.0**: new page layout
- **17.2.2**: DataTable: bugix data table sorting
- **17.2.1**: DataTable: Bugfix sorting
- **17.2.0**: DataTable: new implementation with additional functionality
- **17.1.2**: Main Action: Add Tooltip
- **17.1.1**: Extend readonly form field [#167](https://github.com/porscheinformatik/material-addons/pull/167)
- **17.1.0**: Upgrade theming and provide carcat-style theme [#147](https://github.com/porscheinformatik/material-addons/pull/147)
- **17.0.3**: Fix [#154](https://github.com/porscheinformatik/material-addons/pull/154)
- **17.0.1**: Fix [#151](https://github.com/porscheinformatik/material-addons/pull/151)
- **17.0.0**: Upgrade to Angular 17 and Angular Material 17.
- **16.0.7**: Toolbar: Added the possibility to use a function callback for mainActions
- **16.0.5**: Fix data-table row actions [#144](https://github.com/porscheinformatik/material-addons/pull/144)
- **16.0.5**: Added Reactive form validation support for quick list [#143](https://github.com/porscheinformatik/material-addons/pull/143)
- **16.0.4**: Append functionality of ReadonlyFormField [#142](https://github.com/porscheinformatik/material-addons/pull/142)
- **16.0.3**: Fix read-only-form-field styling for "right" aligned units
- **16.0.2**: Upgraded Angular to v16.2. Caution: This version only supports ES2022!
- **15.0.3**: Fixed layout issue in cards
- **15.0.1**: Removed all @angular/flex-layout dependencies and replaced them with pure CSS
- **15.0.0**: **MAJOR ANGULAR 15 RELEASE**
  - **breaking changes** - [#131 Upgrade to Angular 15 with MDC Components](https://github.com/porscheinformatik/material-addons/pull/131)
    - This version requires your application to use Angular 15
    - The framework is now based on Angular Material components using MDC (Material Design Components)

<details><summary>View older changelogs</summary>

- **14.1.6**: Show tooltips in toolbar action burger menu
- **14.1.4**: data-table fixes: action button became too small for tables with a lot of colums
- **14.1.x**: Fix Button Styling for Stepper and Quicklist: change "add" button in Quicklist to "Outline" Styling and "next" and "done" button in MatStepper to "Primary" Styling
- **14.1.2**: minor fixes in datatable
- **14.1.1**: minor fixes: datatable paging bug and action column maxwidth
- **14.1.0**: **BREAKING** - Upgraded library to Angular 14, enabled Ivy builds, updated lib to esm2020
- **10.4.1**: Added removePossible input to mad-quick-list
- **10.4.0**: **BREAKING** - Data Table Column
  configuration [#111](https://github.com/porscheinformatik/material-addons/pull/111)
- **10.3.4**: toolbar actions: added 'importantAction' property. These actions will never be hidden in a mat-menu
- **10.3.3**: mad-table: Added sticky column feature, fixed vertical scroll bar issue
- **10.3.2**: Don't print toolbar menu when using browser print function (ctrl+p)
- **10.3.1**: Toolbar Action enhancements [#102](https://github.com/porscheinformatik/material-addons/issues/102)
- **10.3.0**:

  - **breaking change** - [#101](https://github.com/porscheinformatik/material-addons/pull/101) Data table enhancements
    - BatchMode
    - Actions for SINGLE, BATCH, NONE
    - Loading Animation
    - custom ID generator
    - custom column data transformation

- **10.2.5**: Fix toolbar icon button color in mobile view
- **10.2.4**: Enhancements/Fixes in Flowbar Layout
- **10.2.3**:
  - **visible change** - [#92](https://github.com/porscheinformatik/material-addons/issues/92) Fixed validation theme
    warn-color in PBV theme
- **10.2.2**:
  - Added [#73](https://github.com/porscheinformatik/material-addons/issues/73) DataGrid Component
  - Added [#89](https://github.com/porscheinformatik/material-addons/issues/89) Flowbar Layout
- **10.2.1**:
  - Added [#88 stepper component](https://github.com/porscheinformatik/material-addons/issues/88)
- **10.2.0**:
  - Change peerDependency versions to any Angular above 10.0.0
  - Added [additionalActionIcon](https://porscheinformatik.github.io/material-addons/card) feature to mad-cards
  - Demo: Fixed package.json some issues that occurred during development
- **10.1.9**:
  - CSS fix: Hide all types of mad-buttons when printing a page
  - Demo: Hide navbar when printing a page
- **10.1.8**:
  - CSS fix: Class "fixedtabs" also affected child tab components. This is now fixed.
- **10.1.7**:
  - Fix ([issue](https://github.com/porscheinformatik/material-addons/issues/78)) / mad-table inside card overflows the
    card
- **10.1.6**:
  - Table fix: Show empty-text correctly when no data is present
- **10.1.5**:
  - Set input id for readonly-form-field-wrapper (requrired for cypress
    tests) ([pr](https://github.com/porscheinformatik/material-addons/pull/69))
- **10.1.4**:
  - Disabled click-listener for disabled
    buttons ([issue](https://github.com/porscheinformatik/material-addons/issues/67))
- **10.1.3**:
  - Fixed add-button disabled handling in
    mad-quick-list ([issue](https://github.com/porscheinformatik/material-addons/issues/65))
- **10.1.2**:
  - Cleanup
- **10.0.27**:
  - **Visible change:** Ellipsis support for readonly-form-fields (enabled per
    default) [demo](https://porscheinformatik.github.io/material-addons/card)
  - **Visible change:** Fix toolbar badges on mobile devices
  - Added shrinkIfEmpty feature to read-only
    textareas [demo](https://porscheinformatik.github.io/material-addons/readonly)
  - Added save-button throttling as default to card component
  - Minor bugfixes in Demo
- **10.0.26**: Added throttle button
  directive [demo](https://porscheinformatik.github.io/material-addons/throttle-click)
- **10.0.25**: Added badge support for toolbar actions,
  see [toolbar demo](https://porscheinformatik.github.io/material-addons)
- **10.0.24**: Added text field support for read-only-form-field-wrapper with "multiline" and "rows" arguments
- **10.0.22**: Fixed [#52](https://github.com/porscheinformatik/material-addons/issues/52) and updated
  documentation [#48](https://github.com/porscheinformatik/material-addons/pull/48)
- **10.0.21**: Added [mad button components](https://porscheinformatik.github.io/material-addons/mad-buttons) (
  mad-primary-button, mad-outline-button, etc.) to ensure a unified design
- **10.0.19**: Fixed [#46](https://github.com/porscheinformatik/material-addons/issues/46) where read-only numbers were
  formatted by default
- **10.0.18**: Fix [card](https://porscheinformatik.github.io/material-addons/card) header size by using default
  Angular Material styling
- **10.0.17**: Minor fixes in 4
  components ([numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field)
  , [action-table](https://porscheinformatik.github.io/material-addons/action-table)
  , [quicklist](https://porscheinformatik.github.io/material-addons/quick-list)
  , [readonly-formfield](https://porscheinformatik.github.io/material-addons/readonly))
- **10.0.16**: Fix number format detection
  in [numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field)
- **10.0.15**: Small fix in [action-table](https://porscheinformatik.github.io/material-addons/action-table)
- **10.0.14**: Add [action-table](https://porscheinformatik.github.io/material-addons/action-table) bugfix
  in [numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field)
- **10.0.13**: Event emitter fix in [card](https://porscheinformatik.github.io/material-addons/card) component
- **10.0.12**: Style fix in [card](https://porscheinformatik.github.io/material-addons/card) component
- **10.0.11**: Added [quicklist](https://porscheinformatik.github.io/material-addons/quick-list)
  and [card](https://porscheinformatik.github.io/material-addons/card) component
- **10.0.10**: Added [numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field) editable fields
- **10.0.9**: (not released)
- **10.0.8**: Added [numeric-field](https://porscheinformatik.github.io/material-addons/numeric-field) directive`

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

2. Add the stylesheet in your angular.json (or project.json in case NX is used):

   ```
   "styles": [
     "node_modules/@porscheinformatik/material-addons/themes/poa.scss"
   ]
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

1. Update the release information above. Please provide some information about the change.
2. Create a new Github Release:
   1. [Releases](https://github.com/porscheinformatik/material-addons/releases)
   2. Please create a new tag matching the release version 
   ![img.png](img.png)
   3. The version name of the release should NOT have the "v" prefix. 
   ![img_1.png](img_1.png)
   5The deploy pipeline will trigger automatically.
3. Check if the [deploy pipeline](https://github.com/porscheinformatik/material-addons/actions/workflows/release.yml)
   succeeded
4. The new version should appear on npmjs.org [here](https://www.npmjs.com/package/@porscheinformatik/material-addons?activeTab=versions)
5. Please note that it can take 4-6 hours until the version is available in local Artifactory installations!
