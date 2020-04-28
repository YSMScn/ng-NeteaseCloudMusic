import { Component, OnInit, TemplateRef, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { pluck, debounceTime, distinct, distinctUntilChanged } from 'rxjs/internal/operators';
import { SearchResult } from 'src/app/services/data-types/common-types';
import { isEmptyObject } from 'src/app/utils/tools';
import { Overlay, OverlayRef}from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';

@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styleUrls: []
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() customView: TemplateRef<any>;
  @Input() searchResult: SearchResult;
  @ViewChild('nzInput', {static: false})private nzInput: ElementRef;
  @ViewChild('search', {static: false})private searchRef: ElementRef;
  @Output()onSearch = new EventEmitter<string>();
  private overlayRef: OverlayRef;
  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) { }

  // 使用rxjs截流，如果直接在dom上绑定会出现大量调用搜索接口的情况
  ngAfterViewInit() {
    fromEvent(this.nzInput.nativeElement, 'input')
    .pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
    .subscribe((value: string) => {
      this.onSearch.emit(value);
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchResult && !changes.searchResult.firstChange) {
      if (!isEmptyObject(this.searchResult)) {
        this.showOverlayPanel();
      } else {
        this.showOverlayPanel();
      }
    }
  }

  hideOverlayPanel() {
    if (this.overlayRef && this.overlayRef.hasAttached) {
      this.overlayRef.dispose();
    }
  }

  showOverlayPanel() {
    this.hideOverlayPanel();
    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.searchRef).withPositions([{
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top'
    }]).withLockedPosition(true);
    this.overlayRef = this.overlay.create({
      // hasBackdrop:true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    const panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef);
    const panelRef = this.overlayRef.attach(panelPortal);
    panelRef.instance.searchResult = this.searchResult;
    console.log('this.searchResult: ', this.searchResult);
    this.overlayRef.backdropClick().subscribe(() => {this.hideOverlayPanel(); });
  }

  onFocus() {
    if (this.searchResult && !isEmptyObject(this.searchResult)) {
      this.showOverlayPanel();
    }
  }

  onBlur() {
    this.hideOverlayPanel();
  }
}
