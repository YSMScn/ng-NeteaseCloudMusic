import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/Singer.service';
import { Banner, HotTag, SongList, Singer } from 'src/app/services/data-types/common-types';
import { first } from 'rxjs/internal/operators';
import { MemberService } from 'src/app/services/member.service';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/services/data-types/member-types';

type HomeDataType=[
  Banner[],HotTag[],SongList[],Singer[]
]



@Injectable({
  providedIn: 'root',
})
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(
    private homeServe:HomeService,
    private singerServe:SingerService,
    private memberServe:MemberService,
    private storageServe:StorageService
    ) {}

  resolve(): Observable<HomeDataType>{
    // const userId = this.storageServe.getStorage('wyUserId');
    // let detail$ = of(null);
    // if(userId){
    //   detail$ = this.memberServe.getUserDetail(userId);
    // }
    return forkJoin([
      this.homeServe.getBanners(),
      this.homeServe.getHotTags(),
      this.homeServe.getPersonalizedList(),
      this.singerServe.getSettledSinger(),
    ]).pipe(first());
  }
}
