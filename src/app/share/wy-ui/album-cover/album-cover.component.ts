import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Album, AlbumDetail } from 'src/app/services/data-types/common-types';

@Component({
  selector: 'app-album-cover',
  templateUrl: './album-cover.component.html',
  styles: []
})
export class AlbumCoverComponent implements OnInit {
  @Input() album: AlbumDetail;
  @Output() onPlay = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  playList(evt: MouseEvent, id: string) {
    evt.stopPropagation();
    this.onPlay.emit(id);
  }

}
