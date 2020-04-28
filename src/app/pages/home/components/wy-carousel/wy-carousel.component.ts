import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wy-carousel',
  templateUrl: './wy-carousel.component.html',
  styleUrls: ['./wy-carousel.component.less']
})
export class WyCarouselComponent implements OnInit {
  @Input() activeIndex = 0;
  @ViewChild('dot', {static: true}) dotRef: TemplateRef<any>;
  @Output() changeSlide = new EventEmitter<'pre' | 'next'>();
  constructor() { }

  ngOnInit(): void {
  }

  onChangeSlide(direction: 'pre' | 'next') {
    this.changeSlide.emit(direction);
  }
}
