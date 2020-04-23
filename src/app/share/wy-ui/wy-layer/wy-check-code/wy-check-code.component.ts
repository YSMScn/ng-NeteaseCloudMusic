import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit {
  private phoneHideStr = '';
  @Input()
  set phone(phones:string){
    console.log(typeof(phones));
    const arr = phones.split('');
    arr.splice(3,4,'****');
    this.phoneHideStr = arr.join('');
  }
  get phone(){
    return this.phoneHideStr;
  }
  @Input()timing:number;
  constructor() { }

  ngOnInit(): void {
  }

}
