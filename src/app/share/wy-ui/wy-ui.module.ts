import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongListComponent } from './song-list/song-list.component';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { PlayCountPipe } from '../pipes/play-count.pipe';
import { WySearchModule } from './wy-search/wy-search.module';
import { WyLayerModule } from './wy-layer/wy-layer.module';
import { ImgDefaultDirective } from '../directives/img-default.directive';
import { AlbumCoverComponent } from './album-cover/album-cover.component';



@NgModule({
  declarations: [SongListComponent, PlayCountPipe, ImgDefaultDirective, AlbumCoverComponent],
  imports: [
    CommonModule, WyPlayerModule, WySearchModule, WyLayerModule
  ],
  exports: [SongListComponent, PlayCountPipe, WyPlayerModule, WySearchModule, WyLayerModule, ImgDefaultDirective, AlbumCoverComponent]
})
export class WyUiModule { }
