import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongListComponent } from './song-list/song-list.component';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { PlayCountPipe } from '../pipes/play-count.pipe';
import { WySearchModule } from './wy-search/wy-search.module';
import { WyLayerModule } from './wy-layer/wy-layer.module';



@NgModule({
  declarations: [SongListComponent,PlayCountPipe],
  imports: [
    CommonModule,WyPlayerModule,WySearchModule,WyLayerModule
  ],
  exports:[SongListComponent,PlayCountPipe,WyPlayerModule,WySearchModule,WyLayerModule]
})
export class WyUiModule { }
