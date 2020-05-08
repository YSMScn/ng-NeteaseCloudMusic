import { Component, OnInit, OnDestroy } from '@angular/core';
import { Album, Song, SongList, Singer } from 'src/app/services/data-types/common-types';
import { AlbumService } from 'src/app/services/album.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { getPlayer, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { findIndex } from 'src/app/utils/array';
import { Subject } from 'rxjs';
import { SetShareInfo } from 'src/app/store/actions/member.action';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['album.component.less']
})
export class AlbumComponent implements OnInit, OnDestroy {
  album: Album;
  description = {
    short: '',
    long: ''
  };
  controlDesc = {
    isExpand: false,
    label: 'Show More',
    iconCls: 'down'
  };
  currentSong: Song;
  currentIndex: number;
  destory$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService,
    private memberServe: MemberService
  ) {
    this.route.data.pipe(map(res => res.album)).subscribe(res => {
      this.album = res;
      console.log('album: ', this.album);
      if (res.album.description) {
        this.changeDesc(res.album.description);
      }
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
        this.currentIndex = findIndex(this.album.songs, song);
      } else {
        this.currentIndex = -1;
      }
    });
  }

  private changeDesc(desc: string) {
    if (desc.length < 99) {
      this.description = {
        short: '<b>Description: </b>' + this.replaceBr(desc),
        long: ''
      };
    } else {
      const str = '<b>Description: </b>' + this.replaceBr(desc);
      this.description = {
        short: str.slice(0, 99) + '...',
        long: str
      };
    }
  }

  private replaceBr(str: string): string {
    return str.replace(/\n/g, '<br/>');
  }

  toggleDesc() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.label = 'Retract';
      this.controlDesc.iconCls = 'up';
    } else {
      this.controlDesc.label = 'Show More';
      this.controlDesc.iconCls = 'down';
    }
  }

  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id !== song.id) {
      this.songServe.getSongList(song).subscribe(list => {
        if (list.length) {
          this.batchActionServe.insertSong(list[0], isPlay);
        } else {
          this.alertMessage('warning', 'Can\'t find url');
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
  onLikeSongs(songs: Song[]) {
    const ids = songs.map(item => item.id).join(',');
    this.onLikeSong(ids);
  }

  private alertMessage(type: string, msg: string) {
    this.nzMessageServe.create(type, msg);
  }

  shareResouce(resource: Song|Album, type= 'song') {
    let txt = '';
    if (type === 'playlist') {
      txt = this.makeTxt('Song list', (resource as Album).album.name, (resource as Album).album.artist.name);
    } else {
      txt = this.makeTxt('Song', (resource as Song).name, (resource as Song).ar);
    }
    this.store$.dispatch(SetShareInfo({shareInfo: {id: '', type, txt}}));
    console.log(txt);
  }

  private makeTxt(type: string, name: string, makeBy: string|Singer[]): string {
    let makeByStr = '';
    if (Array.isArray(makeBy)) {
      makeByStr = makeBy.map(item => item.name).join('/');
    } else {
      makeByStr = makeBy;
    }
    return `${type}: ${name} -- ${makeByStr}`;
  }
}
