import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { SheetListModule } from './sheet-list/sheet-list.module';
import { SheetInfoModule } from './sheet-info/sheet-info.module';
import { SongInfoModule } from './song-info/song-info.module';
import { SingerModule } from './singer/singer.module';
import { MemberModule } from './member/member.module';
import { AlbumModule } from './album/album.module';



@NgModule({
  declarations: [],
  imports: [
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule,
    SingerModule,
    MemberModule,
    AlbumModule,
  ]
  , exports: [
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule,
    SingerModule,
    MemberModule,
    AlbumModule,
  ]
})
export class PagesModule { }
