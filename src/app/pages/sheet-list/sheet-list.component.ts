import { Component, OnInit } from '@angular/core';
import { PlayListParams, SongListService } from 'src/app/services/song-list.service';
import { ActivatedRoute } from '@angular/router';
import { PlayList } from 'src/app/services/data-types/common-types';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styles: []
})
export class SheetListComponent implements OnInit {
  listParams:PlayListParams = {
    cat:'全部',
    order:'hot',
    offset:1,
    limit:35
  }
  songList:PlayList;
  constructor(
    private route:ActivatedRoute,
    private songListServe:SongListService
  ) {
    this.listParams.cat = this.route.snapshot.queryParamMap.get('cat') || '全部';
    this.getList();

   }


  ngOnInit(): void {
  }

  private getList(){
    this.songListServe.getSongList(this.listParams).subscribe(res=> this.songList = res);
  }
}
