import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
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
export class WyLayerShareComponent implements OnInit {
  @Input() shareInfo:ShareInfo;
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

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.formModel.valid){
      this.onShare.emit({id:this.shareInfo.id,msg:this.formModel.get('msg').value,type:this.shareInfo.type});
    }
  }
}
