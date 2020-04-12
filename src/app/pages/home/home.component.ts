import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongList, Singer } from 'src/app/services/data-types/common-types';
import { NzCarouselComponent } from 'ng-zorro-antd';
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
  private playerState:PlayState;
  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;
  constructor(
    // private homeServe:HomeService,
    // private singerServe:SingerService,
    private route: ActivatedRoute,
    private router: Router,
    private songListServe:SongListService,
    private batchActionServe: BatchActionsService
    ) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners,hotTags,personalizedLists,settledSinger]) => {
      this.banners =banners;
      this.hotTags =hotTags;
      this.personalizedLists =personalizedLists;
      this.settledSinger =settledSinger;
    });


    // this.getBanners();
    // this.getHotTags();
    // this.getPersonalizedList();
    // this.getSettledSinger();
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

  beforeChange({to}){
    this.carouselActiveIndex = to;
  }

  onChangeSlide(direction:'pre' | 'next'){
    this.nzCarousel[direction]();
  }

  onPlayList(id:number){
    this.songListServe.playList(id).subscribe(list=>{
      this.batchActionServe.selectPlayList({list,index:0});
    })
  }

  toInfo(id:number){
    this.router.navigate(['/sheetInfo',id]);
  }

  openModal(){
    console.log("openModal");
    this.batchActionServe.controlModal();
  }
}
