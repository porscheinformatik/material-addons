import { Component } from '@angular/core';
import { CarouselModule } from '../../../../projects/material-addons/src/lib/carousel/carousel.module';
import { EmblaOptionsType } from 'embla-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule, ReadOnlyFormFieldModule } from '@porscheinformatik/material-addons';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { CarouselShortTextDirective } from '../../../../projects/material-addons/src/lib/carousel/carousel-short-text-directive/carousel-short-text-directive.component';

@Component({
  selector: 'app-carousel',
  templateUrl: 'carousel.component.html',
  styleUrls: ['carousel.component.scss'],
  imports: [
    CarouselModule,
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
  ],
})
export class CarouselComponent {
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

  refresh(): void {
    clearTimeout(this.refreshTimeout);
    this.options = this.createOptions();
    this.refreshTimeout = setTimeout(() => {
      this.carouselVisible = false;
      setTimeout(() => (this.carouselVisible = true));
    }, 100);
  }

  private createOptions(): EmblaOptionsType {
    return {
      loop: this.loop,
      align: 'start' as const,
    };
  }
}
