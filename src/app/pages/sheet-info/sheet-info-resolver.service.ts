import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SongList } from 'src/app/services/data-types/common-types';
import { Observable } from 'rxjs';
import { SongListService } from 'src/app/services/song-list.service';

@Injectable()
export class SheetInfoResolverService implements Resolve<SongList> {
    constructor(private songListServe: SongListService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<SongList>  {
        console.log('test');
        return this.songListServe.getSongListDetail(Number(route.paramMap.get('id')));
    }

}
