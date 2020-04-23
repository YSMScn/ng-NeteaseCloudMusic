import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MemberService } from 'src/app/services/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import { interval } from 'rxjs';
import { take } from 'rxjs/internal/operators';

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
  timing:number;
  showCode = true;
  constructor(
    private fb:FormBuilder,
    private memberServe:MemberService,
    private messageServe:NzMessageService
    ) {
    this.formModel = this.fb.group({
      phone:['',[Validators.required,Validators.pattern(/^1\d{10}$/)]],
      password:['',[Validators.required,Validators.minLength(6)]],
    })

   }

  ngOnInit(): void {
  }


  onSubmit(){
    if(this.formModel.valid){
      this.sendCode();
    }
  }

  private sendCode(){
    this.memberServe.sendCode(this.formModel.get('phone').value).subscribe(code=>{
      this.timing = 60;
      if(!this.showCode){
        this.showCode = true;
      }
      interval(1000).pipe(take(60)).subscribe(()=>{
        this.timing--;
        console.log(this.timing);
      });
    },error => {
      this.messageServe.error(error.message);
    })
  }

  changeType(){
    this.onChangeModalType.emit('default');
    this.showCode = false;
    this.formModel.reset();
  }
}
