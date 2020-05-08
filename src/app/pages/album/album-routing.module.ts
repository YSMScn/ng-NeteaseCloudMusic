import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumComponent } from './album.component';
import { AlbumResolverService } from './album-resolver.service';


const routes: Routes = [{
  path: '',
  component: AlbumComponent,
  data: {title: 'Album'},
  resolve: {album: AlbumResolverService}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AlbumResolverService]
})
export class AlbumRoutingModule { }
