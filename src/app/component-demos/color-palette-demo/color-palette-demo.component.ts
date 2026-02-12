import { Component, effect, inject } from '@angular/core';
import { LowerCasePipe, UpperCasePipe } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ThemeService } from '../../services/theme.service';
import { AlertComponent } from '@porscheinformatik/material-addons';
import { ButtonModule } from '@porscheinformatik/material-addons';

interface ColorSwatch {
  label: string;
  variable: string;
  value: string;
}

interface ColorColumn {
  title: string;
  swatches: ColorSwatch[];
}

interface ComponentColorRow {
  label: string;
  swatches: ColorSwatch[];
}

@Component({
  selector: 'app-colors-demo',
  imports: [LowerCasePipe, UpperCasePipe, AlertComponent, ButtonModule, MatSnackBarModule],
  templateUrl: './color-palette-demo.component.html',
  styleUrl: './color-palette-demo.component.scss',
})
export class ColorsDemoComponent {
  private themeService = inject(ThemeService);
  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);
  activeTheme = this.themeService.activeTheme;

  statusColumns: ColorColumn[] = [];
  surfaceSwatches: ColorSwatch[] = [];
  componentSwatches: ColorSwatch[] = [];
  interactiveSwatches: ColorSwatch[] = [];
  objectBorderSwatches: ColorSwatch[] = [];
  alertColorRows: ComponentColorRow[] = [];
  buttonColorRows: ComponentColorRow[] = [];

  private readonly statusDefs: { title: string; variables: { label: string; variable: string }[] }[] = [
    {
      title: 'Primary',
      variables: [{ label: 'Primary', variable: '--main-primary' }],
    },
    {
      title: 'Success',
      variables: [
        { label: 'Background', variable: '--alert-success-background-color' },
        { label: 'Border', variable: '--alert-success-border-color' },
        { label: 'Text', variable: '--alert-success-text-color' },
      ],
    },
    {
      title: 'Info',
      variables: [
        { label: 'Background', variable: '--alert-info-background-color' },
        { label: 'Border', variable: '--alert-info-border-color' },
        { label: 'Text', variable: '--alert-info-text-color' },
      ],
    },
    {
      title: 'Warning',
      variables: [
        { label: 'Warning', variable: '--warn-color' },
        { label: 'Background', variable: '--alert-warning-background-color' },
        { label: 'Border', variable: '--alert-warning-border-color' },
        { label: 'Text', variable: '--alert-warning-text-color' },
      ],
    },
    {
      title: 'Error',
      variables: [
        { label: 'Error', variable: '--error-color' },
        { label: 'Background', variable: '--alert-error-background-color' },
        { label: 'Border', variable: '--alert-error-border-color' },
        { label: 'Text', variable: '--alert-error-text-color' },
      ],
    },
  ];

  private readonly interactiveDefs: { label: string; variable: string }[] = [
    { label: 'Selection Background', variable: '--selection-background' },
    { label: 'Hover Color', variable: '--hover-color' },
    { label: 'Table Hover', variable: '--table-hover-color' },
  ];

  private readonly objectBorderDefs: { label: string; variable: string }[] = [
    { label: 'Background', variable: '--background-color' },
    { label: 'Panel Color', variable: '--panel-color' },
    { label: 'Panel Background', variable: '--panel-background-color' },
    { label: 'Panel Border', variable: '--panel-border-color' },
    { label: 'Panel Select Background', variable: '--panel-select-background' },
  ];

  private readonly surfaceDefs: { label: string; variable: string }[] = [
    { label: 'Surface', variable: '--mat-sys-surface' },
    { label: 'Surface Variant', variable: '--mat-sys-surface-variant' },
    { label: 'Container Lowest', variable: '--mat-sys-surface-container-lowest' },
    { label: 'Container Low', variable: '--mat-sys-surface-container-low' },
    { label: 'Container', variable: '--mat-sys-surface-container' },
    { label: 'Container High', variable: '--mat-sys-surface-container-high' },
    { label: 'Container Highest', variable: '--mat-sys-surface-container-highest' },
  ];

  private readonly componentDefs: { label: string; variable: string }[] = [
    { label: 'Toolbar Background', variable: '--toolbar-background' },
    { label: 'Datatable Background', variable: '--datatable-background' },
    { label: 'Datatable Hover', variable: '--datatable-hover' },
    { label: 'Step Header Selected', variable: '--step-header-selected-background' },
    { label: 'Step Header Default', variable: '--step-header-default-background' },
    { label: 'Step Border', variable: '--step-border-color' },
    { label: 'Step Complete', variable: '--step-complete-color' },
    { label: 'Step Neutral', variable: '--step-neutral-color' },
  ];

  private readonly alertColorDefs: { label: string; variables: { label: string; variable: string }[] }[] = [
    {
      label: 'Error',
      variables: [
        { label: 'Color', variable: '--error-color' },
        { label: 'Background', variable: '--alert-error-background-color' },
        { label: 'Border', variable: '--alert-error-border-color' },
        { label: 'Text', variable: '--alert-error-text-color' },
      ],
    },
    {
      label: 'Warning',
      variables: [
        { label: 'Color', variable: '--warn-color' },
        { label: 'Background', variable: '--alert-warning-background-color' },
        { label: 'Border', variable: '--alert-warning-border-color' },
        { label: 'Text', variable: '--alert-warning-text-color' },
      ],
    },
    {
      label: 'Info',
      variables: [
        { label: 'Background', variable: '--alert-info-background-color' },
        { label: 'Border', variable: '--alert-info-border-color' },
        { label: 'Text', variable: '--alert-info-text-color' },
      ],
    },
    {
      label: 'Success',
      variables: [
        { label: 'Background', variable: '--alert-success-background-color' },
        { label: 'Border', variable: '--alert-success-border-color' },
        { label: 'Text', variable: '--alert-success-text-color' },
      ],
    },
  ];

  private readonly buttonColorDefs: { label: string; variables: { label: string; variable: string }[] }[] = [
    {
      label: 'Primary',
      variables: [
        { label: 'Background', variable: '--main-primary' },
      ],
    },
    {
      label: 'Outline',
      variables: [
        { label: 'Border & Text', variable: '--main-primary' },
      ],
    },
    {
      label: 'Link',
      variables: [
        { label: 'Text', variable: '--main-primary' },
      ],
    },
    {
      label: 'Danger',
      variables: [
        { label: 'Background', variable: '--error-color' },
      ],
    },
  ];

  constructor() {
    effect(() => {
      this.activeTheme();
      setTimeout(() => this.refreshColors(), 100);
    });
  }

  copyColor(swatch: ColorSwatch): void {
    this.clipboard.copy(swatch.value);
    this.snackBar.open(`Copied ${swatch.value}`, undefined, { duration: 2000 });
  }

  refreshColors(): void {
    const styles = getComputedStyle(document.documentElement);

    this.statusColumns = this.statusDefs.map(col => ({
      title: col.title,
      swatches: col.variables.map(v => ({
        label: v.label,
        variable: v.variable,
        value: this.resolveColor(styles, v.variable),
      })),
    }));

    this.surfaceSwatches = this.surfaceDefs.map(v => ({
      label: v.label,
      variable: v.variable,
      value: this.resolveColor(styles, v.variable),
    }));

    this.componentSwatches = this.componentDefs.map(v => ({
      label: v.label,
      variable: v.variable,
      value: this.resolveColor(styles, v.variable),
    }));

    this.interactiveSwatches = this.interactiveDefs.map(v => ({
      label: v.label,
      variable: v.variable,
      value: this.resolveColor(styles, v.variable),
    }));

    this.objectBorderSwatches = this.objectBorderDefs.map(v => ({
      label: v.label,
      variable: v.variable,
      value: this.resolveColor(styles, v.variable),
    }));

    const resolveRow = (def: { label: string; variables: { label: string; variable: string }[] }): ComponentColorRow => ({
      label: def.label,
      swatches: def.variables.map(v => ({
        label: v.label,
        variable: v.variable,
        value: this.resolveColor(styles, v.variable),
      })),
    });

    this.alertColorRows = this.alertColorDefs.map(resolveRow);
    this.buttonColorRows = this.buttonColorDefs.map(resolveRow);
  }

  private resolveColor(styles: CSSStyleDeclaration, variable: string): string {
    const raw = styles.getPropertyValue(variable).trim();
    if (!raw) {
      return 'not set';
    }
    return this.toHex(raw) || raw;
  }

  private toHex(value: string): string | null {
    if (value.startsWith('#')) {
      return value.length === 4
        ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
        : value;
    }
    const rgbMatch = value.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)/);
    if (rgbMatch) {
      const r = Math.round(parseFloat(rgbMatch[1])).toString(16).padStart(2, '0');
      const g = Math.round(parseFloat(rgbMatch[2])).toString(16).padStart(2, '0');
      const b = Math.round(parseFloat(rgbMatch[3])).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return null;
  }
}
