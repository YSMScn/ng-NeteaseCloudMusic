import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable, from } from 'rxjs';
import { Banner, HotTag, SongList, LoginParams, SimpleBack } from './data-types/common-types';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import queryString from 'query-string';
import { User, Checkin, recordVal, UserRecord, UserSongList } from './data-types/member-types';

export enum RecordType{
  allData,
  weekData
}

export type likeSongParamas = {
  pid:string;
  tracks:string;
  op : string;
}

export type shareParams = {
  id:string;
  msg:string;
  type:string;
}

@Injectable({
  providedIn: ServicesModule
})
export class MemberService {


  constructor(private http:HttpClient, @Inject(API_CONFIG) private url:string) { }

  login(formValue:LoginParams):Observable<User>{
    const params = new HttpParams({fromString:queryString.stringify(formValue)});
    return this.http.get(this.url + 'login/cellphone', {params})
    .pipe(map((res =>res as User)));
  }

  getUserDetail(uid:string):Observable<User>{
    const params = new HttpParams({ fromString: queryString.stringify({ uid }) });
    return this.http.get(this.url + 'user/detail', {params})
    .pipe(map((res =>res as User)));
  }

  logout():Observable<SimpleBack>{
    return this.http.get(this.url + 'logout')
    .pipe(map((res =>res as SimpleBack)));
  }

  checkin():Observable<Checkin>{
    const params = new HttpParams({fromString:queryString.stringify({type:1})});
    return this.http.get(this.url + 'daily_signin',{params}).pipe(map(res => res as Checkin));
  }

  getUserRecord(uid:string,type = RecordType.weekData):Observable<recordVal[]>{
    const params = new HttpParams({fromString:queryString.stringify({uid,type})});
    return this.http.get(this.url + 'user/record' , {params}).pipe(map((res:UserRecord)=>res[RecordType[type]] ));
  }

  getUserSongList(uid:string):Observable<UserSongList>{
    const params = new HttpParams({fromString:queryString.stringify({uid})});
    return this.http.get(this.url + 'user/playlist' ,{params}).pipe(map((res:{playlist:SongList[]})=>{
      const list = res.playlist;
      return{
        self:list.filter(item => !item.subscribed),
        subscribed:list.filter(item => item.subscribed)
      }
    }));
  }

  likeSong({pid,tracks,op}:likeSongParamas):Observable<number>{
    const params = new HttpParams({fromString:queryString.stringify({pid,tracks,op})});
    return this.http.get(this.url + 'playlist/tracks',{params}).pipe(map((res:SimpleBack) => res.code));
  }

  likeSinger(id:string,t = 1):Observable<number>{
    const params = new HttpParams({fromString:queryString.stringify({id,t})});
    return this.http.get(this.url + 'artist/sub',{params}).pipe(map((res:SimpleBack) => res.code));
  }

  //t=1 like t=0 unlike
  likeSheet(id:string,t:number):Observable<number>{
    const params = new HttpParams({fromString:queryString.stringify({id,t})});
    return this.http.get(this.url + 'playlist/subscribe',{params}).pipe(map((res:SimpleBack) => res.code));
  }

  createSheet(name:string):Observable<string>{
    const params = new HttpParams({fromString:queryString.stringify({name})});
    return this.http.get(this.url + 'playlist/create',{params}).pipe(map((res:SimpleBack) => res.id.toString()));
  }

  shareResource({id,msg,type}:shareParams):Observable<number>{
    const params = new HttpParams({fromString:queryString.stringify({id,msg,type})});
    return this.http.get(this.url + 'share/resource',{params}).pipe(map((res:SimpleBack) => res.code));
  }

  sendCode(phone:number):Observable<number>{
    const params = new HttpParams({fromString:queryString.stringify({phone})});
    return this.http.get(this.url + 'captcha/sent',{params}).pipe(map((res:SimpleBack) => res.code));
  }

  verifyCode(phone:number, captcha:string):Observable<number>{
    const params = new HttpParams({fromString:queryString.stringify({phone,captcha})});
    return this.http.get(this.url + 'captcha/verify',{params}).pipe(map((res:SimpleBack) => res.code));
  }

  checkExist(phone:number):Observable<number>{
    const params = new HttpParams({fromString:queryString.stringify({phone})});
    return this.http.get(this.url + 'cellphone/existence/check',{params}).pipe(map((res:{exist:number}) => res.exist));
  }
}
