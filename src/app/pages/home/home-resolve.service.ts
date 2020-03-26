import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/Singer.service';
import { Banner, HotTag, SongList, Singer } from 'src/app/services/data-types/common-types';
import { first } from 'rxjs/internal/operators';

type HomeDataType=[
  Banner[],HotTag[],SongList[],Singer[]
]



@Injectable({
  providedIn: 'root',
})
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(
    private homeServe:HomeService,
    private singerServe:SingerService,) {}

  resolve(): Observable<HomeDataType>{
    return forkJoin([
      this.homeServe.getBanners(),
      this.homeServe.getHotTags(),
      this.homeServe.getPersonalizedList(),
      this.singerServe.getSettledSinger()
    ]).pipe(first());
  }
}