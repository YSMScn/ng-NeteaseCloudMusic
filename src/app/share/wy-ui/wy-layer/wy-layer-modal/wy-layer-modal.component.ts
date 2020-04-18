import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, ViewChild, AfterViewInit, Renderer2, Inject, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import {Overlay ,OverlayRef,OverlayKeyboardDispatcher,BlockScrollStrategy,OverlayContainer} from '@angular/cdk/overlay';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { ESCAPE } from '@angular/cdk/keycodes';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { DOCUMENT } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[trigger('showHide',[
    state('show',style({transform:'scale(1)',opacity:1})),
    state('hide',style({transform:'scale(0)',opacity:0})),
    transition('show<=>hide',animate('0.1s'))
  ])]
})
export class WyLayerModalComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() visiable:boolean;
  @Input() currentModaltype:ModalTypes;
  private overlayRef:OverlayRef;
  showModal = 'hide';
  scrollStrategy: BlockScrollStrategy;
  @ViewChild('modalContainer',{static:true})private modalRef:ElementRef;
  private resizeHandler:()=>void;
  private overlayContainerEl:HTMLElement;
  @Output()onLoadMySheets = new EventEmitter<void>();
  constructor(
    @Inject(DOCUMENT) private doc:Document,
    @Inject(DOCUMENT) private win:Window,
    private overlay: Overlay,
    private elementRef:ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr:ChangeDetectorRef,
    private batchActionServe:BatchActionsService,
    private rd:Renderer2,
    private overlayContainerServe:OverlayContainer
  ) {
    this.scrollStrategy = this.overlay.scrollStrategies.block();
   }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['visiable']&&!changes['visiable'].firstChange){
      this.handleVisiableChange(this.visiable);
    }
  }
  ngAfterViewInit(): void {
    this.listenResizeToCentre();
    this.overlayContainerEl = this.overlayContainerServe.getContainerElement();
  }

  ngOnInit(): void {
    this.createOverlay();
  }

  private createOverlay(){
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe(e=>this.keydownListener(e));
  }

  private keydownListener(event:KeyboardEvent){
    if (event.keyCode === ESCAPE) {
      this.hide();
    }
  }

  private handleVisiableChange(visiable:boolean){
    if(visiable){
      this.showModal = 'show';
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCentre();
      this.changePointerEvents('auto');
    }else{
      this.showModal = 'hide';
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler();
      this.changePointerEvents('none');
    }
    this.cdr.markForCheck()
  }

  private changePointerEvents(type:'auto'|'none'){
    if(this.overlayContainerEl){
      this.overlayContainerEl.style.pointerEvents = type;
    }
  }

  hide(){
    this.batchActionServe.controlModal(false);
  }

  private listenResizeToCentre(){
    const modal = this.modalRef.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    this.keepCentre(modal,modalSize);
    this.resizeHandler = this.rd.listen('window','resize',()=>{this.keepCentre(modal,modalSize)});
  }
  private keepCentre(modal:HTMLElement,size:{w:number,h:number}){
    const left = (this.getWindowSize().w - size.w)/2;
    const top = (this.getWindowSize().h - size.h)/2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';
  }

  private getWindowSize(){
    return {
      w:this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h:this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight
    }
  }

  private getHideDomSize(dom:HTMLElement){
    console.log('dom: ',dom);
    return {
      w:dom.offsetWidth,
      h:dom.offsetHeight
    }
  }
}
