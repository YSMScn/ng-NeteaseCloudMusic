import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit {
  private phoneHideStr = '';
  formModel:FormGroup;
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
    this.formModel = new FormGroup({
      code:new FormControl('',[Validators.required,Validators.pattern(/\d{4}/)])
    });
  }

  onSubmit(){
    console.log("this.formModel: ", this.formModel);
  }
}
