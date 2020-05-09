import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumListRoutingModule } from './album-list-routing.module';
import { AlbumListComponent } from './album-list.component';


@NgModule({
  declarations: [AlbumListComponent],
  imports: [
    CommonModule,
    AlbumListRoutingModule
  ]
})
export class AlbumListModule { }
