import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, ViewChild, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { getModalVisiable, getModalType, getMember } from 'src/app/store/selectors/member.selector';
import {Overlay ,OverlayRef,OverlayKeyboardDispatcher,BlockScrollStrategy} from '@angular/cdk/overlay';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { ESCAPE } from '@angular/cdk/keycodes';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit, AfterViewInit {
  private visiable = false;
  private currentModaltype = ModalTypes.default;
  private overlayRef:OverlayRef;
  showModal = false;
  scrollStrategy: BlockScrollStrategy;
  @ViewChild('modalContainer',{static:true})private modalRef:ElementRef;
  private resizeHandler:()=>void;
  constructor(
    @Inject(DOCUMENT) private doc:Document,
    @Inject(DOCUMENT) private win:Window,
    private store$: Store<AppStoreModule>,
    private overlay: Overlay,
    private elementRef:ElementRef,
    private overlayKeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr:ChangeDetectorRef,
    private batchActionServe:BatchActionsService,
    private rd:Renderer2
  ) {
    const appStore$ = this.store$.pipe(select(getMember));
    appStore$.pipe(select(getModalVisiable)).subscribe(visiable=>this.watchModalVisiable(visiable));
    appStore$.pipe(select(getModalType)).subscribe(type=>this.watchModalType(type));
    this.scrollStrategy = this.overlay.scrollStrategies.block();
   }
  ngAfterViewInit(): void {
    this.listenResizeToCentre();
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

  private watchModalVisiable(visiable:boolean){
    if(this.visiable !== visiable){
      this.visiable = visiable;
      this.handleVisiableChange(visiable);
    }

  }

  private watchModalType(type:ModalTypes){
    if(this.currentModaltype !== type){
      this.currentModaltype = type;
    }
  }

  private handleVisiableChange(visiable:boolean){
    console.log('handleVisiableChange: ',visiable);
    this.showModal = visiable;
    if(visiable){
      this.scrollStrategy.enable();
      this.overlayKeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCentre();
    }else{
      this.scrollStrategy.disable();
      this.overlayKeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandler();
    }
    this.cdr.markForCheck()
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
