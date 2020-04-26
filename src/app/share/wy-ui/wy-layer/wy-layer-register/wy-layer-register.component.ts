import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MemberService } from 'src/app/services/member.service';
import { NzMessageService } from 'ng-zorro-antd';
import { interval } from 'rxjs';
import { take } from 'rxjs/internal/operators';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

// export type CheckCodeRes = {
//   passed:boolean;

// }

enum Exist  {
  'Exist'=1,
  'Nonexist'=-1
}

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit,OnChanges {
  @Input()visiable=false;
  @Output()onChangeModalType = new EventEmitter<string|void>();
  @Output()onRegister = new EventEmitter<string>();
  formModel:FormGroup;
  timing:number;
  showCode = false;
  checkPassed = true;
  constructor(
    private fb:FormBuilder,
    private memberServe:MemberService,
    private messageServe:NzMessageService,
    private cdr:ChangeDetectorRef
    ) {
    this.formModel = this.fb.group({
      phone:['',[Validators.required,Validators.pattern(/^1\d{10}$/)]],
      password:['',[Validators.required,Validators.minLength(6)]],
    })

   }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    const visiable = changes['visiable'];
    if(visiable && !visiable.firstChange){
      if(!this.visiable){
        this.showCode = false;
      }
      this.formModel.markAllAsTouched();
    }
  }

  ngOnInit(): void {
  }


  onSubmit(){
    if(this.formModel.valid){
      this.sendCode();
    }
  }

  sendCode(){
    this.memberServe.sendCode(this.formModel.get('phone').value).subscribe(code=>{
      this.timing = 60;
      if(!this.showCode){
        this.showCode = true;
      }
      this.cdr.markForCheck();
      interval(1000).pipe(take(60)).subscribe(()=>{
        this.timing--;
        console.log(this.timing);
        this.cdr.markForCheck();
      });
    },error => {
      this.messageServe.error(error.message);
    })

  }

  changeType(type = ModalTypes.default){
    this.onChangeModalType.emit(type);
    this.showCode = false;
    this.formModel.reset();
  }

  onCheckCode(code:string){
    console.log('onCheckCode');
    this.memberServe.verifyCode(this.formModel.get('phone').value,code).subscribe(res=>{
      console.log(res);
      this.checkPassed = true;
    },error =>{
      console.log(error.message);
      this.checkPassed = false;
      this.cdr.markForCheck();
    },()=>{
      this.cdr.markForCheck();
    });
  }

  onCheckExist(phone:string){
    this.memberServe.checkExist(Number(phone)).subscribe(res=>{
      if(Exist[res] == 'Exist'){
        this.messageServe.error('This account is already exist');
        this.changeType(ModalTypes.LoginByPhone);
      }
      else{
        this.onRegister.emit(phone);
      }
    })
  }
}
