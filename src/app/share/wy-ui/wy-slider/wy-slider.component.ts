import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, Input, Inject, ChangeDetectorRef, OnDestroy, forwardRef } from '@angular/core';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { filter,tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { SliderEventObserverConfig, SliderValue } from './wy-slider-types';
import { DOCUMENT } from '@angular/common';
import { sliderEvent, getElementOffset } from './wy-slider-helper';
import { getPercent, limitNumberInRange } from 'src/app/utils/number';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[{
    provide:NG_VALUE_ACCESSOR,
    useExisting:forwardRef(()=>WySliderComponent),
    multi:true
  }]
})
export class WySliderComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;
  @Input() bufferOffset:SliderValue = 0;

  private isDragging = false;
  value:SliderValue=null;
  offset:SliderValue = null


  private sliderDom: HTMLDivElement;
  @ViewChild("wySlider",{static:true}) private wySlider:ElementRef;
  private dragStart$:Observable<number>;
  private dragMove$:Observable<number>;
  private dragEnd$:Observable<Event>;
  private dragStart_:Subscription;
  private dragMove_:Subscription;
  private dragEnd_:Subscription;
  constructor(@Inject(DOCUMENT) private doc: Document, private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.sliderDom = this.wySlider.nativeElement;
    console.log(this.wySlider)
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }


  private createDraggingObservables(){
    const orientField = this.wyVertical?'pageY':'pageX';
    const mouse:SliderEventObserverConfig={
      start:'mousedown',
      move:'mousemove',
      end:'mouseup',
      filters: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey:[orientField]
    };
    const touch:SliderEventObserverConfig={
      start:'touchstart',
      move:'touchmove',
      end:'touchend',
      filters: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey:['touches','0',orientField]
    };

    [mouse,touch].forEach(source =>{
      const {start,move,end,filters,pluckKey} = source;
      source.startPlucked$ = fromEvent(this.sliderDom,start)
      .pipe(
        filter(filters),
        tap(sliderEvent),
      pluck(...pluckKey),
      map((position:number) => this.findClosestValue(position) )
      );

      source.end$ = fromEvent(this.doc,end);

      source.moveResolved$ = fromEvent(this.doc,move)
      .pipe(
        filter(filters),
        tap(sliderEvent),
      pluck(...pluckKey),
      distinctUntilChanged(),
      map((position:number) => this.findClosestValue(position) ),
      takeUntil(source.end$)
      );
    });


    this.dragStart$ = merge(mouse.startPlucked$,touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$,touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$,touch.end$);

  }


  private subscribeDrag(events:string[]=['start','move','end']){
    if(events.indexOf('start') !== -1 && this.dragStart$ && !this.dragStart_){
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    else if(events.indexOf('move') !== -1 && this.dragMove$ && !this.dragMove_){
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    else if(events.indexOf('end') !== -1 && this.dragEnd$ && !this.dragEnd_){
      this.dragEnd_= this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private unSubscribeDrag(events:string[]=['start','move','end']){
    if(events.indexOf('start') !== -1 && this.dragStart_){
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    else if(events.indexOf('move') !== -1 && this.dragMove_){
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    else if(events.indexOf('end') !== -1 && this.dragEnd_){
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }

  private onDragStart(value : number){
    console.log('value: ',value);
    this.setValue(value);
    this.toggleDragMoving(true);
  }
  private onDragMove(value : number){
    if(this.isDragging){
      this.setValue(value);
      this.cdr.markForCheck();
    }
  }
  private onDragEnd(){
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private setValue(value:number,needCheck = false){
    if(needCheck){
      if(!this.isDragging){return;}
      this.value=this.formatValue(value);
      this.updateTrackAndHandle();
    }
    else{
      this.value = value;
      this.updateTrackAndHandle();
      this.onValueChange(this.value);
    }

  }

  private formatValue(value:SliderValue):SliderValue{
    let res = value;
    if(!this.asserValueValid(value)){
      res = this.wyMin;
    }
    else{
      res = limitNumberInRange(value,this.wyMin,this.wyMax);
    }
    return res;
  }

  private asserValueValid(value:SliderValue):boolean{
    return isNaN(typeof value !=='number' ? parseFloat(value):value);
  }

  private updateTrackAndHandle(){
    this.offset = this.getValueToOffset(this.value);
    this.cdr.markForCheck();
  }

  private getValueToOffset(value:SliderValue):SliderValue{
    return getPercent(this.wyMin,this.wyMax,value);
  }

  private toggleDragMoving(movable:boolean){
    this.isDragging = movable;
    if(movable){
      
      this.subscribeDrag(['move','end']);
    }
    else{
      this.unSubscribeDrag(['move','end']);
    }
  }


  private findClosestValue(position : number):number{
    //get slider's length
    const sliderLength = this.getSliderLength();

    //get most left or top point
    const sliderStart = this.getSliderStartPosition();

    //current positon/slider length, because of the slider could be vertical or horizontal, the ratio need to be 1-ratio for vertical slider
    const r = limitNumberInRange((position-sliderStart)/sliderLength,0,1);
    const ratio = this.wyVertical?1-r:r;

    return ratio *(this.wyMax-this.wyMin)+this.wyMin;

  }

  private getSliderLength():number{
    return this.wyVertical?this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getSliderStartPosition():number{
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical?offset.top: offset.left;
  }

  ngOnDestroy(): void {
    this.unSubscribeDrag();
  }

  private onValueChange(value:SliderValue):void{

  }
  private onTouched():void{

  }
  writeValue(value: SliderValue): void {
    this.setValue(value,true);
  }
  registerOnChange(fn: (value:SliderValue)=> void): void {
    this.onValueChange= fn;
  }
  registerOnTouched(fn: ()=>void): void {
    this.onTouched=fn;
  }
}
