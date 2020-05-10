import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlbumListComponent } from './album-list.component';
import { AlbumListResolverService } from './album-list-resolver.service';


const routes: Routes = [{
  path: '',
  component: AlbumListComponent,
  data: {title: 'Albumssssssss'},
  resolve: {albumList: AlbumListResolverService}
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AlbumListResolverService]
})
export class AlbumListRoutingModule { }
