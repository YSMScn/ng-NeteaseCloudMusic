import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/services/data-types/common-types';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['album-list.component.less']
})
export class AlbumListComponent implements OnInit {
  albumList: Album[];
  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.data.pipe(map(res => res.albumList)).subscribe(res => {
      this.albumList = res;
      console.log(this.albumList);
    });
   }

  ngOnInit(): void {
  }

}
