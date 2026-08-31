import { ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { EmblaOptionsType } from 'embla-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CardModule,
  ReadOnlyFormFieldModule,
  CarouselComponent,
  CarouselShortTextDirective,
  CarouselSlideDirective,
} from '@porscheinformatik/material-addons';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-carousel',
  templateUrl: 'carousel-basic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CardModule,
    ReactiveFormsModule,
    FormsModule,
    ReadOnlyFormFieldModule,
    MatSlider,
    MatSliderThumb,
    MatCheckbox,
    MatFormField,
    MatLabel,
    MatInput,
    CarouselShortTextDirective,
    CarouselSlideDirective,
    CarouselComponent,
  ],
})
export class CarouselBasicComponent {
  protected slideHeight: number = 15;
  protected carouselWidth: number = 50;
  protected slideBorderRadius: number = 5;
  protected widthUnit: string = '%';
  protected heightUnit: string = 'rem';
  protected borderRadiusUnit: string = 'px';
  protected useSlideBorder: boolean = false;
  protected useCardsAsSlides: boolean = true;
  protected loop: boolean = true;

  private refreshTimeout: ReturnType<typeof setTimeout> | undefined;
  protected carouselVisible = true;

  protected options = this.createOptions();

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  refresh(): void {
    clearTimeout(this.refreshTimeout);
    this.options = this.createOptions();
    this.refreshTimeout = setTimeout(() => {
      this.carouselVisible = false;
      this.changeDetectorRef.markForCheck();
      setTimeout(() => {
        this.carouselVisible = true;
        this.changeDetectorRef.markForCheck();
      });
    }, 100);
  }

  private createOptions(): EmblaOptionsType {
    return {
      loop: this.loop,
      align: 'start' as const,
    };
  }
}
