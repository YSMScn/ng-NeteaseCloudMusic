import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongListComponent } from './song-list/song-list.component';
import { WyPlayerModule } from './wy-player/wy-player.module';
import { PlayCountPipe } from '../pipes/play-count.pipe';



@NgModule({
  declarations: [SongListComponent,PlayCountPipe],
  imports: [
    CommonModule,WyPlayerModule
  ],
  exports:[SongListComponent,PlayCountPipe,WyPlayerModule]
})
export class WyUiModule { }
