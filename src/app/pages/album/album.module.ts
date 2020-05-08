import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumComponent } from './album.component';
import { ShareModule } from 'src/app/share/share.module';


@NgModule({
  declarations: [AlbumComponent],
  imports: [
    CommonModule,
    AlbumRoutingModule,
    ShareModule
  ]
})
export class AlbumModule { }
