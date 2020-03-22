import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongList } from './data-types/common-types';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/internal/operators'

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {
  [x: string]: any;

  constructor(private http:HttpClient, @Inject(API_CONFIG) private url:string) { }

  getBanners():Observable<Banner[]>{
    return this.http.get(this.url + 'banner')
    .pipe(map((res:{banners:Banner[]}) => res.banners));
  }

  getHotTags():Observable<HotTag[]>{
    return this.http.get(this.url+'playlist/hot')
    .pipe(map((res:{tags:HotTag[]})=>{
      return res.tags.sort((x:HotTag,y:HotTag)=>{
        return x.position - y.position;
      }).slice(0,5);
    }));
  }

  getPersonalizedList():Observable<SongList[]>{
    return this.http.get(this.url+'personalized')
    .pipe(map((res:{result:SongList[]})=>res.result.slice(0,16)));
  }


}
