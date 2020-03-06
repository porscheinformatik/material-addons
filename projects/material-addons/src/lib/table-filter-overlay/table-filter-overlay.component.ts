import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import { CdkConnectedOverlay, ConnectedPosition, Overlay, ScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';
import {
  MAT_SELECT_SCROLL_STRATEGY,
  matSelectAnimations,
  SELECT_PANEL_PADDING_X,
  SELECT_PANEL_VIEWPORT_PADDING,
} from '@angular/material/select';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'mad-table-filter-overlay',
  templateUrl: './table-filter-overlay.component.html',
  styleUrls: ['./table-filter-overlay.component.css'],
  animations: [matSelectAnimations.transformPanelWrap, matSelectAnimations.transformPanel],
})
export class TableFilterOverlayComponent implements OnInit, OnDestroy {
  @Input() disabled: boolean;
  @Input() panelClass: string | string[] | Set<string> | { [key: string]: any };

  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Event emitted when the select has been opened. */
  @Output('opened') readonly openedStream: Observable<void> = this.openedChange.pipe(
    filter(o => o),
    map(() => {}),
  );

  /** Event emitted when the select has been closed. */
  @Output('closed') readonly closedStream: Observable<void> = this.openedChange.pipe(
    filter(o => !o),
    map(() => {}),
  );

  positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'bottom',
    },
  ];

  transformOrigin = 'top';
  triggerFontSize = 0;
  offsetY = 0;
  panelDoneAnimatingStream = new Subject<string>();
  triggerRect: ClientRect;
  scrollStrategy: ScrollStrategy;

  @ViewChild(CdkConnectedOverlay, { static: false }) overlayDir: CdkConnectedOverlay;
  @ViewChild('trigger', { static: false }) trigger: ElementRef;
  @ViewChild('panel', { static: false }) panel: ElementRef;

  private isOpen: boolean;
  private readonly scrollStrategyFactory: () => ScrollStrategy;
  private readonly destroy$ = new Subject<void>();

  get panelOpen() {
    return this.isOpen;
  }

  constructor(
    private overlay: Overlay,
    private cdr: ChangeDetectorRef,
    private viewportRuler: ViewportRuler,
    @Optional() private parentFormField: MatFormField,
    @Inject(MAT_SELECT_SCROLL_STRATEGY) scrollStrategyFactory: any,
  ) {
    this.scrollStrategyFactory = scrollStrategyFactory;
    this.scrollStrategy = this.scrollStrategyFactory();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.panelDoneAnimatingStream.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
      if (this.panelOpen) {
        this.openedChange.emit(true);
      } else {
        this.openedChange.emit(false);
        this.overlayDir.offsetX = 0;
        this.cdr.markForCheck();
      }
    });

    this.viewportRuler
      .change()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.isOpen) {
          this.triggerRect = this.trigger.nativeElement.getBoundingClientRect();
          this.cdr.markForCheck();
        }
      });
  }

  close(): void {
    if (this.isOpen) {
      this.isOpen = false;
      this.cdr.markForCheck();
    }
  }

  open(): void {
    if (this.disabled || this.isOpen) {
      return;
    }

    this.triggerRect = this.trigger.nativeElement.getBoundingClientRect();
    this.triggerFontSize = parseInt(getComputedStyle(this.trigger.nativeElement).fontSize || '0', 10);
    this.isOpen = true;
    this.cdr.markForCheck();
  }

  toggle(): void {
    if (this.panelOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  onAttached(): void {
    this.overlayDir.positionChange.pipe(take(1)).subscribe(() => {
      this.cdr.detectChanges();
      this.calculateOverlayOffsetX();
    });
  }

  getPanelTheme(): string {
    return this.parentFormField ? `mat-${this.parentFormField.color}` : '';
  }

  private calculateOverlayOffsetX(): void {
    const overlayRect = this.overlayDir.overlayRef.overlayElement.getBoundingClientRect();
    const viewportSize = this.viewportRuler.getViewportSize();
    const paddingWidth = SELECT_PANEL_PADDING_X * 2;
    let offsetX = SELECT_PANEL_PADDING_X;
    const leftOverflow = 0 - (overlayRect.left + offsetX);
    const rightOverflow = overlayRect.right + offsetX - viewportSize.width + paddingWidth;

    if (leftOverflow > 0) {
      offsetX += leftOverflow + SELECT_PANEL_VIEWPORT_PADDING;
    } else if (rightOverflow > 0) {
      offsetX -= rightOverflow + SELECT_PANEL_VIEWPORT_PADDING;
    }

    this.overlayDir.offsetX = Math.round(offsetX);
    this.overlayDir.overlayRef.updatePosition();
  }
}
