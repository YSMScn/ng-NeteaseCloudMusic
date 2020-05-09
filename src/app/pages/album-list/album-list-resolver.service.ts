import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Album } from 'src/app/services/data-types/common-types';
import { Observable } from 'rxjs';
import { AlbumService } from 'src/app/services/album.service';

@Injectable()
export class AlbumListResolverService implements Resolve<Album[]> {
    constructor(private albumServe: AlbumService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<Album[]>  {
        return this.albumServe.getArtistAlbum(route.paramMap.get('id'));
    }

}
