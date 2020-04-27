import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SongInfoComponent } from './song-info.component';
import { SongInfoResolverService } from './sheet-info-resolver.service';


const routes: Routes = [{
  path:'',
  component:SongInfoComponent,
  data:{title:'Song Info'},
  resolve:{songInfo:SongInfoResolverService}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[SongInfoResolverService]
})
export class SongInfoRoutingModule { }
