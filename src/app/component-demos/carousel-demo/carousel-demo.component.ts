import { Component } from '@angular/core';
import { ExampleViewerComponent } from '../../components/example-viewer/example-viewer.component';
import { Example } from '../../components/example-viewer/example.class';
import { CarouselBasicComponent } from '../../example-components/carousel-basic/carousel-basic.component';
import { TextCodeComponent } from '../../components/text-code/text-code.component';
import {
  DataTableColumn,
  DataTableComponent,
  DataTableTemplateCellDefinition,
  DataTableTemplateColumnDefinition,
} from '@porscheinformatik/material-addons';

@Component({
  selector: 'app-carousel-demo',
  imports: [
    ExampleViewerComponent,
    TextCodeComponent,
    DataTableComponent,
    DataTableTemplateColumnDefinition,
    DataTableTemplateCellDefinition,
  ],
  templateUrl: './carousel-demo.component.html',
  styleUrl: './carousel-demo.component.scss',
})
export class CarouselDemoComponent {
  carouselComponent = new Example(CarouselBasicComponent, 'carousel-basic', 'Carousel');

  protected readonly carouselProperties = [
    {
      property: 'options',
      description: 'The options to display in the carousel. Each option should have a title, description, and image.',
      type: 'EmblaOptionsType',
      defaultValue: 'undefined',
    },
    {
      property: 'width',
      description: "The width of the carousel. Can be set to any valid CSS width value (e.g., '100%', '500px').",
      type: 'string',
      defaultValue: "'50%'",
    },
    {
      property: 'slideHeight',
      description: "The height of each slide in the carousel. Can be set to any valid CSS height value (e.g., '300px', '50vh').",
      type: 'string',
      defaultValue: "'12rem'",
    },
    {
      property: 'slideBorderRadius',
      description:
        "The border radius of each slide in the carousel. Can be set to any valid CSS border-radius value (e.g., '10px', '50%').",
      type: 'string',
      defaultValue: "'5px'",
    },
    {
      property: 'useSlideBorder',
      description: 'A boolean flag that determines whether to apply a border to each slide in the carousel.',
      type: 'boolean',
      defaultValue: 'true',
    },
  ];

  protected readonly displayedColumns: DataTableColumn[] = [
    {
      id: 'property',
      label: 'Property',
      dataPropertyName: 'property',
    },
    {
      id: 'description',
      label: 'Description',
      dataPropertyName: 'description',
    },
    {
      id: 'type',
      label: 'Type',
      dataPropertyName: 'type',
    },
    {
      id: 'defaultValue',
      label: 'Default value',
      dataPropertyName: 'defaultValue',
    },
  ];
}
