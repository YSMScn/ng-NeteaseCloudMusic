import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Album, AlbumDetail, ArtistAlbum } from './data-types/common-types';
import { map } from 'rxjs/internal/operators';
import queryString from 'query-string';
export interface AlbumListParams {
  offset: number;
  limit: number;
  id: string;
}
@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }

  getAlbum(id: string): Observable<Album> {
    const params = new HttpParams().set('id', id);
    return this.http.get(this.url + 'album', {params}).pipe(map(res => res as Album));
  }

  getArtistAlbum(args: AlbumListParams): Observable<ArtistAlbum> {
    const params = new HttpParams({fromString: queryString.stringify(args)});
    return this.http.get(this.url + 'artist/album', {params}).pipe(map(res => res as ArtistAlbum));
  }
}
