import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from './services.module';
import { SongList, Song } from './data-types/common-types';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { pluck, switchMap } from 'rxjs/internal/operators';
import { SongService } from './song.service';

@Injectable({
  providedIn: 'root'
})
export class SongListService {

  constructor(
    private http:HttpClient, 
    @Inject(API_CONFIG) private url:string,
    private songServe: SongService
    ) { }

  getSongListDetail(id:number):Observable<SongList>{
    const params = new HttpParams().set('id',id.toString());
    return this.http.get(this.url+'playlist/detail',{params})
    .pipe(map((res:{playlist:SongList})=>res.playlist));
  }

  playList(id:number):Observable<Song[]>{
    return this.getSongListDetail(id).pipe(pluck('tracks'),switchMap(tracks => this.songServe.getSongList(tracks)))
  }
}
