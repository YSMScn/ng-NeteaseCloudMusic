import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongListComponent } from './song-list/song-list.component';
import { PlayCountPipe } from '../play-count.pipe';



@NgModule({
  declarations: [SongListComponent,PlayCountPipe],
  imports: [
    CommonModule
  ],
  exports:[SongListComponent,PlayCountPipe]
})
export class WyUiModule { }
