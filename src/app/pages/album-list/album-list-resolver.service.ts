import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Album, AlbumDetail, ArtistAlbum } from 'src/app/services/data-types/common-types';
import { Observable } from 'rxjs';
import { AlbumService, AlbumListParams } from 'src/app/services/album.service';

@Injectable()
export class AlbumListResolverService implements Resolve<ArtistAlbum> {
  albumParams: AlbumListParams = {
    offset: 1,
    limit: 35,
    id: ''
  };
    constructor(private albumServe: AlbumService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<ArtistAlbum>  {
      this.albumParams.id = route.queryParamMap.get('id');
      return this.albumServe.getArtistAlbum(this.albumParams);
    }

}
