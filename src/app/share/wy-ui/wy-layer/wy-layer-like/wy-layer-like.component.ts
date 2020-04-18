import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SongList } from 'src/app/services/data-types/common-types';
import { likeSongParamas } from 'src/app/services/member.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { timer } from 'rxjs';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit,OnChanges {
  @Input()mySheets:SongList[];
  @Input()likeId:string;
  @Input()visiable:boolean;
  @Output()onLikeSong=new EventEmitter<likeSongParamas>();
  @Output()onCreateSheet = new EventEmitter<string>();
  creating = false;
  formModel:FormGroup;
  constructor(
    private fb:FormBuilder
  ) {
    this.formModel = this.fb.group({
      sheetName:['',[Validators.required]]
    })
   }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['visiable']){
      if(!this.visiable){
        timer(500).subscribe(()=>{
          this.formModel.get('sheetName').setValue('');
          this.formModel.reset();
          this.creating = false;
        })
      }
    }
  }

  ngOnInit(): void {
  }

  onLike(pid:string){
    this.onLikeSong.emit({pid,tracks:this.likeId,op:'add'});
  }

  onSubmit(){
    this.onCreateSheet.emit(this.formModel.get('sheetName').value);
    // this.onCreateSheet.emit(this.formModel.value.sheetName);
    // console.log('onSubmit: ', this.formModel.value);
  }
}
