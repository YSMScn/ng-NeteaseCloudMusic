import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable, from } from 'rxjs';
import { Banner, HotTag, SongList, LoginParams } from './data-types/common-types';
import { HttpClient, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import queryString from 'query-string';
import { User } from './data-types/member-types';

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

}
