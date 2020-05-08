import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SingerDetail, Song, Singer } from 'src/app/services/data-types/common-types';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { findIndex } from 'src/app/utils/array';
import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Subject } from 'rxjs';
import { SetShareInfo } from 'src/app/store/actions/member.action';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  singerDetail: SingerDetail;
  currentSong: Song;
  currentIndex: number;
  similarSingers: Singer[];
  hasLiked = false;
  private destory$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService,
    private memberServe: MemberService
    ) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(([detail, similarSingers]) => {
      this.singerDetail = detail;
      this.similarSingers = similarSingers;
      console.log(this.similarSingers);
      console.log(this.singerDetail);
      this.listenCurrent();
    });

   }
  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }

  ngOnInit(): void {
  }

  private listenCurrent() {
    this.store$.pipe(select(getPlayer), select(getCurrentSong), takeUntil(this.destory$)).subscribe(song => {
      this.currentSong = song;
      if (song) {
        this.currentIndex = findIndex(this.singerDetail.hotSongs, song);
      } else {
        this.currentIndex = -1;
      }
    });
  }

  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song).subscribe(list => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], isPlay);
        } else {
          this.nzMessageServe.create('warning', 'Can\'t find url');
        }

      });
    }
  }

  onAddSongs(songs: Song[], isPlay = false) {
    this.songServe.getSongList(songs).subscribe(list => {
      if (list.length) {
        if (isPlay) {
          this.batchActionServe.selectPlayList({list, index: 0});
        } else {
          this.batchActionServe.insertSongs(list);
        }

      }
    });
  }

  onLikeSong(id: string) {
    this.batchActionServe.likeSong(id);
  }

  onShare(song: Song) {
    const txt = this.makeTxt('Song', song.name, song.ar);
    const type = 'song';
    this.store$.dispatch(SetShareInfo({shareInfo: {id: song.id.toString(), type, txt}}));
    console.log(txt);
  }

  private makeTxt(type: string, name: string, makeBy: Singer[]): string {
    let makeByStr = '';
    if (Array.isArray(makeBy)) {
      makeByStr = makeBy.map(item => item.name).join('/');
    } else {
      makeByStr = makeBy;
    }
    return `${type}: ${name} -- ${makeByStr}`;
  }

  onLikeSongs(songs: Song[]) {
    const ids = songs.map(item => item.id).join(',');
    this.onLikeSong(ids);
  }

  onLikeSinger(id: string) {
    let typeInfo = {
      type: 1,
      msg: 'Liked'
    };
    if (this.hasLiked) {
      typeInfo = {
        type: 2,
        msg: 'unliked'
      };
    }
    this.memberServe.likeSinger(id, typeInfo.type).subscribe(code => {
      this.hasLiked = !this.hasLiked;
      this.alertMessage('success', typeInfo.msg + ' successed');
    }, error => {
      this.alertMessage('error', error.msg || typeInfo.msg + ' failed');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.nzMessageServe.create(type, msg);
  }
}
