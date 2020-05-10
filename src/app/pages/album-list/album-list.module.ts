import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumListRoutingModule } from './album-list-routing.module';
import { AlbumListComponent } from './album-list.component';
import { NzPaginationModule } from 'ng-zorro-antd';
import { AlbumCoverComponent } from 'src/app/share/wy-ui/album-cover/album-cover.component';
import { ShareModule } from 'src/app/share/share.module';


@NgModule({
  declarations: [AlbumListComponent],
  imports: [
    ShareModule,
    AlbumListRoutingModule,
  ]
})
export class AlbumListModule { }
