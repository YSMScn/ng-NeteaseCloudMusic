import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongListComponent } from './song-list/song-list.component';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { PlayCountPipe } from '../pipes/play-count.pipe';
import { WySearchModule } from './wy-search/wy-search.module';



@NgModule({
  declarations: [SongListComponent,PlayCountPipe],
  imports: [
    CommonModule,WyPlayerModule,WySearchModule
  ],
  exports:[SongListComponent,PlayCountPipe,WyPlayerModule,WySearchModule]
})
export class WyUiModule { }
