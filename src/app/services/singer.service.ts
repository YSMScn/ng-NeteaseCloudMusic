import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Singer, SingerDetail } from './data-types/common-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import queryString from 'query-string';


interface SingerParams {
  offset: number;
  limit: number;
  cat?: string;
}

const defualtParams: SingerParams = {
  offset: 0,
  limit: 10,
  cat: '5001'
};
@Injectable({
  providedIn: ServicesModule
})
export class SingerService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }

  getSettledSinger(args: SingerParams = defualtParams): Observable<Singer[]> {
    const params = new HttpParams({fromString: queryString.stringify(args)});
    return this.http.get(this.url + 'artist/list', {params})
    .pipe(map((res: {artists: Singer[]}) => res.artists));
  }

  getSingerDetail(id: string): Observable<SingerDetail> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'artists', {params}).pipe(map(res => res as SingerDetail));
  }

  getSimiSinger(id: string): Observable<Singer[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'simi/artist', {params}).pipe(map((res: {artists: Singer[]}) => res.artists));
  }
}
