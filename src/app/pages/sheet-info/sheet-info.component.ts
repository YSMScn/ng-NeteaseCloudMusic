import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SongList } from 'src/app/services/data-types/common-types';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit {
  songListInfo:SongList;
  description = {
    short:'',
    long:''
  }
  controlDesc={
    isExpand:false,
    label:'Show More',
    iconCls:'down'
  }
  constructor(private route:ActivatedRoute) { 
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res =>{
      this.songListInfo = res;
      if(res.description){
        this.changeDesc(res.description);
      }
    });
  }

  ngOnInit(): void {
  }

  private changeDesc(desc:string){
    if(desc.length<99){
      this.description={
        short:'<b>Description: </b>'+this.replaceBr(desc),
        long:''
      };
    }else{
      const str = '<b>Description: </b>'+this.replaceBr(desc);
      this.description={
        short:str.slice(0,99)+'...',
        long:str
      };
    }
  }

  private replaceBr(str:string):string{
    return str.replace(/\n/g,'<br/>');
  }

  toggleDesc(){
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if(this.controlDesc.isExpand){
      this.controlDesc.label = 'Retract';
      this.controlDesc.iconCls = "up";
    }else{
      this.controlDesc.label = 'Show More';
      this.controlDesc.iconCls = "down";
    }
  }
}
