import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, Input, Inject } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { filter,tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { SliderEventObserverConfig } from './wy-slider-types';
import { DOCUMENT } from '@angular/common';
import { sliderEvent } from './wy-slider-helper';
import { getElementOffset } from 'ng-zorro-antd';

@Component({
  selector: 'app-wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class WySliderComponent implements OnInit {
  @Input() wyVertical = false;
  @Input() wyMin = 0;
  @Input() wyMax = 100;


  private sliderDom: HTMLDivElement;
  @ViewChild("wySlider",{static:true}) private wySlider:ElementRef;
  private dragStart$:Observable<number>;
  private dragMove$:Observable<number>;
  private dragEnd$:Observable<Event>;
  constructor(@Inject(DOCUMENT) private doc: Document) { }

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
    if(events.indexOf('start') !== -1 && this.dragStart$){
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    else if(events.indexOf('move') !== -1 && this.dragMove$){
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    else if(events.indexOf('end') !== -1 && this.dragEnd$){
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }

  private onDragStart(value : number){
    console.log('value: ',value);
  }
  private onDragMove(value : number){

  }
  private onDragEnd(){

  }


  private findClosestValue(position : number):number{
    //get slider's length
    const sliderLength = this.getSliderLength();

    //get most left or top point
    const sliderStart = this.getSliderStartPosition();

    //current positon/slider length, because of the slider could be vertical or horizontal, the ratio need to be 1-ratio for vertical slider
    const r = (position-sliderStart)/sliderLength;
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
}
