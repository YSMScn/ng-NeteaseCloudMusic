import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Album } from 'src/app/services/data-types/common-types';
import { Observable } from 'rxjs';
import { AlbumService } from 'src/app/services/album.service';

@Injectable()
export class AlbumResolverService implements Resolve<Album> {
    constructor(private albumServe: AlbumService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<Album>  {
        console.log('TEST ALBUM-RESOLVER');
        return this.albumServe.getAlbum(route.paramMap.get('id'));
    }

}
