import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResult } from './data-types/common-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServicesModule
})
export class SearchService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }

  search(keywords: string): Observable<SearchResult> {
    const params = new HttpParams().set('keywords', keywords);
    return this.http.get(this.url + 'search/suggest', {params})
      .pipe(map((res: {result: SearchResult}) => res.result));
  }

}
