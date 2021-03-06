import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongList, Singer } from 'src/app/services/data-types/common-types';
import { NzCarouselComponent, NzMessageService } from 'ng-zorro-antd';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import {SingerService} from 'src/app/services/Singer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SongListService } from 'src/app/services/song-list.service';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { SetSongList, SetPlayList, SetCurrentIndex } from 'src/app/store/actions/player.action';
import { PlayState } from 'src/app/store/reducers/player.reducer';
import { getPlayer } from 'src/app/store/selectors/player.selector';
import { findIndex, shuffle } from 'src/app/utils/array';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/services/data-types/member-types';
import { getMember, getUserId } from 'src/app/store/selectors/member.selector';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  personalizedLists: SongList[];
  settledSinger: Singer[];
  user: User;
  private playerState: PlayState;
  @ViewChild(NzCarouselComponent, {static: true}) private nzCarousel: NzCarouselComponent;
  constructor(
    // private homeServe:HomeService,
    // private singerServe:SingerService,
    private route: ActivatedRoute,
    private router: Router,
    private songListServe: SongListService,
    private batchActionServe: BatchActionsService,
    private store$: Store<AppStoreModule>,
    private memberServe: MemberService,
    private message: NzMessageService,
    ) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, personalizedLists, settledSinger]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.personalizedLists = personalizedLists;
      this.settledSinger = settledSinger;
      console.log(this.banners);
    });
    // this.getBanners();
    // this.getHotTags();
    // this.getPersonalizedList();
    // this.getSettledSinger();
    this.store$.pipe(select(getMember), select(getUserId)).subscribe(id => {
      // console.log(id);
      if (id) {
        this.getUserDetail(id);
      } else {
        this.user = null;
      }
    });
   }

  // private getBanners(){
  //   this.homeServe.getBanners().subscribe(banners => {
  //     this.banners =banners;
  //   });
  // }

  // private getHotTags(){
  //   this.homeServe.getHotTags().subscribe(hotTags => {
  //     this.hotTags =hotTags;
  //     console.log('Tags: ',hotTags);
  //   });
  // }

  // private getPersonalizedList(){
  //   this.homeServe.getPersonalizedList().subscribe(personalizedLists => {
  //     this.personalizedLists =personalizedLists;
  //     console.log('list: ',personalizedLists);
  //   });
  // }

  // private getSettledSinger(){
  //   this.singerServe.getSettledSinger().subscribe(settledSinger => {
  //     this.settledSinger =settledSinger;
  //     console.log('list: ',settledSinger);
  //   });
  // }
  ngOnInit(): void {
  }

  private getUserDetail(id: string) {
    this.memberServe.getUserDetail(id).subscribe(user => this.user = user);
  }

  beforeChange({to}) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(direction: 'pre' | 'next') {
    this.nzCarousel[direction]();
  }

  onPlayList(id: number) {
    this.songListServe.playList(id).subscribe(list => {
      this.batchActionServe.selectPlayList({list, index: 0});
    });
  }

  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }

  openModal() {
    this.batchActionServe.controlModal(true, ModalTypes.default);
  }

  onBannerClick(banner: Banner) {
    const type = banner.targetType;
    // 1 song  10 album  3000 url 1001 dj
    let url = '';
    if (type === 1) {
      url = '/songInfo/' + banner.targetId;
      this.router.navigateByUrl(url);
    } else if (type === 10) {
      url = '/album/' + banner.targetId;
      this.router.navigateByUrl(url);
    } else if (type === 3000) {
      window.open(banner.url);
    } else if (type === 1001 || type === 1004) {
      this.message.info('We don\'t provid this service now, will have this service in the future');
    }
  }
}
