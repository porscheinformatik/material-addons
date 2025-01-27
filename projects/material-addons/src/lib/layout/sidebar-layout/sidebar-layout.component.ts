import { Component, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { ContentPanelModule } from '../content-panel/content-panel.module';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'mad-sidebar-layout',
    templateUrl: './sidebar-layout.component.html',
    styleUrl: './sidebar-layout.component.scss',
    imports: [CommonModule, ContentPanelModule, PortalModule, MatIconModule, RouterModule]
})
export class SidebarLayoutComponent {
  @Input() title: string = '';
  @Input() hasBackButton = true;

  @Input({ required: true }) set sideBarItems(ref: TemplateRef<unknown>) {
    this.sideBarItemsPortal = new TemplatePortal(ref, this._viewContainerRef);
  }

  sideBarItemsPortal?: TemplatePortal<unknown>;

  @Input() set headerContent(ref: TemplateRef<unknown>) {
    this.headerContentPortal = new TemplatePortal(ref, this._viewContainerRef);
  }

  headerContentPortal?: TemplatePortal<unknown>;

  @Input() set actionGroup(ref: TemplateRef<unknown>) {
    this.actionGroupPortal = new TemplatePortal(ref, this._viewContainerRef);
  }

  actionGroupPortal?: TemplatePortal<unknown>;

  @Input({ required: true }) set content(ref: TemplateRef<unknown>) {
    this.contentPortal = new TemplatePortal(ref, this._viewContainerRef);
  }

  contentPortal?: TemplatePortal<unknown>;

  @Input() set footer(ref: TemplateRef<unknown>) {
    this.footerPortal = new TemplatePortal(ref, this._viewContainerRef);
  }

  footerPortal?: TemplatePortal<unknown>;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private router: Router,
    private location: Location,
  ) {}

  public goToPreviousPage(): void {
    this.location.back();
  }
}
