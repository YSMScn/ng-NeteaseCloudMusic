import { Directive, ElementRef, Renderer2, Inject, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appClickoutside]'
})
export class ClickoutsideDirective implements OnChanges {

  private handleClick:()=>void;
  @Input() bindFlag = false;
  @Output() onClickOutside = new EventEmitter<void>();

  constructor(private el:ElementRef, private rd:Renderer2,@Inject(DOCUMENT)private doc:Document) {

   }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['bindFlag']&& !changes['bindFlag'].firstChange){
      if(this.bindFlag){
        console.log('el: ',this.el.nativeElement);
        this.handleClick = this.rd.listen(this.doc,'click',evt =>{
          const target = evt.target
          const isContain = this.el.nativeElement.contains(target);
          if(!isContain){
            this.onClickOutside.emit(target);
          }
        });
      }
      else{
        this.handleClick();
      }
    }
  }

}
