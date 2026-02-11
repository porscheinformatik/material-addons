import { Component, effect, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
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

@Component({
  selector: 'app-colors-demo',
  imports: [UpperCasePipe, AlertComponent, ButtonModule, MatSnackBarModule],
  templateUrl: './color-palette-demo.component.html',
  styleUrl: './color-palette-demo.component.scss',
})
export class ColorsDemoComponent {
  private themeService = inject(ThemeService);
  private clipboard = inject(Clipboard);
  private snackBar = inject(MatSnackBar);
  activeTheme = this.themeService.activeTheme;

  statusColumns: ColorColumn[] = [];
  interactiveSwatches: ColorSwatch[] = [];
  objectBorderSwatches: ColorSwatch[] = [];

  private readonly statusDefs: { title: string; variables: { label: string; variable: string }[] }[] = [
    {
      title: 'Primary',
      variables: [{ label: 'Primary', variable: '--main-primary' }],
    },
    {
      title: 'Success',
      variables: [
        { label: 'Success', variable: '--alert-success-border-color' },
        { label: 'Background', variable: '--alert-success-background-color' },
        { label: 'Border', variable: '--alert-success-border-color' },
        { label: 'Text', variable: '--alert-success-text-color' },
      ],
    },
    {
      title: 'Info',
      variables: [
        { label: 'Info', variable: '--alert-info-border-color' },
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
