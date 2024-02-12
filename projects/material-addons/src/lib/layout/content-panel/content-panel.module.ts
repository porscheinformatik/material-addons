import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentHeaderComponent } from './content-header/content-header.component';
import { ContentPanelContainerComponent } from './content-panel-container/content-panel-container.component';
import { ContentPanelContainerContentComponent } from './content-panel-container-content/content-panel-container-content.component';
import { ContentPanelContainerFooterComponent } from './content-panel-container-footer/content-panel-container-footer.component';
import { ContentPanelContainerSidebarComponent } from './content-panel-container-sidebar/content-panel-container-sidebar.component';

import { MainContainerComponent } from './main-container/main-container.component';
@NgModule({
  declarations: [
    ContentHeaderComponent,
    ContentPanelContainerComponent,
    ContentPanelContainerContentComponent,
    ContentPanelContainerFooterComponent,
    ContentPanelContainerSidebarComponent,
    MainContainerComponent,
  ],
  imports: [CommonModule],
  exports: [
    ContentHeaderComponent,
    ContentPanelContainerComponent,
    ContentPanelContainerContentComponent,
    ContentPanelContainerFooterComponent,
    ContentPanelContainerSidebarComponent,
    MainContainerComponent,
  ],
})
export class ContentPanelModule {}
