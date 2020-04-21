import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit {
  @Input()visiable=false;
  @Output()onChangeModalType = new EventEmitter<string|void>();
  formModel:FormGroup;
  constructor(private fb:FormBuilder) {
    this.formModel = this.fb.group({
      phone:['',[Validators.required,Validators.pattern(/^1\d{10}$/)]],
      password:['',[Validators.required,Validators.minLength(6)]],
    })

   }

  ngOnInit(): void {
  }


  onSubmit(){
    console.log(this.formModel);
  }
}
