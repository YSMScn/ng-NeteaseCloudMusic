import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SongList } from 'src/app/services/data-types/common-types';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongListComponent implements OnInit {

  @Input()songList: SongList;
  @Output()onPlay = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {  
  }

  playList(evt:MouseEvent,id:number){
    evt.stopPropagation();
    this.onPlay.emit(id);
  }

  get coverImg():string{
    return this.songList.picUrl || this.songList.coverImgUrl;
  }


}
