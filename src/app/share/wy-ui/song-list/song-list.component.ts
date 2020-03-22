import { Component, OnInit, Input } from '@angular/core';
import { SongList } from 'src/app/services/data-types/common-types';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.less']
})
export class SongListComponent implements OnInit {

  @Input()songList: SongList;
  constructor() { }

  ngOnInit(): void {
  }

}
