import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { ShareInfo } from 'src/app/store/reducers/member.reducer';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { shareParams } from 'src/app/services/member.service';

const MAX_MSG = 140;

@Component({
  selector: 'app-wy-layer-share',
  templateUrl: './wy-layer-share.component.html',
  styleUrls: ['wy-layer-share.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerShareComponent implements OnInit,OnChanges {
  @Input() shareInfo:ShareInfo;
  @Input() visiable=false;
  formModel:FormGroup;
  @Output()onCancel = new EventEmitter<void>();
  @Output()onShare = new EventEmitter<shareParams>();
  textCount = MAX_MSG;
  constructor() {
    this.formModel = new FormGroup({
      msg:new FormControl('',Validators.maxLength(MAX_MSG))
    })
    this.formModel.get('msg').valueChanges.subscribe(msg=>{
      this.textCount = MAX_MSG - msg.length
    })
   }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    const visiable = changes['visiable'];
    if(visiable && !visiable.firstChange){
      this.formModel.markAllAsTouched();
    }
  }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.formModel.valid){
      this.onShare.emit({id:this.shareInfo.id,msg:this.formModel.get('msg').value,type:this.shareInfo.type});
    }
  }
}
