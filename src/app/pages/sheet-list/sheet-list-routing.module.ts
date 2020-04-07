import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetListComponent } from './sheet-list.component';


const routes: Routes = [{
  path:'sheet',
  component:SheetListComponent,
  data:{title:'List'}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetListRoutingModule { }
