import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { wySliderStyle } from './wy-slider-types';

@Component({
  selector: 'app-wy-slider-handle',
  template: '<div class="wy-slider-handle" [ngStyle]="style"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WySliderHandleComponent implements OnInit, OnChanges {
  @Input() wyVertical = false;
  @Input() wyOffset: number;
  style: wySliderStyle = {};

  constructor() { }


  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.wyOffset) {
      this.style[this.wyVertical ? 'bottom' : 'left'] = this.wyOffset + '%';
    }
  }

}
