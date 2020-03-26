import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongListComponent } from './song-list/song-list.component';
import { PlayCountPipe } from '../play-count.pipe';
import { WyPlayerModule } from './wy-player/wy-player.module';



@NgModule({
  declarations: [SongListComponent,PlayCountPipe],
  imports: [
    CommonModule,WyPlayerModule
  ],
  exports:[SongListComponent,PlayCountPipe,WyPlayerModule]
})
export class WyUiModule { }
