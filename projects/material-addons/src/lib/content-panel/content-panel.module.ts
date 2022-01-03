import { ContentHeaderComponent } from './content-header/content-header.component';
import { ContentPanelContainerComponent } from './content-panel-container/content-panel-container.component';
import { ContentPanelContainerContentComponent } from './content-panel-container-content/content-panel-container-content.component';
import { ContentPanelContainerFooterComponent } from './content-panel-container-footer/content-panel-container-footer.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ContentHeaderComponent,
    ContentPanelContainerComponent,
    ContentPanelContainerContentComponent,
    ContentPanelContainerFooterComponent,
    MainContainerComponent,
  ],
  imports: [CommonModule],
  exports: [
    ContentHeaderComponent,
    ContentPanelContainerComponent,
    ContentPanelContainerContentComponent,
    ContentPanelContainerFooterComponent,
    MainContainerComponent,
  ],
})
export class ContentPanelModule {}
