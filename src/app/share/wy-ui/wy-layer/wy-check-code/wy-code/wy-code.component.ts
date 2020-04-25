import { Component, OnInit, ChangeDetectionStrategy, forwardRef, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import {BACKSPACE} from '@angular/cdk/keycodes'

const codeLength = 4;

@Component({
  selector: 'app-wy-code',
  templateUrl: './wy-code.component.html',
  styleUrls: ['wy-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
    provide:NG_VALUE_ACCESSOR,
    useExisting:forwardRef(()=>WyCodeComponent),
    multi:true

    }
  ]
})
export class WyCodeComponent implements OnInit, ControlValueAccessor,AfterViewInit, OnDestroy {
  inputArr = [];
  code:string;
  inputEl:HTMLElement[];
  result: string[] = [];
  currentFocusIndex = 0;
  private destory$ = new Subject();
  @ViewChild('codeWrap',{static:true})private codeWrap:ElementRef;
  constructor(
    private cdr:ChangeDetectorRef
  ) {
    this.inputArr = Array(codeLength).fill('');
   }
  ngOnDestroy(): void {
    this.destory$.next()
    this.destory$.complete();
  }
  ngAfterViewInit(): void {
    this.inputEl = this.codeWrap.nativeElement.getElementsByClassName('item') as HTMLElement[];
    this.inputEl[0].focus();
    for(let a = 0; a < this.inputEl.length;a++){
      const item = this.inputEl[a];
      fromEvent(item,'keyup').pipe(takeUntil(this.destory$)).subscribe((event:KeyboardEvent)=>this.listenKeyUp(event));
      fromEvent(item,'click').pipe(takeUntil(this.destory$)).subscribe(()=>this.currentFocusIndex = a);
    }
  }

  ngOnInit(): void {
  }

  writeValue(value: string): void {
    this.setValue(value);
  }
  registerOnChange(fn: (value:string)=>void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: ()=>void): void {
    this.onTouched = fn;
  }

  private setValue(value:string){
    this.code = value;
    this.onValueChange(value);
    this.cdr.markForCheck();
  }

  private listenKeyUp(evt:KeyboardEvent){
    const target = <HTMLInputElement>event.target;
    const value = target.value;
    const isBackSpace = evt.keyCode === BACKSPACE;
    if(/\D/.test(value)){
      target.value = '';
      this.result[this.currentFocusIndex]='';
    }else if(value){
      this.result[this.currentFocusIndex]=value;
      this.currentFocusIndex = (this.currentFocusIndex + 1) % codeLength;
      this.inputEl[this.currentFocusIndex].focus();
    }else if (isBackSpace){
      this.result[this.currentFocusIndex] = '';
      this.currentFocusIndex = Math.max(this.currentFocusIndex - 1,0);
      this.inputEl[this.currentFocusIndex].focus();
    }
    this.checkResult(this.result);
  }

  private checkResult(result:string[]){
    const codeStr = result.join('');
    this.setValue(codeStr);
  }

  private onValueChange(value:string){}
  private onTouched(){}

}
