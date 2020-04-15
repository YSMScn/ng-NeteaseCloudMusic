import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable, from } from 'rxjs';
import { Banner, HotTag, SongList, LoginParams, SimpleBack } from './data-types/common-types';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import queryString from 'query-string';
import { User, Checkin } from './data-types/member-types';

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
}
