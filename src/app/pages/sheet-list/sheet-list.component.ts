import { Component, OnInit } from '@angular/core';
import { PlayListParams, SongListService } from 'src/app/services/song-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayList } from 'src/app/services/data-types/common-types';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { AlbumService } from 'src/app/services/album.service';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['sheet-list.component.less']
})
export class SheetListComponent implements OnInit {
  listParams: PlayListParams = {
    cat: '全部',
    order: 'hot',
    offset: 0,
    limit: 35
  };
  orderValue = 'hot';
  songList: PlayList;
  artistId: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private songListServe: SongListService,
    private batchActionServe: BatchActionsService,
    private albumServe: AlbumService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();
   }


  ngOnInit(): void {
  }

  private getList() {
      this.songListServe.getSongList(this.listParams).subscribe(res => this.songList = res);
  }

  onPlayList(id: number) {
    this.songListServe.playList(id).subscribe(list => {
      this.batchActionServe.selectPlayList({list, index: 0});
    });
  }

  onOrderChange(order: 'new'|'hot') {
    this.listParams.order = order;
    this.listParams.offset = 0;
    this.getList();
  }

  onPageChange(index: number) {
    this.listParams.offset = (index - 1) * this.listParams.limit;
    this.getList();
  }

  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }
}
