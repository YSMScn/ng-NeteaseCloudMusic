import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { recordVal } from 'src/app/services/data-types/member-types';
import { RecordType } from 'src/app/services/member.service';
import { AppStoreModule } from 'src/app/store';
import { Song, SongList, Singer } from 'src/app/services/data-types/common-types';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { SetShareInfo } from 'src/app/store/actions/member.action';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['records.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordsComponent implements OnInit{
  @Input()records:recordVal[];
  @Input()recordType = RecordType.weekData;
  @Input()listenSongs = 0;
  @Output()onChangeType = new EventEmitter<RecordType>();
  @Output()onAddSong = new EventEmitter<[Song,boolean]>();
  @Output()onLike = new EventEmitter<string>();
  @Output()onShare = new EventEmitter<Song>();
  songListInfo:SongList;
  currentSong:Song;
  @Input()currentIndex:number;
  constructor(
    private route:ActivatedRoute,
    private store$:Store<AppStoreModule>,
    private songServe:SongService,
    private batchActionServe:BatchActionsService,
    private nzMessageServe:NzMessageService
    ) {
  }

  ngOnInit(): void {
  }


}
