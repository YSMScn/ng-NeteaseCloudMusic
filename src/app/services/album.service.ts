import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Album } from './data-types/common-types';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }

  getAlbum(id: string): Observable<Album> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'album', {params}).pipe(map(res => res as Album));
  }

  getArtistAlbum(id: string): Observable<Album[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'artist/album', {params}).pipe(map((res: {hotAlbums: Album[]}) => res.hotAlbums));
  }
}
