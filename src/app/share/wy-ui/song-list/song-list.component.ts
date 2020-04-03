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

  playList(id:number){
    this.onPlay.emit(id);
  }
}
