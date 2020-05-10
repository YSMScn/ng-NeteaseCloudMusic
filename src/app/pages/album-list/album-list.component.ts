import { Component, OnInit } from '@angular/core';
import { Album, AlbumDetail, ArtistAlbum } from 'src/app/services/data-types/common-types';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { AlbumService, AlbumListParams } from 'src/app/services/album.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['album-list.component.less']
})
export class AlbumListComponent implements OnInit {
  albumParams: AlbumListParams = {
    offset: 0,
    limit: 35,
    id: ''
  };
  artistAlbum: ArtistAlbum;
  albumList: AlbumDetail[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private batchActionServe: BatchActionsService,
    private albumServe: AlbumService
  ) {
    this.route.data.pipe(map(res => res.albumList)).subscribe(res => {
      this.artistAlbum = res;
      this.albumList = res.hotAlbums;
      this.albumParams.id = this.artistAlbum.artist.id.toString();
      console.log(this.albumList);
    });
   }

  ngOnInit(): void {
  }

  toInfo(id: string) {
    this.router.navigate(['/album', id]);
  }

  onPlayList(album: string) {
    this.albumServe.getAlbum(album).subscribe(res => {
      this.batchActionServe.clearSong();
      this.batchActionServe.insertSongs(res.songs);
    });
  }

  onPageChange(index: number) {
    this.albumParams.offset = (index - 1) * this.albumParams.limit;
    this.getList();
  }

  private getList() {
    this.albumServe.getArtistAlbum(this.albumParams).subscribe(res => {
      this.albumList = res.hotAlbums;
    });
  }
}
