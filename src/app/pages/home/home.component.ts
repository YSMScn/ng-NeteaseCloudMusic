import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongList, Singer } from 'src/app/services/data-types/common-types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import {SingerService} from 'src/app/services/Singer.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SongListService } from 'src/app/services/song-list.service';

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
  @ViewChild(NzCarouselComponent,{static:true}) private nzCarousel:NzCarouselComponent;
  constructor(
    // private homeServe:HomeService,
    // private singerServe:SingerService,
    private route: ActivatedRoute,
    private songListServe:SongListService
    ) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners,hotTags,personalizedLists,settledSinger]) => {
      this.banners =banners;
      this.hotTags =hotTags;
      this.personalizedLists =personalizedLists;
      this.settledSinger =settledSinger;
    })
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
    console.log('id ',id);
    this.songListServe.getSongListDetail(id).subscribe(res=>{
      console.log('res: ', res);
    })
  }

}
