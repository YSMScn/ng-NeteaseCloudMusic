import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from './services.module';
import { Observable, observable } from 'rxjs';
import { SongList, SongUrl, Song } from './data-types/common-types';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private http:HttpClient, @Inject(API_CONFIG) private url:string) { }

  getSongUrl(ids:string):Observable<SongUrl[]>{
    const params = new HttpParams().set('id',ids);
    return this.http.get(this.url+'song/url',{params})
    .pipe(map((res:{data:SongUrl[]})=>res.data));
  }


  getSongList(Songs: Song| Song[]):Observable<Song[]>{
    const songArr = Array.isArray(Songs) ? Songs.slice():[Songs];
    const ids = songArr.map(item => item.id).join(',');
    return Observable.create(observer =>{
      this.getSongUrl(ids).subscribe(urls =>{
        observer.next(this.generateSongList(songArr,urls));  
      });
    })
    
  }

  generateSongList(songs: Song[], urls:SongUrl[]):Song[]{
    const result = [];
    songs.forEach(song =>{
      const url = urls.find(url => url.id == song.id).url;
      if(url){
        result.push({ ...song,url});
      }
    });
    return result;
  }
}

