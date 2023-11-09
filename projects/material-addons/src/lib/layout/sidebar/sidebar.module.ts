import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SidebarComponent, SidebarItemComponent],
  exports: [SidebarComponent, SidebarItemComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class SidebarModule {}
