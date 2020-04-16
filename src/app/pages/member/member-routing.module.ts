import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentreComponent } from './centre/centre.component';
import { CentreResolverService } from './centre/centre-resolve.service';


const routes: Routes = [{
  path:'member/:id',component:CentreComponent, data:{title:'Personal Centre'},resolve:{user:CentreResolverService}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CentreResolverService]
})
export class MemberRoutingModule { }
